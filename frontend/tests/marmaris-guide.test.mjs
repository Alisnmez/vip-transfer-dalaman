import assert from 'node:assert/strict'
import { test } from 'node:test'
import { marmarisSlowDayGuide } from '../src/content/guides/marmaris-slow-day.ts'
import { travelGuides } from '../src/content/guides/index.ts'

test('Marmaris guide is discoverable with a unique public route', () => {
  assert.equal(travelGuides.filter(guide => guide.path === marmarisSlowDayGuide.path).length, 1)
  assert.equal(new Set(travelGuides.map(guide => guide.path)).size, travelGuides.length)
})

test('Marmaris article is fully translated in EN, DE and RU', () => {
  const sections = marmarisSlowDayGuide.translations.en.sections.length
  for (const language of ['en', 'de', 'ru']) {
    const article = marmarisSlowDayGuide.translations[language]
    for (const key of ['title', 'description', 'intro', 'cardDescription', 'category']) {
      assert.ok(article[key].trim().length > 15, `${language} missing ${key}`)
    }
    assert.equal(article.sections.length, sections)
    for (const section of article.sections) {
      assert.ok(section.heading.length > 5)
      assert.ok(('paragraphs' in section && section.paragraphs.length > 0) ||
        ('bullets' in section && section.bullets.length > 0) ||
        ('faqs' in section && section.faqs.length > 0))
    }
  }
  assert.notEqual(marmarisSlowDayGuide.translations.de.title, marmarisSlowDayGuide.translations.en.title)
  assert.notEqual(marmarisSlowDayGuide.translations.ru.title, marmarisSlowDayGuide.translations.en.title)
})
