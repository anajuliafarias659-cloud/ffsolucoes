import { supabase } from "./supabase.js";

(async () => {

  if (window.location.pathname.startsWith("/auth/")) {
    console.log("Página pública");
    return;
  }

  const { data: { session }, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !session) {
    window.location.href = "/auth/login.html";
    return;
  }

  const { data: usuarioSistema, error: userError } =
    await supabase
      .from("usuarios")
      .select("app_id, nome")
      .eq("id", session.user.id)
      .maybeSingle();

  if (userError) {
    console.error("Erro ao buscar usuário:", userError);
    return;
  }

  if (!usuarioSistema) {
    console.warn("Usuário não encontrado na tabela usuarios");
    return;
  }

  window.SUPABASE = supabase;
  window.APP_ID = usuarioSistema.app_id;
  window.USUARIO_NOME = usuarioSistema.nome;

})();
