// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nxwrldqcewwaamrsvlon.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3JsZHFjZXd3YWFtcnN2bG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjc4NDMsImV4cCI6MjA1NTgwMzg0M30.DC2GGhH_kQWd559UBK81LhPbLUzHW46bP45XAs7gSS4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);