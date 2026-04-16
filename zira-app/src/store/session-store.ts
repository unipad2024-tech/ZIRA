import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { StudySession } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SessionState {
  /** The current active study session, or null if none. */
  session: StudySession | null;
  /** Seconds remaining in the session (counts down to 0). */
  timeRemaining: number;
  /** Whether the timer is actively counting down. */
  isActive: boolean;
  /** Internal reference to the setInterval handle. */
  _intervalId: ReturnType<typeof setInterval> | null;
}

interface SessionActions {
  /** Set or clear the session object. Automatically calculates timeRemaining. */
  setSession: (session: StudySession | null) => void;
  /**
   * Start the countdown timer.
   * Safe to call even if the timer is already running (idempotent).
   */
  startTimer: () => void;
  /**
   * Stop the countdown timer without resetting state.
   * Use this for pause or when the component unmounts.
   */
  stopTimer: () => void;
  /** Advance the timer by one second. Called by the interval. */
  tick: () => void;
  /** Fully reset session state (called on session end / navigation away). */
  reset: () => void;
}

type SessionStore = SessionState & SessionActions;

// ─────────────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────────────

const initialState: SessionState = {
  session: null,
  timeRemaining: 0,
  isActive: false,
  _intervalId: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useSessionStore = create<SessionStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      setSession: (session) => {
        // Stop any running timer before switching sessions
        const { _intervalId } = get();
        if (_intervalId !== null) {
          clearInterval(_intervalId);
        }

        if (!session) {
          set(initialState, false, 'setSession/clear');
          return;
        }

        // Calculate how many seconds are left based on started_at + duration
        let timeRemaining = session.duration_minutes * 60;
        if (session.started_at) {
          const elapsed = Math.floor(
            (Date.now() - new Date(session.started_at).getTime()) / 1000
          );
          timeRemaining = Math.max(0, timeRemaining - elapsed);
        }

        set(
          {
            session,
            timeRemaining,
            isActive: false,
            _intervalId: null,
          },
          false,
          'setSession'
        );
      },

      startTimer: () => {
        const { isActive, timeRemaining, _intervalId } = get();

        // Do nothing if already running or there's no time left
        if (isActive || timeRemaining <= 0) return;

        // Clear any stale interval
        if (_intervalId !== null) clearInterval(_intervalId);

        const id = setInterval(() => {
          get().tick();
        }, 1000);

        set({ isActive: true, _intervalId: id }, false, 'startTimer');
      },

      stopTimer: () => {
        const { _intervalId } = get();
        if (_intervalId !== null) {
          clearInterval(_intervalId);
        }
        set({ isActive: false, _intervalId: null }, false, 'stopTimer');
      },

      tick: () => {
        const { timeRemaining, _intervalId } = get();
        const next = timeRemaining - 1;

        if (next <= 0) {
          // Timer finished – stop the interval and mark session ended
          if (_intervalId !== null) clearInterval(_intervalId);
          set(
            (state) => ({
              timeRemaining: 0,
              isActive: false,
              _intervalId: null,
              session: state.session
                ? { ...state.session, is_active: false }
                : null,
            }),
            false,
            'tick/finished'
          );
        } else {
          set({ timeRemaining: next }, false, 'tick');
        }
      },

      reset: () => {
        const { _intervalId } = get();
        if (_intervalId !== null) clearInterval(_intervalId);
        set(initialState, false, 'reset');
      },
    })),
    { name: 'SessionStore' }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const selectSession = (s: SessionStore) => s.session;
export const selectTimeRemaining = (s: SessionStore) => s.timeRemaining;
export const selectIsActive = (s: SessionStore) => s.isActive;

/** Returns { hours, minutes, seconds } from the raw timeRemaining seconds. */
export const selectFormattedTime = (s: SessionStore) => {
  const total = s.timeRemaining;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return {
    hours,
    minutes,
    seconds,
    display: [
      hours > 0 ? String(hours).padStart(2, '0') : null,
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':'),
  };
};

/** Percentage of time elapsed (0–100). */
export const selectProgressPercent = (s: SessionStore) => {
  if (!s.session) return 0;
  const total = s.session.duration_minutes * 60;
  if (total === 0) return 100;
  return Math.round(((total - s.timeRemaining) / total) * 100);
};
