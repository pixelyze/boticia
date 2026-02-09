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
export async function generateMagicLink(email: string, redirectTo?: string): Promise<{ link: string | null; error: string | null }> {
  try {
    const supabase = getSupabase()

    await createOrGetAuthUser(email)

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: redirectTo || process.env.NUXT_PUBLIC_SITE_URL + '/dashboard',
      },
    })

    if (error) {
      console.error('Error generating magic link:', error.message)
      return { link: null, error: error.message }
    }

    return { link: data.properties?.action_link || null, error: null }
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
