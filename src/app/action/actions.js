'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    return error.message; 
  }


  revalidatePath('/', 'layout');
  redirect('/');
}
export async function signup(formData) {
  const supabase = await createClient();

  // Step 1: Extract form data
  const email = formData.get('email');
  const password = formData.get('password');
  const fullname = formData.get('fullname');
  const phone = formData.get('phone');
  const role = formData.get('role') || 'user'; // Default role is 'user'

  console.log("Signup Process Started:", { email, password, fullname, phone, role });

  // Step 2: Create user in Supabase Authentication
  const { data: signUpData, error: authError } = await supabase.auth.signUp({ email, password });

  console.log("Supabase Auth Response:", { signUpData, authError });

  if (authError) {
    console.error("Authentication Error:", authError.message);
    return { error: authError.message };
  }

  // Step 3: Retrieve the user ID from the authentication response
  const userId = signUpData?.user?.id;

  if (!userId) {
    console.error("Error: Failed to retrieve user ID.");
    return { error: "User creation succeeded, but user ID is missing." };
  }

  console.log("User ID Retrieved:", userId);

  // Step 4: Insert additional profile information into the profiles table
  const { error: dbError } = await supabase
    .from('profiles')
    .insert([{ id_users: userId, fullname, phone, role,email}]);

  console.log("Profiles Table Insertion Response:", { dbError });

  if (dbError) {
    console.error("Database Error:", dbError.message);
    return { error: dbError.message };
  }

  // Step 5: Complete the signup process
  console.log("Signup process completed successfully. Redirecting to login...");
  revalidatePath('/', 'layout');
  redirect('/login');

  return { success: true };
}
