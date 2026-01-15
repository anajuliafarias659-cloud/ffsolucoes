const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

const admin = JSON.parse(localStorage.getItem("admin_logado"));
if (!admin || !admin.negocio_id) {
  alert("Sessão inválida");
  location.href = "login.html";
}

const lista = document.getElementById("lista-quartos");

async function listarQuartos() {
  lista.innerText = "Carregando...";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/hotel_quartos?select=*&negocio_id=eq.${admin.negocio_id}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) throw new Error();

    const quartos = await res.json();

    if (!quartos.length) {
      lista.innerHTML = "<p>Nenhum quarto cadastrado.</p>";
      return;
    }

    lista.innerHTML = quartos.map(q => `
      <div style="border:1px solid #ccc;padding:10px;margin:10px 0">
        <strong>Quarto ${q.numero}</strong><br>
        Tipo: ${q.tipo}<br>
        Capacidade: ${q.capacidade}<br>
        Diária: R$ ${q.valor_diaria}<br>
        Status: ${q.status}
      </div>
    `).join("");

  } catch {
    lista.innerText = "Erro ao carregar quartos.";
  }
}

document.addEventListener("DOMContentLoaded", listarQuartos);
