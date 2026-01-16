import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, FollowedTeam, Notification, GamePlatform, GameType } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface FollowState {
  followedTeams: FollowedTeam[];
  addTeam: (team: Omit<FollowedTeam, 'id' | 'createdAt'>) => void;
  removeTeam: (teamId: string) => void;
  isFollowing: (teamId: string, platform: GamePlatform) => boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

interface FilterState {
  selectedPlatforms: GamePlatform[];
  selectedGames: GameType[];
  showLiveOnly: boolean;
  searchQuery: string;
  togglePlatform: (platform: GamePlatform) => void;
  toggleGame: (game: GameType) => void;
  setShowLiveOnly: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        // Simulated login - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user: User = {
          id: crypto.randomUUID(),
          email,
          username: email.split('@')[0],
          createdAt: new Date(),
          followedTeams: [],
          settings: {
            notifications: {
              matchStart: true,
              matchEnd: true,
              teamUpdates: true,
            },
            theme: 'dark',
            language: 'en',
          },
        };
        set({ user, isAuthenticated: true, isLoading: false });
      },
      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user: User = {
          id: crypto.randomUUID(),
          email,
          username,
          createdAt: new Date(),
          followedTeams: [],
          settings: {
            notifications: {
              matchStart: true,
              matchEnd: true,
              teamUpdates: true,
            },
            theme: 'dark',
            language: 'en',
          },
        };
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Follow Store
export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      followedTeams: [],
      addTeam: (team) => {
        const newTeam: FollowedTeam = {
          ...team,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({
          followedTeams: [...state.followedTeams, newTeam],
        }));
      },
      removeTeam: (teamId) => {
        set((state) => ({
          followedTeams: state.followedTeams.filter((t) => t.teamId !== teamId),
        }));
      },
      isFollowing: (teamId, platform) => {
        return get().followedTeams.some(
          (t) => t.teamId === teamId && t.platform === platform
        );
      },
    }),
    {
      name: 'follow-storage',
    }
  )
);

// Notification Store
export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },
      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Filter Store
export const useFilterStore = create<FilterState>()((set) => ({
  selectedPlatforms: [],
  selectedGames: [],
  showLiveOnly: false,
  searchQuery: '',
  togglePlatform: (platform) => {
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    }));
  },
  toggleGame: (game) => {
    set((state) => ({
      selectedGames: state.selectedGames.includes(game)
        ? state.selectedGames.filter((g) => g !== game)
        : [...state.selectedGames, game],
    }));
  },
  setShowLiveOnly: (value) => set({ showLiveOnly: value }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () =>
    set({
      selectedPlatforms: [],
      selectedGames: [],
      showLiveOnly: false,
      searchQuery: '',
    }),
}));
