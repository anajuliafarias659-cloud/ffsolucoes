import { supabase } from "./supabase.js";

/* NÃO PROTEGER PÁGINAS AUTH */
if (window.location.pathname.includes("/auth/")) {
  console.log("Página pública");
} else {

  // Aguarda o Supabase restaurar sessão corretamente
  supabase.auth.onAuthStateChange(async (event, session) => {

    if (!session) {
      window.location.href = "/auth/login.html";
      return;
    }

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("app_id, nome")
      .eq("id", session.user.id)
      .single();

    if (error || !usuario) {
      await supabase.auth.signOut();
      window.location.href = "/auth/login.html";
      return;
    }

    // Define globais
    window.APP_ID = usuario.app_id;
    window.USUARIO_NOME = usuario.nome;

    console.log("Sessão válida:", window.APP_ID);
  });

}
