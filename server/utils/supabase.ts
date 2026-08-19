import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY

    if (!url || !key) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_KEY missing')
    }

    supabase = createClient(url, key)
  }
  return supabase
}

/**
 * Generate a Magic Link for a user
 */
/**
 * Convert a Supabase storage public URL to a relative proxy URL
 * e.g. http://127.0.0.1:54321/storage/v1/object/public/bucket/file.jpg -> /api/storage/object/public/bucket/file.jpg
 */
export function toProxyUrl(supabasePublicUrl: string): string {
  const supabaseUrl = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
  return supabasePublicUrl.replace(`${supabaseUrl}/storage/v1`, "/api/storage");
}

/**
 * Build a magic link pointing at our own /confirm page.
 *
 * We deliberately do NOT return Supabase's `action_link`. That link sends
 * the tokens back in the URL fragment (implicit grant), but the browser
 * client comes from @supabase/ssr, which hardcodes `flowType: 'pkce'` —
 * auth-js then rejects the fragment with "Not a valid PKCE flow url" and
 * the session is silently dropped.
 *
 * Passing `hashed_token` to `verifyOtp()` on the page works whatever the
 * flow type, and keeps the session in cookies.
 *
 * @param redirectTo full URL of the /confirm page handling the token
 */
export async function generateMagicLink(email: string, redirectTo?: string): Promise<{ link: string | null; error: string | null }> {
  try {
    const supabase = getSupabase()

    await createOrGetAuthUser(email)

    const confirmUrl =
      redirectTo || `${process.env.NUXT_PUBLIC_SITE_URL}/fr/confirm`

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: confirmUrl },
    })

    if (error) {
      console.error('Error generating magic link:', error.message)
      return { link: null, error: error.message }
    }

    const hashedToken = data.properties?.hashed_token
    if (!hashedToken) {
      console.error('Error generating magic link: no hashed_token returned')
      return { link: null, error: 'No token returned' }
    }

    const separator = confirmUrl.includes('?') ? '&' : '?'
    const link = `${confirmUrl}${separator}token_hash=${encodeURIComponent(hashedToken)}&type=magiclink`

    return { link, error: null }
  } catch (err) {
    console.error('Error generateMagicLink:', err)
    return { link: null, error: 'Internal error' }
  }
}

/**
 * Create or get an auth user in Supabase
 */
export async function createOrGetAuthUser(email: string): Promise<{ userId: string | null; error: string | null }> {
  try {
    const supabase = getSupabase()

    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      return { userId: null, error: listError.message }
    }

    const existingUser = existingUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      return { userId: existingUser.id, error: null }
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (createError) {
      return { userId: null, error: createError.message }
    }

    return { userId: newUser.user.id, error: null }
  } catch (err) {
    console.error('Error createOrGetAuthUser:', err)
    return { userId: null, error: 'Internal error' }
  }
}

// --- Availability types ---

export interface AvailabilityRuleRow {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailabilityExceptionRow {
  id: string
  exception_date: string
  exception_type: 'block' | 'add'
  start_time: string | null
  end_time: string | null
  reason: string | null
  created_at: string
  updated_at: string
}

// --- Availability functions ---

export async function getActiveAvailabilityRules(): Promise<AvailabilityRuleRow[]> {
  try {
    const { data, error } = await getSupabase()
      .from('availability_rules')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time')

    if (error) {
      console.error('Error getting availability rules:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

export async function getAvailabilityExceptions(
  fromDate: string,
  toDate: string
): Promise<AvailabilityExceptionRow[]> {
  try {
    const { data, error } = await getSupabase()
      .from('availability_exceptions')
      .select('*')
      .gte('exception_date', fromDate)
      .lte('exception_date', toDate)
      .order('exception_date')

    if (error) {
      console.error('Error getting availability exceptions:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

export async function getBookedSlots(
  fromDate: string,
  toDate: string
): Promise<Set<string>> {
  try {
    const { data, error } = await getSupabase()
      .from('quote_requests')
      .select('meeting_date, meeting_time')
      .not('meeting_date', 'is', null)
      .not('meeting_time', 'is', null)
      .gte('meeting_date', fromDate)
      .lte('meeting_date', toDate)

    if (error) {
      console.error('Error getting booked slots:', error.message)
      return new Set()
    }

    const bookedSet = new Set<string>()
    data?.forEach((row: { meeting_date: string; meeting_time: string }) => {
      bookedSet.add(`${row.meeting_date}_${row.meeting_time}`)
    })

    return bookedSet
  } catch (err) {
    console.error('Error:', err)
    return new Set()
  }
}

// --- Example types for your tables ---

export type ItemStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface ItemRow {
  id?: string
  user_email: string
  title: string
  amount_cents: number
  status: ItemStatus
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

// --- Example CRUD functions ---

export async function saveItem(data: ItemRow): Promise<ItemRow | null> {
  try {
    const { data: item, error } = await getSupabase()
      .from('items')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error saving item:', error.message)
      return null
    }

    return item
  } catch (err) {
    console.error('Error:', err)
    return null
  }
}

export async function getItemsByEmail(email: string): Promise<ItemRow[]> {
  try {
    const { data, error } = await getSupabase()
      .from('items')
      .select('*')
      .ilike('user_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting items:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

export async function updateItemStatus(
  id: string,
  status: ItemStatus
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from('items')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating item:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Error:', err)
    return false
  }
}
