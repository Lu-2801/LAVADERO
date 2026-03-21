import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "../config.js";

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
