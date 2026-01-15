// === CONFIG ===
var SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co",
var SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"
var NEGOCIO_ID = 'c94fa1a3-c691-4364-8f6f-3d70c743f29e';

// === LISTAR QUARTOS ===
function listarQuartos() {
  fetch(SUPABASE_URL + '/rest/v1/hotel_quartos?select=*&negocio_id=eq.' + NEGOCIO_ID, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + SUPABASE_KEY
    }
  })
  .then(r => r.json())
  .then(quartos => {
    var html = '';
    if (!quartos.length) {
      html = '<p>Nenhum quarto cadastrado.</p>';
    } else {
      quartos.forEach(q => {
        html += `
          <div style="border:1px solid #ccc;padding:10px;margin:10px">
            <h3>Quarto ${q.numero}</h3>
            <p>Tipo: ${q.tipo}</p>
            <p>Capacidade: ${q.capacidade}</p>
            <p>Diária: R$ ${q.valor_diaria}</p>
            <a href="reserva.html?quarto=${q.id}">Reservar</a>
          </div>
        `;
      });
    }
    document.getElementById('lista-quartos').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('lista-quartos').innerText = 'Erro ao carregar quartos';
    console.error(err);
  });
}

// === CRIAR RESERVA (PÚBLICO) ===
function criarReserva(e) {
  e.preventDefault();

  var data = {
    negocio_id: NEGOCIO_ID,
    quarto_id: document.getElementById('quarto_id').value,
    hospede_nome: document.getElementById('nome').value,
    hospede_documento: document.getElementById('documento').value,
    checkin: document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
    status: 'pendente'
  };

  fetch(SUPABASE_URL + '/rest/v1/hotel_reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + SUPABASE_KEY
    },
    body: JSON.stringify(data)
  })
  .then(r => {
    if (!r.ok) throw new Error('Erro ao reservar');
    alert('Reserva enviada! Aguarde confirmação.');
    window.location.href = 'index.html';
  })
  .catch(err => {
    alert('Erro ao enviar reserva');
    console.error(err);
  });
}
