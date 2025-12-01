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

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.VITE_APP_URL,
        data: { display_name: displayName },
      },
    });
    if (error) {
      console.error("Sign up error:", error.message);
      throw error;
    }
    return data.user;
  }

  async updateDisplayName(displayName: string): Promise<User | null> {
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) {
      console.error("Update display name error:", error.message);
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

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) {
      console.error("Reset password error:", error.message);
      throw error;
    }
  }

  async updatePassword(password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      console.error("Update password error:", error.message);
      throw error;
    }
    return data.user;
  }
}
