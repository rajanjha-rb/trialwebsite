import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
  avatar?: string;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        if (!account) {
          console.warn('Appwrite account service not available');
          return;
        }
        
        try {
          const session = await account.getSession("current");
          const user = await account.get<UserPrefs>();
          set({ session, user });
        } catch (error) {
          console.log('Session verification failed:', error);
          // Clear any stale session data
          set({ session: null, user: null, jwt: null });
        }
      },

      async login(email: string, password: string) {
        if (!account) {
          return {
            success: false,
            error: new AppwriteException('Appwrite service not configured', 500, ''),
          };
        }
        
        try {
          // First, try to delete any existing sessions to prevent conflicts
          try {
            await account.deleteSessions();
          } catch {
            // Ignore errors if no sessions exist
            console.log('No existing sessions to delete');
          }

          // Create new session
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          // Get user data and JWT
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          // Set default preferences if not exists
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({
              reputation: 0,
            });
          }

          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log('Login error:', error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        if (!account) {
          return {
            success: false,
            error: new AppwriteException('Appwrite service not configured', 500, ''),
          };
        }
        
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log('Account creation error:', error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        if (!account) {
          console.warn('Appwrite account service not available');
          set({ session: null, jwt: null, user: null });
          return;
        }
        
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log('Logout error:', error);
          // Clear state even if server logout fails
          set({ session: null, jwt: null, user: null });
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
