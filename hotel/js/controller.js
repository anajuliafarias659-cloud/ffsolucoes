// ===============================================
// CONTROLLER.JS
// Controlador Global do Sistema do Hotel
// FF Soluções
// ===============================================

// Este arquivo existe para:
// - Fornecer inicializadores por página
// - Evitar erros "função não definida"
// - Garantir que dependências sejam carregadas na ordem correta

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  switch (page) {

    // -------------------------
    // PÁGINA: QUARTOS
    // -------------------------
    case "quartos":
      if (typeof carregarQuartos === "function") {
        carregarQuartos();
      }
      break;

    // -------------------------
    // PÁGINA: RESERVAS
    // -------------------------
    case "reservas":
      if (typeof carregarReservasPagina === "function") {
        carregarReservasPagina();
      }
      break;

    // -------------------------
    // PÁGINA: PAINEL
    // -------------------------
    case "painel":
      // Validar sessão automaticamente
      verificarSessao();
      break;
      
    default:
      // Caso não tenha página registrada
      break;
  }
});
