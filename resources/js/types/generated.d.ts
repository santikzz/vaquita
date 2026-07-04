// =============================================================================
// AUTO-GENERATED - DO NOT EDIT
// Generated: 2026-06-29 20:58:24 via `php artisan types:generate`
// 2 model(s) - custom types go in separate *.d.ts files
// =============================================================================
export interface Settings {
  id: number;
  key: string;
  value: string | null;
  type: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  created_at: string | null;
  updated_at: string | null;
}
