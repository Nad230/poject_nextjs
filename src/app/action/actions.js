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

  // Récupération des champs du formulaire
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    address: formData.get('address'),
  };

  // Validation des données
  if (data.password !== data.confirmPassword) {
    console.error("Password mismatch");
    return "Passwords do not match!";
  }

  // Inscription avec Supabase
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error("Signup error:", error.message);
    return error.message;
  }

  // Ajout d'autres informations dans la base de données (optionnel)
  const { error: profileError } = await supabase
    .from('profiles') // Remplacez "profiles" par votre table utilisateur si différente
    .insert({
      name: data.name,
      email: data.email,
      address: data.address,
    });

  if (profileError) {
    console.error("Profile creation error:", profileError.message);
    return profileError.message;
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
