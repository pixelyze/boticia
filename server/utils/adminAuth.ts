import { getSupabase } from './supabase';

export type UserRole = 'user' | 'admin';

const roleCache = new Map<string, { role: UserRole; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get user role from profiles table
 */
export async function getUserRole(email: string | undefined | null): Promise<UserRole | null> {
  if (!email) return null;

  const normalizedEmail = email.toLowerCase();

  const cached = roleCache.get(normalizedEmail);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.role;
  }

  try {
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('role')
      .eq('email', normalizedEmail)
      .single();

    if (error || !data) {
      return null;
    }

    const role = data.role as UserRole;
    roleCache.set(normalizedEmail, { role, timestamp: Date.now() });

    return role;
  } catch (err) {
    console.error('Error getting role:', err);
    return null;
  }
}

/**
 * Check if email is admin
 */
export async function isAdmin(email: string | undefined | null): Promise<boolean> {
  const role = await getUserRole(email);
  return role === 'admin';
}

/**
 * Invalidate role cache for an email
 */
export function invalidateRoleCache(email: string): void {
  roleCache.delete(email.toLowerCase());
}

/**
 * Clear entire role cache
 */
export function clearRoleCache(): void {
  roleCache.clear();
}
