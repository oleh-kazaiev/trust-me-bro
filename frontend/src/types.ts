export interface Link {
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
  created_by_username?: string;
}

export interface User {
  id: number;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  is_admin: boolean;
}
