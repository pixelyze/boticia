import { getSupabase } from '~/server/utils/supabase';
import { getQuoteByClientEmail } from '~/server/utils/client-portal';
import { getSessionEmail } from '~/server/utils/serverAuth';

// PUBLIC: answers only about the signed-in user (401 when signed out)
export default defineEventHandler(async (event) => {
  // The ?email= sent by older callers is ignored : answering for any
  // address told anyone who is a Boticia client, and her quote id.
  const email = await getSessionEmail(event);

  if (!email) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
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
