import { GoogleGenerativeAI } from 'https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm';

const API_KEY = 'AIzaSyCCou_j-rKsU_75Xe19W_Wme1L9YoFO2o8';

const form = document.getElementById('aiForm');
const questionEl = document.getElementById('question');

const askBtn = document.getElementById('askBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

const statusEl = document.getElementById('status');
const responseSection = document.getElementById('responseSection');
const questionEcho = document.getElementById('questionEcho');
const answerEl = document.getElementById('answer');

function setLoading(on) {
  askBtn.disabled = on;
  questionEl.disabled = on;
  askBtn.textContent = on ? 'Perguntando…' : 'Perguntar';
  statusEl.textContent = on ? 'Enviando pergunta…' : '';
}

function showQA(question, answer) {
  questionEcho.textContent = question || '(vazio)';
  answerEl.textContent = answer || '(sem conteúdo)';
  responseSection.hidden = false;
  copyBtn.disabled = !answer;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const question = questionEl.value.trim();
  if (!question) { statusEl.textContent = 'Digite uma pergunta.'; return; }

  setLoading(true);
  responseSection.hidden = true;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `Responda em português do Brasil, de forma clara e direta:\n\n${question}`
    );
    const text = result.response.text() || '(sem conteúdo)';

    showQA(question, text);
    statusEl.textContent = 'Pronto';
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Erro: ' + (err?.message || 'desconhecido');
  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener('click', async () => {
  const txt = answerEl.textContent.trim();
  if (!txt) return;
  try {
    await navigator.clipboard.writeText(txt);
    statusEl.textContent = 'Resposta copiada.';
  } catch {
    statusEl.textContent = 'Não foi possível copiar.';
  }
});

clearBtn.addEventListener('click', () => {
  questionEl.value = '';
  answerEl.textContent = '';
  questionEcho.textContent = '';
  responseSection.hidden = true;
  copyBtn.disabled = true;
  statusEl.textContent = '';
});
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeBtn.textContent = '☀️ Modo Claro';
  } else {
    themeBtn.textContent = '🌙 Modo Escuro';
  }
});

const charCount = document.getElementById('charCount');

questionEl.addEventListener('input', () => {
  const len = questionEl.value.length;
  charCount.textContent = `${len} caractere${len !== 1 ? 's' : ''}`;
});
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

let history = JSON.parse(localStorage.getItem('aiHistory')) || [];

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<li>(sem histórico)</li>';
    return;
  }
  history.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>P:</strong> ${item.q}<br><strong>R:</strong> ${item.a}`;
    li.style.cursor = "pointer";
    li.addEventListener('click', () => {
      showQA(item.q, item.a);
      statusEl.textContent = `Carregado do histórico (#${idx+1})`;
    });
    historyList.appendChild(li);
  });
}

function saveToHistory(question, answer) {
  history.unshift({ q: question, a: answer });
  if (history.length > 20) history.pop(); 
  localStorage.setItem('aiHistory', JSON.stringify(history));
  renderHistory();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = questionEl.value.trim();
  if (!question) { statusEl.textContent = 'Digite uma pergunta.'; return; }

  setLoading(true);
  responseSection.hidden = true;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `Responda em português do Brasil, de forma clara e direta:\n\n${question}`
    );
    const text = result.response.text() || '(sem conteúdo)';

    showQA(question, text);
    saveToHistory(question, text); 
    statusEl.textContent = 'Pronto';
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Erro: ' + (err?.message || 'desconhecido');
  } finally {
    setLoading(false);
  }
});
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

clearHistoryBtn.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
    history = [];
    localStorage.removeItem('aiHistory');
    renderHistory();
    statusEl.textContent = 'Histórico limpo.';
  }
});


renderHistory();
const exportHistoryBtn = document.getElementById('exportHistoryBtn');

exportHistoryBtn.addEventListener('click', () => {
  if (history.length === 0) {
    alert("Não há histórico para exportar.");
    return;
  }

  let text = "Histórico de Conversas:\n\n";
  history.forEach((item, idx) => {
    text += `${idx + 1}. Pergunta: ${item.q}\n   Resposta: ${item.a}\n\n`;
  });

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "conversas.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  statusEl.textContent = 'Conversas exportadas.';
});
