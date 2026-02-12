import { supabase } from "./supabase.js";

/* NÃO PROTEGER PÁGINAS AUTH */
if (window.location.pathname.includes("/auth/")) {
  console.log("Página pública");
} else {

  async function protegerPagina(){

    // Espera Supabase restaurar sessão
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log("Sem sessão");
      window.location.href = "/auth/login.html";
      return;
    }

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("app_id, nome")
      .eq("id", session.user.id)
      .single();

    if (error || !usuario) {
      console.log("Usuário inválido");
      await supabase.auth.signOut();
      window.location.href = "/auth/login.html";
      return;
    }

    window.APP_ID = usuario.app_id;
    window.USUARIO_NOME = usuario.nome;

    console.log("Sessão OK:", window.APP_ID);
  }

  protegerPagina();
}
