import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xvzbxxanlmqhpmabwrun.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2emJ4eGFubG1xaHBtYWJ3cnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTIzOTUsImV4cCI6MjA3NjI4ODM5NX0.5ttGgFpIrNzYqbJ2rp21_qoL5nN6mdn8D7CpaRtk5Ys";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);