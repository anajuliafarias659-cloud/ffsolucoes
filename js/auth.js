import { supabase } from "./supabase.js";

if (window.location.pathname.startsWith("/auth/")) {
  console.log("Página pública");
} else {

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/auth/login.html";
    throw new Error("Sem sessão ativa");
  }

  const { data: usuarioSistema } = await supabase
    .from("usuarios")
    .select("app_id, nome")
    .eq("id", session.user.id)
    .single();

  if (!usuarioSistema) {
    await supabase.auth.signOut();
    window.location.href = "/auth/login.html";
    throw new Error("Usuário inválido");
  }

  window.SUPABASE = supabase;
  window.APP_ID = usuarioSistema.app_id;
  window.USUARIO_NOME = usuarioSistema.nome;
}
