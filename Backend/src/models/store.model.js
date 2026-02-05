const supabase = require("../config/supabase");

exports.create = async (store) => {
  const { error } = await supabase.from('stores').insert([
    {
      name: store.name,
      email: store.email,
      address: store.address,
      owner_id: store.owner_id,
    },
  ]);
  if (error) {
    console.error('Store.create error:', error);
    throw error;
  }
};

exports.getAll = async () => {
  const { data: stores, error: storeErr } = await supabase
    .from('stores')
    .select('id, name, email, address')
    .order('name', { ascending: true });
  if (storeErr) {
    console.error('Store.getAll error (stores):', storeErr);
    throw storeErr;
  }

  const { data: ratings, error: ratingErr } = await supabase
    .from('ratings')
    .select('store_id, rating');
  if (ratingErr) {
    console.error('Store.getAll error (ratings):', ratingErr);
    throw ratingErr;
  }

  const ratingsByStore = ratings.reduce((acc, r) => {
    acc[r.store_id] = acc[r.store_id] || [];
    acc[r.store_id].push(r.rating);
    return acc;
  }, {});

  return stores.map((s) => {
    const list = ratingsByStore[s.id] || [];
    const avg = list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null;
    return { ...s, avgRating: avg };
  });
};


exports.getAllWithFilters = async ({ name, email, address }) => {
  let query = supabase
    .from('stores')
    .select('id, name, email, address')
    .order('name', { ascending: true });

  if (name) query = query.ilike('name', `%${name}%`);
  if (email) query = query.ilike('email', `%${email}%`);
  if (address) query = query.ilike('address', `%${address}%`);

  const { data: stores, error: storeErr } = await query;
  if (storeErr) {
    console.error('Store.getAllWithFilters error (stores):', storeErr);
    throw storeErr;
  }

  const { data: ratings, error: ratingErr } = await supabase
    .from('ratings')
    .select('store_id, rating');
  if (ratingErr) {
    console.error('Store.getAllWithFilters error (ratings):', ratingErr);
    throw ratingErr;
  }

  const ratingsByStore = ratings.reduce((acc, r) => {
    acc[r.store_id] = acc[r.store_id] || [];
    acc[r.store_id].push(r.rating);
    return acc;
  }, {});

  return stores.map((s) => {
    const list = ratingsByStore[s.id] || [];
    const avg = list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null;
    return { ...s, avgRating: avg };
  });
};

exports.getAllWithUserRating = async (userId, { name, address }) => {
  let query = supabase
    .from('stores')
    .select('id, name, email, address')
    .order('name', { ascending: true });

  if (name) query = query.ilike('name', `%${name}%`);
  if (address) query = query.ilike('address', `%${address}%`);

  const { data: stores, error: storeErr } = await query;
  if (storeErr) {
    console.error('Store.getAllWithUserRating error (stores):', storeErr);
    throw storeErr;
  }

  const storeIds = stores.map((s) => s.id);

  const { data: ratings, error: ratingErr } = await supabase
    .from('ratings')
    .select('store_id, rating, user_id')
    .in('store_id', storeIds || []);
  if (ratingErr) {
    console.error('Store.getAllWithUserRating error (ratings):', ratingErr);
    throw ratingErr;
  }

  const ratingsByStore = ratings.reduce((acc, r) => {
    acc[r.store_id] = acc[r.store_id] || [];
    acc[r.store_id].push(r.rating);
    return acc;
  }, {});

  const userRatings = ratings.reduce((acc, r) => {
    if (r.user_id === userId) acc[r.store_id] = r.rating;
    return acc;
  }, {});

  return stores.map((s) => {
    const list = ratingsByStore[s.id] || [];
    const avg = list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null;
    return { ...s, avgRating: avg, userRating: userRatings[s.id] || null };
  });
};
