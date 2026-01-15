// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== SESSÃO =====
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || admin.tipo !== "hotel") {
  alert("Acesso negado");
  window.location.href = "login.html";
}

// ===== FUNÇÃO =====
async function listarQuartos() {
  const lista = document.getElementById("lista-quartos");
  lista.innerText = "Carregando...";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/hotel_quartos?select=*&app_id=eq.${admin.app_id}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const quartos = await res.json();

    if (!quartos.length) {
      lista.innerHTML = "<p>Nenhum quarto cadastrado.</p>";
      return;
    }

    lista.innerHTML = quartos.map(q => `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0">
        <strong>Quarto ${q.numero}</strong><br>
        Tipo: ${q.tipo}<br>
        Capacidade: ${q.capacidade}<br>
        Diária: R$ ${q.valor_diaria}<br>
        Status: ${q.status}
      </div>
    `).join("");

  } catch (e) {
    console.error(e);
    lista.innerText = "Erro ao carregar quartos.";
  }
}

document.addEventListener("DOMContentLoaded", listarQuartos);
