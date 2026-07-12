// ─── Auth Types ───────────────────────────────────────────────

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

// ─── Trip Types ───────────────────────────────────────────────

export interface TripActivity {
  time: string;
  title: string;
  description: string;
  duration: string;
  tips?: string;
}

export interface DailyPlan {
  day: number;
  date: string | null;
  theme: string;
  activities: TripActivity[];
  accommodation?: string;
  estimated_budget: string;
}

export interface Itinerary {
  summary: string;
  total_days: number;
  daily_plans: DailyPlan[];
  travel_tips: string[];
  recommended_restaurants: string[];
  total_estimated_budget: string;
}

export interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  itinerary: Itinerary | null;
  created_at: string;
  updated_at: string;
}

export interface TripCreateRequest {
  title: string;
  destination: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface GenerateItineraryRequest {
  trip_id: number;
  preferences?: string;
}

// ─── Chat Types ───────────────────────────────────────────────

export interface ChatMessageRequest {
  message: string;
  trip_id?: number;
}

export interface ChatMessageResponse {
  reply: string;
  model_used: string;
}

// ─── API Error ────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
