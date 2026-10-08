import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME;

if (
  !supabaseUrl ||
  !supabaseSecretKey ||
  !email ||
  !password ||
  !fullName

) { 
  throw new Error("Missing required environment variables");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

const createAdminUser = async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create auth user:", error.message);
    process.exit(1);
  }

  return data.user;
};

const createAdminProfile = async () => {
  const user = await createAdminUser();

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      role: "admin",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create admin profile:", error.message);
    process.exit(1);
  }

  return data;
};

const result = await createAdminProfile();

console.log("Admin created successfully:");
console.log(result);