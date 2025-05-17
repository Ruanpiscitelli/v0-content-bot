export const supabaseConfig = {
  // URLs for authentication redirects
  authCallbackUrl: "https://virallyzer.com/auth/callback",
  emailConfirmationUrl: "https://virallyzer.com/auth/confirm",
  passwordResetUrl: "https://virallyzer.com/reset-password",

  // Other Supabase configuration options
  authFlowType: "pkce", // Use PKCE flow for better security
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
}
