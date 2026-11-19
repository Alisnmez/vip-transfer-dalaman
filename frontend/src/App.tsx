import { AppProviders } from './app/providers'
import { clearPersistentBookingData } from './features/booking/receipt'

// Remove sensitive drafts and receipts left by older versions in persistent browser storage.
// The current booking flow uses tab-scoped sessionStorage instead.
function clearLegacyBookingStorage() {
  try {
    clearPersistentBookingData(localStorage)
  } catch {
    // Private browsing or disabled storage must not prevent the app from loading.
  }
}

clearLegacyBookingStorage()

function App() {
  return <AppProviders />
}

export default App
