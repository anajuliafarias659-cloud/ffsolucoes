async function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erro = document.getElementById("erro");

  erro.innerText = "";

  if (!usuario || !senha) {
    erro.innerText = "Preencha usuário e senha";
    return;
  }

  const url =
    `${SUPABASE_URL}/rest/v1/admins` +
    `?usuario=eq.${usuario}` +
    `&senha=eq.${senha}` +
    `&ativo=eq.verdadeiro` +
    `&select=id,usuario,permissao,app_id`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await res.json();

    if (!data.length) {
      erro.innerText = "Usuário ou senha inválidos";
      return;
    }

    sessionStorage.setItem("usuario", JSON.stringify(data[0]));
    window.location.href = "dashboard.html";

  } catch (e) {
    erro.innerText = "Erro ao conectar";
    console.error(e);
  }
}
