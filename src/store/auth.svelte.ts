import type { User } from "@supabase/supabase-js";

let currentUser: User | null = $state(null);

export class CurrentUserStore {
  static get(): User | null {
    return currentUser;
  }
  static set(user: User) {
    currentUser = user;
  }
  static clear() {
    currentUser = null;
  }
}
