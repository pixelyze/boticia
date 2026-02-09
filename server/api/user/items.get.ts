import { getItemsByEmail } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const email = query.email as string;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email required',
    });
  }

  try {
    const items = await getItemsByEmail(email);

    return {
      items,
      count: items.length,
    };
  } catch (err) {
    console.error('Error getting items:', err);
    return {
      items: [],
      count: 0,
    };
  }
});
