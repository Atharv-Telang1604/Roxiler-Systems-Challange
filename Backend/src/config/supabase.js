const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || (process.env.DB_HOST ? `https://${process.env.DB_HOST}` : undefined);
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_KEY) must be set in environment.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

module.exports = supabase;
