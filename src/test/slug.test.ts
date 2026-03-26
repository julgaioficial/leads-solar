import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import {
  generateSlug,
  ensureUniqueSlug,
  buildWhiteLabelUrl,
  calcTrialEndsAt,
} from '@/lib/slug'
import { SupabaseClient } from '@supabase/supabase-js'

describe('generateSlug', () => {
  // Feature: white-label-site-activation, Property 1: Formato válido do slug
  it('Property 1: should generate valid slug format (only [a-z0-9-], no leading/trailing hyphens, no consecutive hyphens)', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const slug = generateSlug(name.length > 0 ? name : 'a')
        // Valid format: only [a-z0-9-], no leading/trailing hyphens, no consecutive hyphens
        const validFormat =
          /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug) && !slug.includes('--')
        return validFormat
      }),
      { numRuns: 100 }
    )
  })

  // Feature: white-label-site-activation, Property 2: Tamanho do slug
  it('Property 2: should generate slug with length between 3 and 60 characters', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (name) => {
        const slug = generateSlug(name)
        return slug.length >= 3 && slug.length <= 60
      }),
      { numRuns: 100 }
    )
  })

  it('should handle empty string by generating random suffix', () => {
    const slug = generateSlug('')
    expect(slug).toMatch(/^\d{4}$/)
    expect(slug.length).toBe(4)
  })

  it('should remove accents and diacritics', () => {
    expect(generateSlug('Café')).toBe('cafe')
    expect(generateSlug('São Paulo')).toBe('sao-paulo')
    expect(generateSlug('Açúcar')).toBe('acucar')
  })

  it('should convert to lowercase', () => {
    expect(generateSlug('HELLO WORLD')).toBe('hello-world')
    expect(generateSlug('MixedCase')).toBe('mixedcase')
  })

  it('should replace spaces and special characters with hyphens', () => {
    expect(generateSlug('hello world')).toBe('hello-world')
    expect(generateSlug('hello@world')).toBe('hello-world')
    expect(generateSlug('hello_world')).toBe('hello-world')
  })

  it('should remove consecutive hyphens', () => {
    expect(generateSlug('hello---world')).toBe('hello-world')
    expect(generateSlug('hello  world')).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug('-hello-')).toBe('hello')
    expect(generateSlug('--hello--')).toBe('hello')
  })

  it('should truncate to 60 characters', () => {
    const longName = 'a'.repeat(100)
    const slug = generateSlug(longName)
    expect(slug.length).toBeLessThanOrEqual(60)
  })

  it('should append 4-digit random suffix for short slugs', () => {
    const slug = generateSlug('ab')
    expect(slug).toMatch(/^ab-\d{4}$/)
    expect(slug.length).toBe(7)
  })

  it('should handle single character by appending suffix', () => {
    const slug = generateSlug('a')
    expect(slug).toMatch(/^a-\d{4}$/)
  })

  it('should handle complex real-world company names', () => {
    expect(generateSlug('Solar Energy LTDA')).toBe('solar-energy-ltda')
    expect(generateSlug('Energia & Soluções')).toBe('energia-solucoes')
    expect(generateSlug('ABC-123')).toBe('abc-123')
  })
})

describe('ensureUniqueSlug', () => {
  // Feature: white-label-site-activation, Property 3: Unicidade do slug
  it('Property 3: should return a slug not present in existing slugs set', async () => {
    // Test with multiple scenarios to verify uniqueness property
    const testCases = [
      { existing: [], baseSlug: 'test' },
      { existing: ['test'], baseSlug: 'test' },
      { existing: ['test', 'test-2'], baseSlug: 'test' },
      { existing: ['solar', 'solar-2', 'solar-3'], baseSlug: 'solar' },
    ]

    for (const testCase of testCases) {
      const existingSlugs = new Set(testCase.existing)

      const mockSupabaseClient = {
        from: () => ({
          select: () => ({
            eq: (field: string, value: string) => ({
              maybeSingle: async () => ({
                data: existingSlugs.has(value) ? { slug: value } : null,
                error: null,
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient

      const result = await ensureUniqueSlug(testCase.baseSlug, mockSupabaseClient)
      expect(!existingSlugs.has(result)).toBe(true)
    }
  })

  it('should return base slug if not found in database', async () => {
    const mockSupabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient

    const result = await ensureUniqueSlug('unique-slug', mockSupabaseClient)
    expect(result).toBe('unique-slug')
  })

  it('should try suffixes -2, -3, etc. until finding unique slug', async () => {
    const existingSlugs = new Set(['solar-energy', 'solar-energy-2'])
    let queryCount = 0

    const mockSupabaseClient = {
      from: () => ({
        select: () => ({
          eq: (field: string, value: string) => ({
            maybeSingle: async () => {
              queryCount++
              return {
                data: existingSlugs.has(value) ? { slug: value } : null,
                error: null,
              }
            },
          }),
        }),
      }),
    } as unknown as SupabaseClient

    const result = await ensureUniqueSlug('solar-energy', mockSupabaseClient)
    expect(result).toBe('solar-energy-3')
    expect(queryCount).toBe(3)
  })

  it('should throw error after 100 attempts', async () => {
    const mockSupabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: { slug: 'existing' },
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient

    await expect(
      ensureUniqueSlug('test-slug', mockSupabaseClient)
    ).rejects.toThrow(/Could not find a unique slug after 100 attempts/)
  })

  it('should throw error if database query fails', async () => {
    const mockSupabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient

    await expect(
      ensureUniqueSlug('test-slug', mockSupabaseClient)
    ).rejects.toThrow('Database error')
  })
})

describe('buildWhiteLabelUrl', () => {
  // Feature: white-label-site-activation, Property 7: Formato do link no dashboard
  it('Property 7: should build correct white-label URL format', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (slug) => {
        const link = buildWhiteLabelUrl(slug)
        return link === `${window.location.origin}/s/${slug}`
      }),
      { numRuns: 100 }
    )
  })

  it('should return correct URL with slug', () => {
    const slug = 'solar-energy'
    const url = buildWhiteLabelUrl(slug)
    expect(url).toBe(`${window.location.origin}/s/${slug}`)
  })

  it('should handle special characters in slug', () => {
    const slug = 'test-123'
    const url = buildWhiteLabelUrl(slug)
    expect(url).toBe(`${window.location.origin}/s/test-123`)
  })
})

describe('calcTrialEndsAt', () => {
  // Feature: white-label-site-activation, Property 5: Trial ends_at é 7 dias no futuro
  it('Property 5: should calculate trial_ends_at as now + 7 days with tolerance of ±1 second', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: Date.now() + 365 * 24 * 60 * 60 * 1000 }), (now) => {
        const result = calcTrialEndsAt(now)
        const resultTime = new Date(result).getTime()
        const expectedTime = now + 7 * 24 * 60 * 60 * 1000
        const tolerance = 1000 // ±1 second in milliseconds
        return Math.abs(resultTime - expectedTime) <= tolerance
      }),
      { numRuns: 100 }
    )
  })

  it('should return ISO string format', () => {
    const now = Date.now()
    const result = calcTrialEndsAt(now)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('should calculate 7 days from given timestamp', () => {
    const now = new Date('2024-01-01T00:00:00Z').getTime()
    const result = calcTrialEndsAt(now)
    const resultDate = new Date(result)
    const expectedDate = new Date('2024-01-08T00:00:00Z')
    expect(resultDate.getTime()).toBe(expectedDate.getTime())
  })
})
