import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Converts a company name to a kebab-case slug following the algorithm:
 * 1. Normalize to NFD (decompose accents)
 * 2. Remove diacritics (Unicode category Mn)
 * 3. Convert to lowercase
 * 4. Replace any sequence of [^a-z0-9] with hyphen
 * 5. Remove consecutive hyphens
 * 6. Remove hyphens at start/end
 * 7. Truncate to 60 characters
 * 8. If length < 3: append 4-digit random suffix
 */
export function generateSlug(companyName: string): string {
  // Step 1: Normalize to NFD (decompose accents)
  let slug = companyName.normalize('NFD')

  // Step 2: Remove diacritics (Unicode category Mn)
  slug = slug.replace(/[\u0300-\u036f]/g, '')

  // Step 3: Convert to lowercase
  slug = slug.toLowerCase()

  // Step 4: Replace any sequence of [^a-z0-9] with hyphen
  slug = slug.replace(/[^a-z0-9]+/g, '-')

  // Step 5: Remove consecutive hyphens
  slug = slug.replace(/-+/g, '-')

  // Step 6: Remove hyphens at start/end
  slug = slug.replace(/^-+|-+$/g, '')

  // Step 7: Truncate to 60 characters
  slug = slug.substring(0, 60)

  // Step 8: If length < 3: append 4-digit random suffix
  if (slug.length < 3) {
    const randomSuffix = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    slug = slug ? `${slug}-${randomSuffix}` : randomSuffix
  }

  return slug
}

/**
 * Ensures slug uniqueness by checking the integrators table in Supabase.
 * If the base slug exists, tries baseSlug-2, baseSlug-3, etc. until finding a free one.
 * Maximum 100 attempts to prevent infinite loops.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  supabaseClient: SupabaseClient
): Promise<string> {
  // Check if base slug is available
  const { data, error } = await supabaseClient
    .from('integrators')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle()

  if (error) {
    throw error
  }

  // If not found, base slug is available
  if (!data) {
    return baseSlug
  }

  // Try suffixes -2, -3, ... up to 100 attempts
  for (let i = 2; i <= 100; i++) {
    const candidateSlug = `${baseSlug}-${i}`
    const { data: existingSlug, error: checkError } = await supabaseClient
      .from('integrators')
      .select('slug')
      .eq('slug', candidateSlug)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    if (!existingSlug) {
      return candidateSlug
    }
  }

  // If we reach here, we've exhausted all attempts
  throw new Error(
    `Could not find a unique slug after 100 attempts for base slug: ${baseSlug}`
  )
}

/**
 * Builds the white-label URL for a given slug.
 * Returns `${window.location.origin}/s/${slug}`
 */
export function buildWhiteLabelUrl(slug: string): string {
  return `${window.location.origin}/s/${slug}`
}

/**
 * Calculates the trial end date as 7 days from the given timestamp.
 * Returns ISO string format.
 */
export function calcTrialEndsAt(now: number): string {
  const trialEndTime = now + 7 * 24 * 60 * 60 * 1000
  return new Date(trialEndTime).toISOString()
}
