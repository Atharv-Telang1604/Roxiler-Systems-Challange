const supabase = require("../config/supabase");

exports.create = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: user.name,
        email: user.email,
        password: user.password,
        address: user.address,
        role: user.role,
      },
    ])
    .select('id, name, email, role')
    .single();

  if (error) {
    console.error('User.create error:', error);
    throw error;
  }
  return data;
};

exports.findByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('User.findByEmail error:', error);
    throw error;
  }
  return data;
};

exports.findById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('User.findById error:', error);
    throw error;
  }
  return data;
};

exports.updatePassword = async (id, hashedPassword) => {
  const { error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('id', id);

  if (error) {
    console.error('User.updatePassword error:', error);
    throw error;
  }
};

exports.getAll = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, address, role')
    .order('name', { ascending: true });

  if (error) {
    console.error('User.getAll error:', error);
    throw error;
  }
  return data;
};


exports.getAllWithFilters = async ({ name, email, address, role }) => {
  let query = supabase
    .from('users')
    .select('id, name, email, address, role')
    .order('name', { ascending: true });

  if (name) query = query.ilike('name', `%${name}%`);
  if (email) query = query.ilike('email', `%${email}%`);
  if (address) query = query.ilike('address', `%${address}%`);
  if (role) query = query.eq('role', role);

  const { data, error } = await query;
  if (error) {
    console.error('User.getAllWithFilters error:', error);
    throw error;
  }
  return data;
};
