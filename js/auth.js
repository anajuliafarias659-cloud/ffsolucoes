import { supabase } from "./supabase.js";

if (window.location.pathname.startsWith("/auth/")) {
  console.log("Página pública");
} else {

  const { data: { session }, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !session) {
    window.location.href = "/auth/login.html";
    throw new Error("Sem sessão ativa");
  }

  const { data: usuarioSistema, error: userError } =
    await supabase
      .from("usuarios")
      .select("app_id, nome")
      .eq("id", session.user.id)
      .maybeSingle(); // 👈 mudou aqui

  if (userError) {
    console.error("Erro ao buscar usuário:", userError);
    return; // não desloga automaticamente
  }

  if (!usuarioSistema) {
    console.warn("Usuário não encontrado na tabela usuarios");
    return; // evita logout desnecessário
  }

  window.SUPABASE = supabase;
  window.APP_ID = usuarioSistema.app_id;
  window.USUARIO_NOME = usuarioSistema.nome;
}
