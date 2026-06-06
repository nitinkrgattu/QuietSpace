// ============================================
// supabaseClient.js
// Initialises the Supabase client using env vars
// Used by AuthContext and all service modules
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[QuietSpace] Supabase env vars missing. ' +
    'Copy frontend/.env.example to frontend/.env and fill in your values.'
  );
}

/**
 * Custom fetch wrapper that:
 * 1. Never retries on 429 (rate limit) — prevents compounding the problem
 * 2. Logs rate-limit hits clearly in the console
 */
const noRetryFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (response.status === 429) {
    console.warn(
      '[QuietSpace] Supabase rate limit hit (429). ' +
      'This is a Supabase free-tier email quota limit. ' +
      'Fix: Go to Supabase Dashboard → Authentication → Email → ' +
      'disable "Enable email confirmations" for development.'
    );
  }
  return response;
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession:     true,
      autoRefreshToken:   true,
      detectSessionInUrl: true,
    },
    global: {
      // Use our custom fetch — no automatic retries on 429
      fetch: noRetryFetch,
    },
  }
);
