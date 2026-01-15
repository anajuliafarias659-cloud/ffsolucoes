async function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!usuario || !senha) {
    alert("Preencha usuário e senha");
    return;
  }

  const url =
    SUPABASE_URL +
    "/rest/v1/admins" +
    "?usuario=eq." + encodeURIComponent(usuario) +
    "&senha=eq." + encodeURIComponent(senha) +
    "&ativo=eq.verdadeiro" +
    "&select=id,usuario,permissao,app_id";

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });

  const data = await res.json();

  if (!data.length) {
    alert("Usuário ou senha inválidos");
    return;
  }

  sessionStorage.setItem("usuario", JSON.stringify(data[0]));
  window.location.href = "dashboard.html";
}
