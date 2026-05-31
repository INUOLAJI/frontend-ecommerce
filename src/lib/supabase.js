import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://mtkecdfrvpbphdjciyht.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10a2VjZGZydnBicGhkamNpeWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzY4MDAsImV4cCI6MjA5NDk1MjgwMH0.oQeiGQO8CFYs_Wh3Yr6FU23_vZkrRSV6fLtUL_yoh3k'
);