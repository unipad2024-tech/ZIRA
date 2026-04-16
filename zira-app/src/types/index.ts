// ─────────────────────────────────────────────────────────────────────────────
// Zira App – Complete TypeScript Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ── User & Auth ───────────────────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'expired';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  coins: number;
  total_study_minutes: number;
  streak: number;
  subscription: SubscriptionPlan;
  premium_expires_at: string | null;
  created_at: string;
}

// ── Study Sessions ────────────────────────────────────────────────────────────

export interface StudySession {
  id: string;
  host_id: string;
  code: string;
  title: string;
  duration_minutes: number;
  started_at: string | null;
  ended_at: string | null;
  is_active: boolean;
  participants: SessionParticipant[];
}

export interface SessionParticipant {
  session_id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  minutes_completed: number;
  coins_earned: number;
  plant_alive: boolean;
  user?: Pick<User, 'id' | 'username' | 'avatar_url'>;
}

// ── Farm & Shop ───────────────────────────────────────────────────────────────

export type FarmItemType = 'tree' | 'animal' | 'house' | 'garden' | 'lake' | 'decoration';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface FarmItem {
  id: string;
  user_id: string;
  item_type: FarmItemType;
  item_id: string;
  position_x: number;
  position_y: number;
  placed_at: string;
  shop_item?: ShopItem;
}

export interface ShopItem {
  id: string;
  name: string;
  name_ar: string;
  type: FarmItemType;
  cost: number;
  rarity: ItemRarity;
  image_url: string;
  description: string;
  description_ar?: string;
}

// ── Auction ───────────────────────────────────────────────────────────────────

export interface AuctionItem {
  id: string;
  shop_item_id: string;
  item: ShopItem;
  start_price: number;
  current_price: number;
  highest_bidder_id: string | null;
  highest_bidder?: Pick<User, 'id' | 'username' | 'avatar_url'>;
  ends_at: string;
  is_active: boolean;
  bid_count?: number;
}

export interface AuctionBid {
  id: string;
  auction_item_id: string;
  user_id: string;
  amount: number;
  placed_at: string;
  user?: Pick<User, 'id' | 'username' | 'avatar_url'>;
}

// ── Flashcards ────────────────────────────────────────────────────────────────

export type FlashcardDifficulty = 1 | 2 | 3 | 4 | 5;

export interface Flashcard {
  id: string;
  set_id: string;
  front: string;
  back: string;
  difficulty: FlashcardDifficulty;
  next_review: string;
  review_count: number;
}

export interface FlashcardSet {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  is_public: boolean;
  cards: Flashcard[];
  created_at: string;
  card_count?: number;
  owner?: Pick<User, 'id' | 'username' | 'avatar_url'>;
}

// ── Achievements ──────────────────────────────────────────────────────────────

export type BadgeTier = 'bronze' | 'silver' | 'gold';

export type AchievementType =
  | 'first_session'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'minutes_60'
  | 'minutes_600'
  | 'minutes_3000'
  | 'social_host'
  | 'social_join_10'
  | 'coins_500'
  | 'coins_5000'
  | 'farm_first_item'
  | 'farm_10_items'
  | 'flashcard_set'
  | 'flashcard_100_reviews'
  | 'auction_win';

export interface Achievement {
  id: string;
  achievement_type: AchievementType;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  badge: BadgeTier;
  icon: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  earned_at: string;
  badge: BadgeTier;
  achievement?: Achievement;
}

// ── Challenges ────────────────────────────────────────────────────────────────

export type ChallengeType = 'daily' | 'weekly';

export interface Challenge {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  type: ChallengeType;
  requirement_minutes: number;
  reward_coins: number;
  expires_at: string;
  icon?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress_minutes: number;
  completed: boolean;
  completed_at: string | null;
  coins_claimed: boolean;
  challenge?: Challenge;
}

// ── Countdown Events ──────────────────────────────────────────────────────────

export interface CountdownEvent {
  id: string;
  user_id: string;
  title: string;
  event_date: string;
  color: string;
  created_at?: string;
}

// ── Subscriptions & Payments ──────────────────────────────────────────────────

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  price: 5;
  currency: 'SAR';
  status: SubscriptionStatus;
  started_at: string;
  expires_at: string | null;
  paylink_transaction_id: string | null;
}

export type CoinTransactionType =
  | 'study_reward'
  | 'challenge_reward'
  | 'auction_spend'
  | 'shop_purchase'
  | 'achievement_reward'
  | 'admin_grant'
  | 'refund';

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: CoinTransactionType;
  description: string;
  created_at: string;
}

// ── Public Library ────────────────────────────────────────────────────────────

export interface PublicLibraryEntry {
  id: string;
  flashcard_set_id: string;
  submitted_by: string;
  approved: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  flashcard_set?: FlashcardSet;
  submitter?: Pick<User, 'id' | 'username' | 'avatar_url'>;
}

export interface LibraryRating {
  id: string;
  library_entry_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ── Science Content ───────────────────────────────────────────────────────────

export type ScienceCategory =
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'mathematics'
  | 'history'
  | 'geography'
  | 'literature'
  | 'technology';

export interface ScienceContent {
  id: string;
  title: string;
  title_ar: string;
  category: ScienceCategory;
  content: string;
  content_ar: string;
  image_url: string | null;
  source_url: string | null;
  created_at: string;
}

export interface SavedScience {
  id: string;
  user_id: string;
  science_content_id: string;
  saved_at: string;
  content?: ScienceContent;
}

// ── Farm State ────────────────────────────────────────────────────────────────

export interface Farm {
  id: string;
  user_id: string;
  grid_width: number;
  grid_height: number;
  theme: string;
  created_at: string;
  updated_at: string;
  items?: FarmItem[];
}

// ── UI / Store Helpers ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error' | 'warning';
}
