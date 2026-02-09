import { H3Event, getCookie, getHeader, createError } from 'h3';
import { createClient, type User } from '@supabase/supabase-js';
import { isAdmin } from './adminAuth';

function getServerSupabase() {
  const config = useRuntimeConfig();
  return createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string
  );
}

/**
 * Get authenticated user from JWT token
 * Token can be in:
 * - Cookie 'sb-access-token'
 * - Header 'Authorization: Bearer <token>'
 */
export async function getAuthenticatedUser(event: H3Event): Promise<User | null> {
  const accessToken = getCookie(event, 'sb-access-token');

  const authHeader = getHeader(event, 'authorization');
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  const token = accessToken || bearerToken;

  if (!token) {
    return null;
  }

  try {
    const supabase = getServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
}

/**
 * Middleware: Require valid authentication
 */
export async function requireAuth(event: H3Event): Promise<User> {
  const user = await getAuthenticatedUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }

  return user;
}

/**
 * Middleware: Require admin access
 */
export async function requireAdmin(event: H3Event): Promise<User> {
  const user = await requireAuth(event);

  const isUserAdmin = await isAdmin(user.email);

  if (!isUserAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Admin access required',
    });
  }

  return user;
}

/**
 * Verify secret key for internal/cron endpoints
 */
export function requireCronSecret(event: H3Event): void {
  const config = useRuntimeConfig();
  const cronSecret = config.cronSecret as string;

  if (!cronSecret) {
    throw createError({
      statusCode: 500,
      message: 'CRON_SECRET not configured',
    });
  }

  const cronHeader = getHeader(event, 'x-cron-secret');

  const authHeader = getHeader(event, 'authorization');
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  const providedSecret = cronHeader || bearerToken;

  if (!providedSecret || providedSecret !== cronSecret) {
    throw createError({
      statusCode: 401,
      message: 'Invalid secret key',
    });
  }
}
