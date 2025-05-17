import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase-server"; 
import type { OtpType } from "@supabase/supabase-js"; // Importar OtpType
// Se você estiver usando createRouteHandlerClient, importe-o assim:
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// Lista de tipos de OTP válidos que este endpoint espera tratar
const VALID_OTP_TYPES: OtpType[] = ["signup", "recovery", "email_change", "magiclink"]; // Adicione outros se necessário

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash"); // Supabase usa token_hash para type 'email' e 'recovery'
  const typeFromQuery = searchParams.get("type");
  const next = searchParams.get("next") || "/"; // Para onde redirecionar após a confirmação

  // Crie uma URL de redirecionamento para tratar erros ou sucesso
  const redirectTo = new URL(request.nextUrl.origin);
  redirectTo.pathname = next;

  if (!token_hash || !typeFromQuery) {
    redirectTo.pathname = "/login"; // Ou uma página de erro específica
    redirectTo.searchParams.set("error", "Token de confirmação ou tipo ausente.");
    redirectTo.searchParams.set("type", "error");
    return NextResponse.redirect(redirectTo);
  }

  // Validar o tipo de OTP
  if (!VALID_OTP_TYPES.includes(typeFromQuery as OtpType)) {
    console.error("Invalid OTP type from query:", typeFromQuery);
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Tipo de link de confirmação inválido.");
    redirectTo.searchParams.set("type", "error");
    return NextResponse.redirect(redirectTo);
  }

  // Agora podemos seguramente fazer o type assertion
  const otpType = typeFromQuery as OtpType;

  // const cookieStore = cookies(); // Necessário para createRouteHandlerClient
  const supabase = createServerClient(); 
  // Se usar createRouteHandlerClient:
  // const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.verifyOtp({
    type: otpType, // Usar o otpType validado e tipado
    token_hash,
  });

  if (!error) {
    // Se for um token de recuperação de senha, redirecione para a página de reset de senha
    if (otpType === "recovery") {
      // Certifique-se de que a rota /reset-password pode lidar com o usuário já autenticado
      // ou que o usuário será solicitado a definir uma nova senha nesta etapa.
      // O Supabase geralmente lida com a sessão de recuperação automaticamente após verifyOtp.
      // Você pode querer redirecionar para uma página específica de nova senha.
      // Ex: redirectTo.pathname = "/reset-password";
      // Por enquanto, vamos redirecionar para a página de login com uma mensagem.
       redirectTo.pathname = "/login";
       redirectTo.searchParams.set("message", "E-mail de recuperação verificado. Agora você pode definir uma nova senha na página de Resetar Senha.");
       redirectTo.searchParams.set("type", "success");

    } else if (otpType === "signup") {
      redirectTo.pathname = "/login";
      redirectTo.searchParams.set("message", "E-mail confirmado com sucesso! Você já pode fazer login.");
      redirectTo.searchParams.set("type", "success");
    } else {
      // Para outros tipos de OTP (como magiclink, email_change), redirecione para o 'next' ou dashboard
      redirectTo.pathname = next || "/dashboard"; // Ou `next` se preferir
      redirectTo.searchParams.set("message", "Verificação concluída com sucesso!");
      redirectTo.searchParams.set("type", "success");
    }
    return NextResponse.redirect(redirectTo);
  } else {
    console.error("Auth Confirm Error (verifyOtp failed):", error);
    redirectTo.pathname = "/login"; // Ou uma página de erro específica
    redirectTo.searchParams.set("error", "Link de confirmação inválido ou expirado. Por favor, tente novamente.");
    redirectTo.searchParams.set("type", "error");
    return NextResponse.redirect(redirectTo);
  }
} 