import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrahaxbudlyhhuhvtdg.supabase.co';
const supabaseKey = 'sb_publishable_2JkaO6lOHLvOIltRKSMTAw_yY5Gpnd0';

export const supabase = createClient(supabaseUrl, supabaseKey);