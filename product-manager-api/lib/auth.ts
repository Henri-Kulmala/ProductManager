

import { createClient } from '@supabase/supabase-js';


const supabaseAdmin = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);


export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return null;
  return auth.slice(7).trim();
}


export async function requireUser(req: Request) {
  const token = getBearerToken(req);
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;

  return data.user;
}


export function isAdmin(user: any) {
  return (user?.app_metadata as any)?.role === 'admin';
}



