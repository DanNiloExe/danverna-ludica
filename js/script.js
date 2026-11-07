
  // ==========================================
  // 1. CONFIGURAÇÕES GERAIS
  // ==========================================

  lucide.createIcons();

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuopydAjHi3i5q0RspghRKynGRmjP-EffmZnoc5aiwBpMpxW0oDgK0_tIEIwb46L0/exec';

  let isEditing = false;


  // ==========================================
  // 2. CONTAGEM REGRESSIVA
  // ==========================================

  const now = new Date();

  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 10, 20, 13, 0, 0);

  if (now > targetDate) {
    targetYear += 1;
    targetDate = new Date(targetYear, 10, 20, 13, 0, 0);
  }

  function updateCountdown() {
    const difference = targetDate.getTime() - new Date().getTime();
    const countdownEl = document.getElementById('countdown');

    if (!countdownEl) return;

    if (difference <= 0) {
      countdownEl.textContent = "O Encontro Começou! 🎲";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdownEl.textContent =
      `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }


  // ==========================================
  // 3. CALENDÁRIO
  // ==========================================

  const eventTitle = encodeURIComponent(
    "Danverna Lúdica - Piquenique & Jogos de Tabuleiro 🎲⚔️"
  );

  const eventDetails = encodeURIComponent(
    "Encontro de jogos de tabuleiro ao ar livre e piquenique da Danverna Lúdica no Parque da Jaqueira."
  );

  const eventLocation = encodeURIComponent(
    "Parque da Jaqueira, Recife - PE, Brasil"
  );

  const yearStr = targetYear.toString();

  const googleDates = `${yearStr}1120T160000Z/${yearStr}1120T210000Z`;

  const googleCalendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${googleDates}&details=${eventDetails}&location=${eventLocation}`;

  document.getElementById('btn-google-calendar').href = googleCalendarUrl;

  document.getElementById('btn-ics-calendar').addEventListener('click', () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Danverna Ludica//PT-BR",
      "BEGIN:VEVENT",
      `SUMMARY:Danverna Lúdica - Jogos & Piquenique`,
      `DESCRIPTION:Piquenique e jogos de tabuleiro ao ar livre no Parque da Jaqueira.`,
      `LOCATION:Parque da Jaqueira, Recife - PE`,
      `DTSTART:${yearStr}1120T160000Z`,
      `DTEND:${yearStr}1120T210000Z`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Danverna_Ludica.ics');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  });


  // ==========================================
  // 4. FORMULÁRIO - CAMPOS E INTERAÇÕES
  // ==========================================

  document.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const plusOneContainer = document.getElementById('plus-one-container');
      const declineReasonContainer = document.getElementById('decline-reason-container');

      if (e.target.value === 'confirm') {
        plusOneContainer.classList.remove('hidden');
        declineReasonContainer.classList.add('hidden');
      } else {
        plusOneContainer.classList.add('hidden');
        declineReasonContainer.classList.remove('hidden');
      }
    });
  });


  // ==========================================
  // 5. CENSO - ATUALIZAÇÃO DE PARTICIPANTES
  // ==========================================

  async function fetchTotals() {
    if (GOOGLE_SCRIPT_URL.includes('SUA_URL')) return;

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();

      document.getElementById('count-confirmed').textContent =
        data.confirmados || 0;

      document.getElementById('count-declined').textContent =
        data.recusados || 0;

    } catch (err) {
      console.error("Erro ao buscar censo:", err);
    }
  }


  // ==========================================
  // 6. FORMULÁRIO - CONTROLE DE RESPOSTA
  // ==========================================

  function checkUserSubmission() {
    const hasVoted = localStorage.getItem('danverna_voted');

    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (hasVoted) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `✓ Você já respondeu este convite!`;

      submitBtn.classList.replace('bg-amber-800', 'bg-emerald-900');
      submitBtn.classList.add('opacity-80', 'cursor-not-allowed');

      formStatus.classList.remove('hidden');

      formStatus.innerHTML = `
        ✨ Sua resposta já está gravada no Conselho! <br>
        <button type="button" id="btn-reset-vote"
          class="mt-2 text-xs text-amber-900 underline hover:text-amber-950 font-bold">
          Clique aqui se desejar alterar sua resposta
        </button>
      `;

      document.getElementById('btn-reset-vote')?.addEventListener('click', () => {
        submitBtn.disabled = false;

        submitBtn.innerHTML =
          `<i data-lucide="send" class="w-5 h-5"></i> Atualizar Resposta`;

        submitBtn.classList.replace('bg-emerald-900', 'bg-amber-800');
        submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');

        formStatus.classList.add('hidden');

        isEditing = true;

        lucide.createIcons();
      });
    }
  }


  // ==========================================
  // 7. FORMULÁRIO - ENVIO DA RESPOSTA
  // ==========================================

  document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (localStorage.getItem('danverna_voted') && !isEditing) {
      alert("Você já enviou sua resposta neste dispositivo!");
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (GOOGLE_SCRIPT_URL.includes('SUA_URL')) {
      alert("Por favor, insira a URL do seu Google Apps Script.");
      return;
    }

    // Dados da resposta
    const nomeInput = document.getElementById('guest-name');
    const nome = nomeInput ? nomeInput.value.trim() : 'Anônimo';

    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;

    if (!attendance) {
      alert("Selecione se você vai ou não ao encontro.");
      return;
    }

    const status = attendance === 'confirm' ? 'Vai' : 'Não vai';

    const plusOne = document.getElementById('plus-one').checked
      ? 'Sim'
      : 'Não';

    const motivo = document.getElementById('decline-reason').value.trim();

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      `<i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto"></i> Registrando...`;

    lucide.createIcons();

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          nome,
          acompanhante: plusOne,
          motivo
        })
      });

      // Registro local
      localStorage.setItem('danverna_voted', 'true');
      isEditing = false;

      formStatus.classList.remove('hidden');

      submitBtn.innerHTML = `✓ Presença Gravada!`;
      submitBtn.classList.replace('bg-amber-800', 'bg-emerald-800');

      checkUserSubmission();

      setTimeout(fetchTotals, 1500);

    } catch (err) {
      console.error("Erro ao enviar resposta:", err);

      alert("Erro ao registrar resposta. Tente novamente.");

      submitBtn.disabled = false;
      submitBtn.innerHTML =
        `<i data-lucide="send" class="w-5 h-5"></i> Tentar Novamente`;

      lucide.createIcons();
    }
  });


      // ==========================================
  // 8. VOTAÇÃO - SELEÇÃO DOS JOGOS
  // ==========================================

  const voteButtons = document.querySelectorAll('.game-vote-btn');
  const selectedCount = document.getElementById('votes-selected-count');
  const saveVotesBtn = document.getElementById('save-votes-btn');
  const votesStatus = document.getElementById('votes-status');

  const VOTES_STORAGE_KEY = 'danverna_game_votes';

  let selectedGames = [];

  // Recupera seleções anteriores
  try {
    const savedVotes = JSON.parse(
      localStorage.getItem(VOTES_STORAGE_KEY) || '[]'
    );

    if (Array.isArray(savedVotes)) {
      selectedGames = savedVotes.slice(0, 3);
    }
  } catch (err) {
    selectedGames = [];
  }

  // Atualiza a aparência dos botões
  function updateVoteButtons() {
    voteButtons.forEach(button => {
      const game = button.dataset.game;
      const selected = selectedGames.includes(game);

      button.setAttribute('aria-pressed', selected);

      button.classList.toggle('bg-amber-700', selected);
      button.classList.toggle('text-amber-100', selected);
      button.classList.toggle('border-amber-400', selected);

      if (selected) {
        button.innerHTML = '✓ Selecionado';
      } else {
        button.innerHTML = '＋ Quero jogar!';
      }
    });

    selectedCount.textContent = selectedGames.length;
    saveVotesBtn.disabled = selectedGames.length === 0;
  }

  // Seleciona ou remove um jogo
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const game = button.dataset.game;
      const alreadySelected = selectedGames.includes(game);

      if (alreadySelected) {
        selectedGames = selectedGames.filter(item => item !== game);
      } else {
        if (selectedGames.length >= 3) {
          votesStatus.textContent = 'Você pode escolher no máximo 3 jogos!';
          return;
        }

        selectedGames.push(game);
      }

      localStorage.setItem(
        VOTES_STORAGE_KEY,
        JSON.stringify(selectedGames)
      );

      votesStatus.textContent = '';
      updateVoteButtons();
    });
  });

  // Restaura a seleção ao abrir a página
  updateVoteButtons();

  // ==========================================
  // 9. VOTAÇÃO - ENVIO DOS VOTOS
  // ==========================================

  // Identificador anônimo e persistente do navegador
  let voterId = localStorage.getItem('danverna_game_voter_id');

  if (!voterId) {
    voterId = crypto.randomUUID
      ? crypto.randomUUID()
      : 'voter-' + Date.now() + '-' + Math.random().toString(36).substring(2);

    localStorage.setItem('danverna_game_voter_id', voterId);
  }

  // Envia os votos para o Google Sheets
  saveVotesBtn.addEventListener('click', async () => {
    if (selectedGames.length === 0 || selectedGames.length > 3) {
      votesStatus.textContent = 'Selecione de 1 a 3 jogos antes de registrar.';
      return;
    }

    saveVotesBtn.disabled = true;
    saveVotesBtn.textContent = 'Registrando votos...';
    votesStatus.textContent = 'Enviando suas escolhas para a Taverna...';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          tipo: 'votacao',
          id: voterId,
          jogos: selectedGames
        })
      });

      votesStatus.textContent =
        'Solicitação enviada! Seus votos foram registrados. 🎲';
        setTimeout(fetchGameRanking, 1500);

    } catch (err) {
      console.error('Erro ao enviar votos:', err);

      votesStatus.textContent =
        'Não foi possível enviar os votos. Tente novamente.';
    } finally {
      saveVotesBtn.textContent = 'Registrar meus votos';
      updateVoteButtons();
    }
  });

 
  // ==========================================
  // 10. VOTAÇÃO - CLASSIFICAÇÃO DOS JOGOS
  // ==========================================

  async function fetchGameRanking() {
    const rankingContainer = document.getElementById('games-ranking');

    try {
      const response = await fetch(
        GOOGLE_SCRIPT_URL + '?tipo=votacao&t=' + Date.now()
      );

      const data = await response.json();

      if (data.result !== 'success') {
        throw new Error('Não foi possível consultar a classificação.');
      }

      rankingContainer.innerHTML = '';

      if (!data.ranking || data.ranking.length === 0) {
        rankingContainer.innerHTML = `
          <p class="text-center text-amber-200/60 text-sm">
            Ainda não existem votos registrados. Seja o primeiro!
          </p>
        `;
        return;
      }

      // Imagens dos jogos
      const gameImages = {
        'Taco Gato 🐱': 'https://storage.googleapis.com/ludopedia-capas/24269_m.jpg',
        'Nem a Pato! 🦆': 'https://storage.googleapis.com/ludopedia-capas/55059_m.jpg',
        'Dobro 🔢': 'https://storage.googleapis.com/ludopedia-capas/66291_m.jpg',
        'The Lie 🤥': 'https://storage.googleapis.com/ludopedia-capas/66472_m.jpg',
        'Uno 🃏': 'https://storage.googleapis.com/ludopedia-capas/26669_m.jpg',
        'Pool Party Stars 🏖️': 'https://storage.googleapis.com/ludopedia-capas/77892_m.jpg',
        'Coup 👑': 'https://storage.googleapis.com/ludopedia-capas/460_m.jpg',
        'The Resistance 🗡️': 'https://storage.googleapis.com/ludopedia-capas/780_m.jpg',
        'Werewolves 🐺': 'https://storage.googleapis.com/ludopedia-capas/1281_m.jpg',
        'Saboteur ⛏️': 'https://storage.googleapis.com/ludopedia-capas/620_m.jpg',
        'Unstable Unicorns 🦄': 'https://storage.googleapis.com/ludopedia-capas/15264_m.jpg',
        'Tacta 🔷': 'https://storage.googleapis.com/ludopedia-capas/79397_m.jpg',
        'Alcatraz 🗝️': 'https://storage.googleapis.com/ludopedia-capas/81692_m.jpg'
      };

      const maxVotes = Math.max(...data.ranking.map(item => item.votos));

      data.ranking.forEach((item, index) => {
        const position = index + 1;

        const percentage = maxVotes > 0
          ? (item.votos / maxVotes) * 100
          : 0;

        const medal = position === 1
          ? '🥇'
          : position === 2
            ? '🥈'
            : position === 3
              ? '🥉'
              : `${position}º`;

        const gameRow = document.createElement('div');

        gameRow.className = `
          rounded-xl p-4 border transition-all duration-300
          ${position === 1
            ? 'bg-amber-900/30 border-amber-400/60 shadow-lg shadow-amber-900/20'
            : 'bg-black/20 border-amber-700/30 hover:border-amber-500/50'}
        `;

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between gap-3 mb-3';

        // Imagem e título do jogo
        const gameInfo = document.createElement('div');
        gameInfo.className = 'flex items-center gap-3 min-w-0';

        const gameImage = document.createElement('img');
        gameImage.src = gameImages[item.jogo] || 'https://placehold.co/80x80';
        gameImage.alt = item.jogo;
        gameImage.loading = 'lazy';
        gameImage.className = 'w-12 h-12 object-cover rounded-lg border border-amber-600/40 shrink-0';
        

        const gameName = document.createElement('span');
        gameName.className = `
          font-medieval font-bold
          ${position === 1 ? 'text-amber-300' : 'text-amber-100'}
        `;
        gameName.textContent = `${medal} ${item.jogo}`;

        gameInfo.appendChild(gameImage);
        gameInfo.appendChild(gameName);

        const voteCount = document.createElement('span');
        voteCount.className = 'text-amber-400 font-bold text-sm whitespace-nowrap';
        voteCount.textContent =
          `${item.votos} ${item.votos === 1 ? 'voto' : 'votos'}`;

        header.appendChild(gameInfo);
        header.appendChild(voteCount);

        const progressBackground = document.createElement('div');
        progressBackground.className =
          'w-full h-2 bg-black/40 rounded-full overflow-hidden';

        const progressBar = document.createElement('div');
        progressBar.className = `
          h-full rounded-full transition-all duration-700
          ${position === 1 ? 'bg-amber-400' : 'bg-amber-700'}
        `;

        progressBar.style.width = `${percentage}%`;

        progressBackground.appendChild(progressBar);

        gameRow.appendChild(header);
        gameRow.appendChild(progressBackground);

        rankingContainer.appendChild(gameRow);
      });

    } catch (err) {
      console.error('Erro ao carregar classificação:', err);

      rankingContainer.innerHTML = `
        <p class="text-center text-red-300 text-sm">
          Não foi possível carregar a classificação.
        </p>
      `;
    }
  }

  // ==========================================
  // 11. INICIALIZAÇÃO
  // ==========================================
fetchGameRanking();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  fetchTotals();
  checkUserSubmission();

  // Atualiza os totais a cada 1 hora
  setInterval(fetchTotals, 3600000);

