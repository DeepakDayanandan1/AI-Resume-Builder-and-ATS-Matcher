import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Route protection is currently disabled.
  // When you re-enable it, restore the Supabase getUser() call here
  // and use createServerClient from @supabase/ssr to check auth.
  return NextResponse.next({ request });
}
