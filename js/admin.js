let ordemDecrescente = true;
let fichasCache = [];

function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano.slice(2)}`;
}

function verificarAcao() {
  const acaoSelect = document.getElementById('acaoSelect');
  const acaoPersonalizada = document.getElementById('acaoPersonalizada');
  acaoPersonalizada.style.display = acaoSelect.value === 'outros' ? 'block' : 'none';
}

async function adicionarFicha() {
  const data = document.getElementById('data').value;
  const localidade = document.getElementById('localidade').value.trim();
  const acaoSelect = document.getElementById('acaoSelect').value;
  const acaoPersonalizada = document.getElementById('acaoPersonalizada').value.trim();
  const selectResponsavel = document.getElementById("responsavel");
  const responsaveis = Array.from(selectResponsavel.selectedOptions).map(opt => opt.value);
  const observacao = document.getElementById('observacao').value.trim();

  const acao = (acaoSelect === 'outros') ? acaoPersonalizada : acaoSelect;

  if (!data || !localidade || !acao || responsaveis.length === 0) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  try {
    await db.collection("fichas").add({
      data,
      localidade,
      acao,
      responsavel: responsaveis,
      observacao,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Ficha salva com sucesso!");
    limparCampos();
    carregarFichas();
  } catch (error) {
    console.error("Erro ao salvar ficha:", error);
    alert("Erro ao salvar ficha. Veja o console para detalhes.");
  }
}

function limparCampos() {
  document.getElementById('data').value = '';
  document.getElementById('localidade').value = '';
  document.getElementById('acaoSelect').value = '';
  document.getElementById('acaoPersonalizada').value = '';
  document.getElementById('acaoPersonalizada').style.display = 'none';
  document.getElementById('responsavel').selectedIndex = -1;
  document.getElementById('observacao').value = '';
}

async function carregarFichas() {
  const container = document.getElementById('fichasContainer');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection("fichas").get();

    fichasCache = [];
    snapshot.forEach(doc => {
      const ficha = { id: doc.id, ...doc.data() };
      fichasCache.push(ficha);
    });

    ordenarEExibirFichas();
  } catch (error) {
    console.error("Erro ao carregar fichas:", error);
    alert("Erro ao carregar fichas. Veja o console para detalhes.");
  }
}

function ordenarEExibirFichas() {
  const container = document.getElementById('fichasContainer');

  fichasCache.sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    const dataA = new Date(a.data);
    const dataB = new Date(b.data);
    return ordemDecrescente ? dataB - dataA : dataA - dataB;
  });

  container.innerHTML = '';

  if (fichasCache.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888;">Nenhuma ficha cadastrada.</p>';
    return;
  }

  fichasCache.forEach(ficha => {
    const card = document.createElement('div');
    card.className = 'ficha-card';

    card.innerHTML = `
      <h3>${formatarDataBR(ficha.data)} - ${ficha.localidade}</h3>
      <p><strong>Ação:</strong> ${ficha.acao}</p>
      <p><strong>Responsável:</strong> ${Array.isArray(ficha.responsavel) ? ficha.responsavel.join(', ') : ficha.responsavel}</p>
      <p><strong>Observação:</strong> ${ficha.observacao || '-'}</p>
      <button onclick="excluirFicha('${ficha.id}')">Excluir</button>
    `;

    container.appendChild(card);
  });
}

function alternarOrdem() {
  ordemDecrescente = !ordemDecrescente;
  const btn = document.getElementById('btnOrdenar');
  btn.className = ordemDecrescente ? 'desc' : 'asc';
  ordenarEExibirFichas();
}

async function excluirFicha(id) {
  if (!confirm("Confirma exclusão desta ficha?")) return;
  try {
    await db.collection("fichas").doc(id).delete();
    fichasCache = fichasCache.filter(f => f.id !== id);
    ordenarEExibirFichas();
  } catch (error) {
    console.error("Erro ao excluir ficha:", error);
    alert("Erro ao excluir ficha. Veja o console para detalhes.");
  }
}

function acessarAdmin() {
  const senha = document.getElementById('senhaAdmin').value;
  if (senha === "admin123") {
    document.getElementById('opcoesAdmin').style.display = "block";
    alert("Acesso concedido!");
  } else {
    alert("Senha incorreta!");
  }
}

function filtrarPorMes() {
  const mesInput = document.getElementById('mesRelatorio').value;
  if (!mesInput) {
    alert("Selecione um mês para filtrar.");
    return;
  }

  const [anoFiltro, mesFiltro] = mesInput.split('-');

  const fichasFiltradas = fichasCache.filter(ficha => {
    if (!ficha.data) return false;
    const [ano, mes] = ficha.data.split('-');
    return ano === anoFiltro && mes === mesFiltro;
  });

  mostrarFichasFiltradas(fichasFiltradas);
}

function mostrarFichasFiltradas(fichas) {
  const container = document.getElementById('fichasContainer');
  container.innerHTML = '';

  if (fichas.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888;">Nenhuma ficha para este mês.</p>';
    return;
  }

  fichas.forEach(ficha => {
    const card = document.createElement('div');
    card.className = 'ficha-card';

    card.innerHTML = `
      <h3>${formatarDataBR(ficha.data)} - ${ficha.localidade}</h3>
      <p><strong>Ação:</strong> ${ficha.acao}</p>
      <p><strong>Responsável:</strong> ${Array.isArray(ficha.responsavel) ? ficha.responsavel.join(', ') : ficha.responsavel}</p>
      <p><strong>Observação:</strong> ${ficha.observacao || '-'}</p>
      <button onclick="excluirFicha('${ficha.id}')">Excluir</button>
    `;

    container.appendChild(card);
  });
}