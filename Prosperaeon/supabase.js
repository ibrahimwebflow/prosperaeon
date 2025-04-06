// Import Supabase Client
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Your Supabase Project URL & API Key
const SUPABASE_URL = "https://usopwzufmbuthknylquz.supabase.co";  // Replace with your Project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb3B3enVmbWJ1dGhrbnlscXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODQ1NTQsImV4cCI6MjA1ODg2MDU1NH0.EJd2eGAK2c-I4qDGQmG-QGW0leWiLu5pme08qrSZHHU";  // Replace with your Anon Key

// Initialize Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
