require("dotenv").config();

const bcrypt = require("bcryptjs");
const supabase = require("../src/config/supabase");

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "Admin@1234!";
  const name =
    process.env.BOOTSTRAP_ADMIN_NAME || "CentralAdmin.jd";
  const address =
    process.env.BOOTSTRAP_ADMIN_ADDRESS ||
    "Admin Address (seeded via bootstrap script)";

  
  if (name.length < 20 || name.length > 60) {
    throw new Error(
      "BOOTSTRAP_ADMIN_NAME must be 20-60 characters to pass validations."
    );
  }
  if (address.length > 400) {
    throw new Error("BOOTSTRAP_ADMIN_ADDRESS must be <= 400 characters.");
  }
  if (password.length < 8 || password.length > 16) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must be 8-16 characters.");
  }
  if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must include uppercase and special character."
    );
  }

  const { data: existing, error: existingErr } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', email)
    .maybeSingle();

  if (existingErr) {
    throw existingErr;
  }

  if (existing) {
    console.log(`Admin already exists: ${existing.email} (role=${existing.role})`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  const { data: inserted, error: insertErr } = await supabase
    .from('users')
    .insert([
      { name, email, password: hashed, address, role: 'ADMIN' },
    ])
    .select('id, email, role')
    .single();

  if (insertErr) {
    throw insertErr;
  }

  console.log(`Bootstrapped admin user: ${inserted.email} (role=${inserted.role})`);
  console.log("You can now login in the frontend with this admin account.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to bootstrap admin:", err.message);
    process.exit(1);
  });

