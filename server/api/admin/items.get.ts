import { requireAdmin } from '~/server/utils/serverAuth';
import { getSupabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAdmin(event);

  const query = getQuery(event);
  const status = query.status as string | undefined;

  try {
    let queryBuilder = getSupabase()
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error getting items:', error.message);
      return { items: [], count: 0 };
    }

    return {
      items: data || [],
      count: data?.length || 0,
    };
  } catch (err) {
    console.error('Error:', err);
    return { items: [], count: 0 };
  }
});
