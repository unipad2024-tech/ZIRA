// Auto-generated Supabase database types (updated format for supabase-js v2.103+)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          coins: number;
          total_study_minutes: number;
          streak: number;
          subscription: 'free' | 'premium';
          premium_expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          coins?: number;
          total_study_minutes?: number;
          streak?: number;
          subscription?: 'free' | 'premium';
          premium_expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
          coins?: number;
          total_study_minutes?: number;
          streak?: number;
          subscription?: 'free' | 'premium';
          premium_expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      study_sessions: {
        Row: {
          id: string;
          host_id: string;
          code: string;
          title: string;
          duration_minutes: number;
          started_at: string | null;
          ended_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          code: string;
          title: string;
          duration_minutes: number;
          started_at?: string | null;
          ended_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          code?: string;
          title?: string;
          duration_minutes?: number;
          started_at?: string | null;
          ended_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      session_participants: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          joined_at: string;
          left_at: string | null;
          minutes_completed: number;
          coins_earned: number;
          plant_alive: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          joined_at?: string;
          left_at?: string | null;
          minutes_completed?: number;
          coins_earned?: number;
          plant_alive?: boolean;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          joined_at?: string;
          left_at?: string | null;
          minutes_completed?: number;
          coins_earned?: number;
          plant_alive?: boolean;
        };
        Relationships: [];
      };
      farms: {
        Row: {
          id: string;
          user_id: string;
          grid_width: number;
          grid_height: number;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          grid_width?: number;
          grid_height?: number;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          grid_width?: number;
          grid_height?: number;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      farm_items: {
        Row: {
          id: string;
          user_id: string;
          item_type: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          item_id: string;
          position_x: number;
          position_y: number;
          placed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          item_id: string;
          position_x: number;
          position_y: number;
          placed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          item_id?: string;
          position_x?: number;
          position_y?: number;
          placed_at?: string;
        };
        Relationships: [];
      };
      shop_items: {
        Row: {
          id: string;
          name: string;
          name_ar: string;
          type: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          cost: number;
          rarity: 'common' | 'rare' | 'epic' | 'legendary';
          image_url: string;
          description: string;
          description_ar: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ar: string;
          type: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          cost: number;
          rarity: 'common' | 'rare' | 'epic' | 'legendary';
          image_url: string;
          description: string;
          description_ar: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string;
          type?: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
          cost?: number;
          rarity?: 'common' | 'rare' | 'epic' | 'legendary';
          image_url?: string;
          description?: string;
          description_ar?: string;
        };
        Relationships: [];
      };
      auction_items: {
        Row: {
          id: string;
          shop_item_id: string;
          start_price: number;
          current_price: number;
          highest_bidder_id: string | null;
          ends_at: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_item_id: string;
          start_price: number;
          current_price?: number;
          highest_bidder_id?: string | null;
          ends_at: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_item_id?: string;
          start_price?: number;
          current_price?: number;
          highest_bidder_id?: string | null;
          ends_at?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      auction_bids: {
        Row: {
          id: string;
          auction_item_id: string;
          user_id: string;
          amount: number;
          placed_at: string;
        };
        Insert: {
          id?: string;
          auction_item_id: string;
          user_id: string;
          amount: number;
          placed_at?: string;
        };
        Update: {
          id?: string;
          auction_item_id?: string;
          user_id?: string;
          amount?: number;
          placed_at?: string;
        };
        Relationships: [];
      };
      flashcard_sets: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subject: string;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subject: string;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          subject?: string;
          is_public?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      flashcards: {
        Row: {
          id: string;
          set_id: string;
          front: string;
          back: string;
          difficulty: number;
          next_review: string;
          review_count: number;
        };
        Insert: {
          id?: string;
          set_id: string;
          front: string;
          back: string;
          difficulty?: number;
          next_review?: string;
          review_count?: number;
        };
        Update: {
          id?: string;
          set_id?: string;
          front?: string;
          back?: string;
          difficulty?: number;
          next_review?: string;
          review_count?: number;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          achievement_type: string;
          name: string;
          name_ar: string;
          description: string;
          description_ar: string;
          badge: 'bronze' | 'silver' | 'gold';
          icon: string;
        };
        Insert: {
          id?: string;
          achievement_type: string;
          name: string;
          name_ar: string;
          description: string;
          description_ar: string;
          badge: 'bronze' | 'silver' | 'gold';
          icon: string;
        };
        Update: {
          id?: string;
          achievement_type?: string;
          name?: string;
          name_ar?: string;
          description?: string;
          description_ar?: string;
          badge?: 'bronze' | 'silver' | 'gold';
          icon?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          earned_at: string;
          badge: 'bronze' | 'silver' | 'gold';
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          earned_at?: string;
          badge: 'bronze' | 'silver' | 'gold';
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          earned_at?: string;
          badge?: 'bronze' | 'silver' | 'gold';
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          title_ar: string;
          description: string;
          description_ar: string;
          type: 'daily' | 'weekly';
          requirement_minutes: number;
          reward_coins: number;
          expires_at: string;
          icon: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          title_ar: string;
          description: string;
          description_ar: string;
          type: 'daily' | 'weekly';
          requirement_minutes: number;
          reward_coins: number;
          expires_at: string;
          icon?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          title_ar?: string;
          description?: string;
          description_ar?: string;
          type?: 'daily' | 'weekly';
          requirement_minutes?: number;
          reward_coins?: number;
          expires_at?: string;
          icon?: string | null;
        };
        Relationships: [];
      };
      user_challenges: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          progress_minutes: number;
          completed: boolean;
          completed_at: string | null;
          coins_claimed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          progress_minutes?: number;
          completed?: boolean;
          completed_at?: string | null;
          coins_claimed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          progress_minutes?: number;
          completed?: boolean;
          completed_at?: string | null;
          coins_claimed?: boolean;
        };
        Relationships: [];
      };
      countdown_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          event_date: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          event_date: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          event_date?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'premium';
          price: number;
          currency: string;
          status: 'active' | 'expired';
          started_at: string;
          expires_at: string | null;
          paylink_transaction_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: 'free' | 'premium';
          price?: number;
          currency?: string;
          status?: 'active' | 'expired';
          started_at?: string;
          expires_at?: string | null;
          paylink_transaction_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'free' | 'premium';
          price?: number;
          currency?: string;
          status?: 'active' | 'expired';
          started_at?: string;
          expires_at?: string | null;
          paylink_transaction_id?: string | null;
        };
        Relationships: [];
      };
      coin_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      public_library: {
        Row: {
          id: string;
          flashcard_set_id: string;
          submitted_by: string;
          approved: boolean;
          rating_avg: number;
          rating_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          flashcard_set_id: string;
          submitted_by: string;
          approved?: boolean;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          flashcard_set_id?: string;
          submitted_by?: string;
          approved?: boolean;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      library_ratings: {
        Row: {
          id: string;
          library_entry_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          library_entry_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          library_entry_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      science_content: {
        Row: {
          id: string;
          title: string;
          title_ar: string;
          category: string;
          content: string;
          content_ar: string;
          image_url: string | null;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_ar: string;
          category: string;
          content: string;
          content_ar: string;
          image_url?: string | null;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_ar?: string;
          category?: string;
          content?: string;
          content_ar?: string;
          image_url?: string | null;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_science: {
        Row: {
          id: string;
          user_id: string;
          science_content_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          science_content_id: string;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          science_content_id?: string;
          saved_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      add_coins_to_user: {
        Args: { p_user_id: string; p_amount: number; p_type: string; p_description: string };
        Returns: number;
      };
    };
    Enums: {
      subscription_plan: 'free' | 'premium';
      item_rarity: 'common' | 'rare' | 'epic' | 'legendary';
      farm_item_type: 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
      badge_tier: 'bronze' | 'silver' | 'gold';
      challenge_type: 'daily' | 'weekly';
    };
    CompositeTypes: Record<string, never>;
  };
};
