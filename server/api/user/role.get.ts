import { getSupabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const email = query.email as string;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email required',
    });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('role, full_name')
      .eq('email', normalizedEmail)
      .single();

    if (error || !data) {
      return {
        email,
        role: 'user',
        isAdmin: false,
        fullName: null,
      };
    }

    return {
      email,
      role: data.role || 'user',
      isAdmin: data.role === 'admin',
      fullName: data.full_name,
    };
  } catch (err) {
    console.error('Error getting profile:', err);
    return {
      email,
      role: 'user',
      isAdmin: false,
      fullName: null,
    };
  }
});
