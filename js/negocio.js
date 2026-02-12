import { supabase } from "./supabase.js";

// 📋 Lista todos negócios do usuário logado
export async function listarNegocios() {

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data } = await supabase
    .from("usuarios_negocios")
    .select(`
      negocio_id,
      perfil,
      negocios ( nome )
    `)
    .eq("user_id", session.user.id);

  return data || [];
}


// 🔄 Trocar negócio ativo
export function trocarNegocio(negocioId) {

  localStorage.setItem("negocio_ativo", negocioId);

  // recarrega a página para aplicar novo contexto
  window.location.reload();
}


// 🏢 Pegar negócio ativo
export function getNegocioAtivo() {
  return localStorage.getItem("negocio_ativo");
}
