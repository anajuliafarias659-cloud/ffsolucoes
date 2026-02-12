import { supabase } from "./supabase.js";

// 🚫 NÃO proteger páginas públicas (/auth)
if (window.location.pathname.startsWith("/auth/")) {
  // Não executa proteção no login
  console.log("Página pública - auth ignorado");
} else {

  // 🔐 1️⃣ Verifica sessão
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/auth/login.html";
    throw new Error("Sem sessão ativa");
  }

  const userId = session.user.id;

  // 🔎 2️⃣ Busca negócios vinculados ao usuário
  const { data: vinculos, error } = await supabase
    .from("usuarios_negocios")
    .select(`
      negocio_id,
      perfil,
      negocios ( nome )
    `)
    .eq("user_id", userId);

  if (error || !vinculos || vinculos.length === 0) {
    await supabase.auth.signOut();
    window.location.href = "/auth/login.html";
    throw new Error("Usuário sem vínculo com negócio");
  }

  // 🔁 3️⃣ Recupera último negócio usado
  let negocioAtivo = localStorage.getItem("negocio_ativo");

  const negocioValido = vinculos.find(v => v.negocio_id === negocioAtivo);

  if (!negocioValido) {
    negocioAtivo = vinculos[0].negocio_id;
    localStorage.setItem("negocio_ativo", negocioAtivo);
  }

  // 🔥 4️⃣ Define variáveis globais
  window.SUPABASE = supabase;
  window.NEGOCIO_ID = negocioAtivo;
  window.PERFIL = vinculos.find(v => v.negocio_id === negocioAtivo)?.perfil || null;
  window.NEGOCIO_NOME = vinculos.find(v => v.negocio_id === negocioAtivo)?.negocios?.nome || null;
}
