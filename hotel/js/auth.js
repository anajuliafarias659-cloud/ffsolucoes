// ==========================================
// AUTH — usando tabela "usuarios"
// ==========================================

// LOGIN
async function login(usuario, senha) {
  const { data, error } = await sb
    .from("usuarios")
    .select("*")
    .eq("usuario", usuario)
    .eq("senha", senha)
    .maybeSingle();

  if (!data) {
    return null;
  }

  localStorage.setItem("admin_logado", JSON.stringify(data));
  return data;
}

// VERIFICAR SESSÃO
function verificarSessao() {
  const user = JSON.parse(localStorage.getItem("admin_logado"));
  if (!user) {
    location.href = "login.html";
  }
  return user;
}

// LOGOUT
function logout() {
  localStorage.removeItem("admin_logado");
  location.href = "login.html";
}
