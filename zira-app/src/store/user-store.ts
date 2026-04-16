import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface UserState {
  user: User | null;
  coins: number;
  isLoading: boolean;
}

interface UserActions {
  /** Replace the entire user object (called after login / profile fetch). */
  setUser: (user: User | null) => void;
  /** Overwrite the coin balance (called after a server sync). */
  setCoins: (coins: number) => void;
  /** Optimistically add coins (local only – always follow with a server update). */
  addCoins: (amount: number) => void;
  /**
   * Optimistically deduct coins.
   * Returns `false` if the user has insufficient balance and the action is blocked.
   */
  spendCoins: (amount: number) => boolean;
  /** Mark the store as loading (e.g. while fetching the profile). */
  setLoading: (loading: boolean) => void;
  /** Clear all user state on logout. */
  reset: () => void;
}

type UserStore = UserState & UserActions;

// ─────────────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────────────

const initialState: UserState = {
  user: null,
  coins: 0,
  isLoading: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) =>
          set(
            { user, coins: user?.coins ?? 0, isLoading: false },
            false,
            'setUser'
          ),

        setCoins: (coins) =>
          set(
            (state) => ({
              coins,
              user: state.user ? { ...state.user, coins } : null,
            }),
            false,
            'setCoins'
          ),

        addCoins: (amount) =>
          set(
            (state) => {
              const next = state.coins + amount;
              return {
                coins: next,
                user: state.user ? { ...state.user, coins: next } : null,
              };
            },
            false,
            'addCoins'
          ),

        spendCoins: (amount) => {
          const { coins } = get();
          if (coins < amount) return false;
          set(
            (state) => {
              const next = state.coins - amount;
              return {
                coins: next,
                user: state.user ? { ...state.user, coins: next } : null,
              };
            },
            false,
            'spendCoins'
          );
          return true;
        },

        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'zira-user',
        // Only persist non-sensitive, rehydratable fields
        partialize: (state) => ({
          user: state.user,
          coins: state.coins,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selectors (memoised – use these instead of full store subscriptions)
// ─────────────────────────────────────────────────────────────────────────────

export const selectUser = (s: UserStore) => s.user;
export const selectCoins = (s: UserStore) => s.coins;
export const selectIsPremium = (s: UserStore) =>
  s.user?.subscription === 'premium' &&
  (s.user.premium_expires_at == null ||
    new Date(s.user.premium_expires_at) > new Date());
export const selectIsLoading = (s: UserStore) => s.isLoading;
