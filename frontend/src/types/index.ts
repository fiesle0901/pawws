export interface Animal {
  id: number;
  name: string;
  bio: string;
  admission_date: string;
  status: string;
  journey_story: string;
  image_url: string;
}

export interface Milestone {
  id: number;
  animal_id: number;
  title: string;
  description?: string;
  cost: number;
  current_amount: number;
  status: 'pending' | 'funded' | 'completed';
}

export interface CreateAnimalData {
  name: string;
  bio: string;
  journey_story: string;
}

export interface CreateMilestoneData {
  title: string;
  description: string;
  cost: number;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type SignupCredentials = LoginCredentials;

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
