'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { setCookie } from 'cookies-next';

import { createClient } from '../utils/supabase/server'
const supabase = createClient();


export async function login(formData) {
  const supabase = await createClient(); // Initialize Supabase client

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    return error.message; // Return the error message if login fails
  }
}

export async function getUser() {
  const supabase = await createClient(); // Initialize Supabase client

  // Fetch the currently logged-in user's data
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null or handle the error
  }

  return user; // Return the user data
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


// utils/supabaseClient.js
export const fetchProfiles = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    console.log('Fetched profiles:', data);
    return data; // Return the data for use elsewhere
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};


// Update profile data
export const updateProfile = async (profileData) => {
  try {
    const user = supabase.auth.user();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('profiles') // Replace with your table name
      .update({
        fullname: profileData.fullname,
        phone: profileData.phone,
        email: profileData.email,
        photo: profileData.photo,
      })
      .eq('id', user.id); // Match the logged-in user's ID

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};