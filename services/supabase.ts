
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nksogotfxxgwydycbbfm.supabase.co';
const supabaseKey = 'sb_publishable_FeaefdS7AC6xZMgBJNB8uA_J2dVbHon';

export const supabase = createClient(supabaseUrl, supabaseKey);
