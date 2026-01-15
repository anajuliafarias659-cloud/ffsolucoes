// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== SESSÃO =====
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || admin.tipo !== "hotel") {
  alert("Acesso negado");
  window.location.href = "login.html";
}

const NEGOCIO_ID = admin.negocio_id;

// ===== FUNÇÃO =====
async function listarQuartos() {
  const lista = document.getElementById("lista-quartos");
  lista.innerText = "Carregando...";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/hotel_quartos?select=*&negocio_id=eq.${NEGOCIO_ID}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar quartos");
    }

    const quartos = await res.json();

    if (!Array.isArray(quartos) || quartos.length === 0) {
      lista.innerHTML = "<p>Nenhum quarto cadastrado.</p>";
      return;
    }

    lista.innerHTML = quartos.map(q => `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0">
        <strong>Quarto ${q.numero}</strong><br>
        Tipo: ${q.tipo}<br>
        Capacidade: ${q.capacidade}<br>
        Diária: R$ ${q.valor_diaria}
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    lista.innerText = "Erro ao carregar quartos.";
  }
}

document.addEventListener("DOMContentLoaded", listarQuartos);
