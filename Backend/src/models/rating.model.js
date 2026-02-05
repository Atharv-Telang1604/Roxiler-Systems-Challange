const supabase = require("../config/supabase");

exports.upsert = async (userId, storeId, rating) => {
  const { error } = await supabase
    .from('ratings')
    .upsert(
      { user_id: userId, store_id: storeId, rating: rating },
      { onConflict: ['user_id', 'store_id'] }
    );

  if (error) {
    console.error('Rating.upsert error:', error);
    throw error;
  }
};

exports.countAll = async () => {
  const { data, error, count } = await supabase
    .from('ratings')
    .select('id', { count: 'exact' });

  if (error) {
    console.error('Rating.countAll error:', error);
    throw error;
  }
  return Number(count || (data ? data.length : 0));
};

exports.getByStoreOwner = async (ownerId) => {
  const { data: stores, error: storeErr } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', ownerId);
  if (storeErr) {
    console.error('Rating.getByStoreOwner error (stores):', storeErr);
    throw storeErr;
  }

  const storeIds = stores.map((s) => s.id);
  if (!storeIds.length) return [];

  const { data: ratings, error: ratingsErr } = await supabase
    .from('ratings')
    .select('rating, user_id, store_id')
    .in('store_id', storeIds);
  if (ratingsErr) {
    console.error('Rating.getByStoreOwner error (ratings):', ratingsErr);
    throw ratingsErr;
  }

  const userIds = [...new Set(ratings.map((r) => r.user_id))];
  const { data: users, error: usersErr } = await supabase
    .from('users')
    .select('id, name')
    .in('id', userIds);
  if (usersErr) {
    console.error('Rating.getByStoreOwner error (users):', usersErr);
    throw usersErr;
  }

  const usersById = users.reduce((acc, u) => {
    acc[u.id] = u.name;
    return acc;
  }, {});

  return ratings.map((r) => ({ name: usersById[r.user_id] || null, rating: r.rating }));
};
