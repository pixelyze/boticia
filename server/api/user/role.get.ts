import { getSupabase } from '~/server/utils/supabase';
import { getQuoteByClientEmail } from '~/server/utils/client-portal';

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
    // Check admin profile first
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('role, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle();

    // Un echec de lecture ne doit jamais etre renvoye comme role 'user' :
    // cela retrograde silencieusement un admin en visiteur.
    if (error) {
      throw error;
    }

    if (data && data.role === 'admin') {
      return {
        email,
        role: 'admin',
        isAdmin: true,
        fullName: data.full_name,
      };
    }

    // Check client portal access
    const quoteRequest = await getQuoteByClientEmail(
      normalizedEmail
    );

    if (quoteRequest) {
      return {
        email,
        role: 'client',
        isAdmin: false,
        fullName: null,
        quoteId: quoteRequest.id,
      };
    }

    return {
      email,
      role: 'user',
      isAdmin: false,
      fullName: null,
    };
  } catch (err) {
    console.error('Error getting profile:', err);
    throw createError({
      statusCode: 503,
      message: 'Role lookup failed',
    });
  }
});
