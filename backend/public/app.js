const $ = (s, d=document) => d.querySelector(s);
const cardsEl = $('#cards');
const healthEl = $('#health');

async function pingHealth() {
  try {
    const r = await fetch('/health');
    healthEl.textContent = r.ok ? 'ok' : 'down';
    healthEl.style.background = r.ok ? '#e9f7ef' : '#fdecea';
  } catch {
    healthEl.textContent = 'down';
    healthEl.style.background = '#fdecea';
  }
}

function renderCards(list) {
  cardsEl.innerHTML = '';
  if (!list.length) {
    cardsEl.innerHTML = `<p class="empty">No cards yet. Add your first one above.</p>`;
    return;
  }
  for (const c of list) {
    const payload = typeof c.payload === 'string' ? JSON.parse(c.payload) : c.payload;
    const item = document.createElement('article');
    item.className = 'card';
    item.innerHTML = `
      <div class="meta">
        <span class="pill">#${c.id}</span>
        <span class="pill">${c.type}</span>
        <span class="pill">${c.node}</span>
        <span>${new Date(c.created_at).toLocaleString()}</span>
      </div>
      <p>${payload?.insight ?? ''}</p>
      <div class="meta">
        ${payload?.sentiment ? `<span class="pill">sentiment: ${payload.sentiment}</span>` : ''}
        ${Array.isArray(payload?.themes) ? payload.themes.map(t => `<span class="pill">${t}</span>`).join('') : ''}
      </div>
    `;
    cardsEl.appendChild(item);
  }
}

async function loadCards() {
  const r = await fetch('/cards');
  const data = await r.json();
  renderCards(data);
}

$('#newCard').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const payload = {
    sentiment: fd.get('sentiment'),
    themes: (fd.get('themes') || '').split(',').map(s => s.trim()).filter(Boolean),
    insight: fd.get('insight') || ''
  };
  const body = {
    type: fd.get('type'),
    node: fd.get('node'),
    payload
  };
  try {
    const r = await fetch('/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      alert('Failed to add card: ' + (err.error || r.statusText));
      return;
    }
    e.currentTarget.reset();
    await loadCards();
  } catch (err) {
    alert('Network error: ' + err.message);
  }
});

await pingHealth();
await loadCards();
