import { supabase } from "./client";
import type { User } from "@supabase/supabase-js";

export class AuthAPI {
  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Sign in error:", error.message);
      throw error;
    }
    return data.user;
  }

  async signUp(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Sign up error:", error.message);
      throw error;
    }
    return data.user;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      throw error;
    }
  }
}
