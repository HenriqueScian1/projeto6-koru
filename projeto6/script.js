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
