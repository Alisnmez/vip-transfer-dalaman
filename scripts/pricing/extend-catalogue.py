#!/usr/bin/env python3
"""Reproduce the owner's distance-based GBP tariff; no live network requests.

The frozen original catalogue is the calibration input. Existing catalogue rows
are never overwritten, including prices later changed through the admin panel.
This script changes static files only; it does not access a database.
"""
import bisect
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/pricing'

def read(path):
    return json.loads(path.read_text())

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def interpolate(points, km):
    # A monotonic envelope prevents newly estimated longer routes being cheaper.
    envelope = []
    for distance, fare in sorted(points):
        envelope.append((distance, max(fare, envelope[-1][1] if envelope else fare)))
    if km >= envelope[-1][0]:
        distance, fare = envelope[-1]
        return fare * km / distance
    index = bisect.bisect_left([p[0] for p in envelope], km)
    if index == 0:
        return envelope[0][1]
    x0, y0 = envelope[index - 1]
    x1, y1 = envelope[index]
    return y0 + (y1 - y0) * (km - x0) / (x1 - x0)

def main():
    original = read(DOCS / 'original-catalogue-2026-11-18.json')
    inputs = read(DOCS / 'distance-inputs-2026-11-18.json')
    lookup = {(r['destination'], r['vehicleId']): r for r in original}
    vehicles = list(dict.fromkeys(r['vehicleId'] for r in original))
    rows = list(original)
    audit = []
    for destination, reference in [('Bozburun', 'Bozburun / Sogut'), ('Sogut', 'Bozburun / Sogut'), ('Marmaris Cruise Port', 'Marmaris(Any Hotel)')]:
        for vehicle in vehicles:
            row = {**lookup[reference, vehicle], 'destination': destination}
            rows.append(row)
            audit.append({**row, 'method': 'verified combined source zone' if destination != 'Marmaris Cruise Port' else ('verified source taxi fare' if vehicle == 'taxi' else 'estimated same Marmaris zone'), 'reference': reference})
    errors = {}
    for vehicle in vehicles:
        points = [(a['distanceKm'], lookup[a['destination'], vehicle]['oneWay']) for a in inputs['calibration']]
        residuals = []
        for i, (km, fare) in enumerate(points):
            if 0 < i < len(points) - 1:
                residuals.append(abs(interpolate(points[:i] + points[i+1:], km) - fare))
        errors[vehicle] = {'leaveOneOutMeanAbsoluteErrorGbp': round(sum(residuals)/len(residuals), 2), 'maxAbsoluteErrorGbp': round(max(residuals), 2)}
        for target in inputs['newDestinations']:
            amount = math.ceil(interpolate(points, target['distanceKm']) / 2.5 - 1e-9) * 2.5
            row = {'destination': target['destination'], 'vehicleId': vehicle, 'oneWay': amount, 'roundTrip': amount * 2}
            rows.append(row)
            audit.append({**row, **{k: v for k, v in target.items() if k != 'destination'}, 'method': 'estimated distance interpolation' if target['distanceKm'] <= 164 else 'estimated long-distance proportional extrapolation'})
    assert len(rows) == 531 and len({(r['destination'], r['vehicleId']) for r in rows}) == 531
    assert rows[:len(original)] == original
    write(ROOT / 'src/main/resources/transfer-prices.json', rows)
    pricing_path = ROOT / 'frontend/src/features/booking/pricing.ts'
    text = pricing_path.read_text()
    start = text.index('export const transferPrices = ')
    end = text.index('\n\nexport function findTransferPrice', start)
    text = text[:start] + 'export const transferPrices = ' + json.dumps(rows, ensure_ascii=False, indent=2) + text[end:]
    text = text.replace('// Fixed GBP prices from the supplied competitor price list.\n// One way: competitor - £2.50; round trip: competitor - £5.00.', '// GBP catalogue: verified source fares plus owner-authorized distance estimates.\n// Provenance and reproduction: docs/pricing/SOURCE_COVERAGE_2026-11-18.md.')
    pricing_path.write_text(text)
    write(DOCS / 'generated-fare-audit-2026-11-18.json', {'generatedFrom': 'distance-inputs-2026-11-18.json', 'currency': 'GBP', 'roundTripRule': '2 x oneWay for new estimates; no additional competitor discount', 'validation': errors, 'newFares': audit})
    print('59 destinations; 531 fares. Original 225 unchanged. Error metrics:', errors)

if __name__ == '__main__':
    main()
