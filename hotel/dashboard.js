<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Painel do Hotel</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<h1>Painel do Hotel</h1>

<div class="cards">
  <div>Quartos: <span id="qtdQuartos">0</span></div>
  <div>Reservas: <span id="qtdReservas">0</span></div>
  <div>Hospedagens Ativas: <span id="qtdHospedagens">0</span></div>
</div>

<button onclick="irQuartos()">Gerenciar Quartos</button>
<button onclick="logout()">Sair</button>

<script src="config.js"></script>
<script src="dashboard.js"></script>
</body>
</html>
