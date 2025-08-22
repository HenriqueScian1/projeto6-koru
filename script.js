import { GoogleGenerativeAI } from 'https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm';

const API_KEY = 'AIzaSyCCou_j-rKsU_75Xe19W_Wme1L9YoFO2o8';

const form = document.getElementById('aiForm');
const questionEl = document.getElementById('question');
const askBtn = document.getElementById('askBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const exportHistoryBtn = document.getElementById('exportHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const themeToggle = document.getElementById('themeToggle');
const statusEl = document.getElementById('status');
const chatBox = document.getElementById('chatBox');
const charCount = document.getElementById('charCount');

let history = JSON.parse(localStorage.getItem('aiHistory') || '[]');
let lastAnswerText = ''; 

function getTime(){
  const d = new Date();
  return d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}

function persistHistory(){
  localStorage.setItem('aiHistory', JSON.stringify(history));
}

function scrollToBottom(){
  chatBox.scrollTop = chatBox.scrollHeight;
}

(function initTheme(){
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') document.body.classList.add('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
})();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  themeToggle.textContent = dark ? '☀️' : '🌙';
});

function playNotification(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.28);
  } catch {}
}

function bubble(text, who){
  const div = document.createElement('div');
  div.className = who; 
  div.innerHTML = `${text}<span class="time">${getTime()}</span>`;
  chatBox.appendChild(div);
  scrollToBottom();
  return div;
}

function renderHistory(){
  chatBox.innerHTML = '';
  history.forEach(item=>{
    const q = document.createElement('div');
    q.className = 'q';
    q.innerHTML = `${item.q}<span class="time">${item.time}</span>`;
    chatBox.appendChild(q);

    const a = document.createElement('div');
    a.className = 'a';
    a.innerHTML = `${item.a}<span class="time">${item.time}</span>`;
    chatBox.appendChild(a);
  });
  scrollToBottom();
}

function showTyping(){
  const typing = document.createElement('div');
  typing.className = 'a typing';
  typing.innerHTML = `Digitando<span class="dots">.</span>`;
  chatBox.appendChild(typing);
  scrollToBottom();

  let step = 1;
  const dotsEl = typing.querySelector('.dots');
  const interval = setInterval(()=>{
    step = (step % 3) + 1;
    dotsEl.textContent = '.'.repeat(step);
  }, 350);

  return {
    el: typing,
    stop: () => { clearInterval(interval); typing.remove(); }
  };
}

copyBtn.addEventListener('click', async () => {
  if (!lastAnswerText) return;
  try{
    await navigator.clipboard.writeText(lastAnswerText);
    statusEl.textContent = 'Resposta copiada.';
  }catch{
    statusEl.textContent = 'Não foi possível copiar.';
  }
});

clearBtn.addEventListener('click', () => {
  chatBox.innerHTML = '';
  statusEl.textContent = 'Conversa limpa.';
});

clearHistoryBtn.addEventListener('click', () => {
  if (!confirm('Deseja limpar todo o histórico salvo?')) return;
  history = [];
  persistHistory();
  renderHistory();
  statusEl.textContent = 'Histórico limpo.';
});

exportHistoryBtn.addEventListener('click', () => {
  if (history.length === 0){ alert('Não há histórico para exportar.'); return; }
  let text = 'Histórico de Conversas:\n\n';
  history.forEach((item, idx)=>{
    text += `${idx+1}. (${item.time})\nP: ${item.q}\nR: ${item.a}\n\n`;
  });
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'conversas.txt';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

questionEl.addEventListener('input', () => {
  charCount.textContent = `${questionEl.value.length} caractere${questionEl.value.length===1?'':'s'}`;
  questionEl.style.height = 'auto';
  questionEl.style.height = Math.min(questionEl.scrollHeight, 160) + 'px';
});

questionEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    form.dispatchEvent(new Event('submit', {cancelable:true}));
  }
});

function setLoading(on){
  askBtn.disabled = on;
  questionEl.disabled = on;
  askBtn.textContent = on ? 'Enviando…' : 'Enviar';
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const question = questionEl.value.trim();
  if (!question){ statusEl.textContent = 'Digite uma mensagem.'; return; }

  setLoading(true);
  statusEl.textContent = '';

  bubble(question, 'q');
  questionEl.value = '';
  questionEl.style.height = 'auto';
  charCount.textContent = '0 caracteres';

  const typing = showTyping();

  try{
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `Responda em português do Brasil, de forma clara e direta:\n\n${question}`
    );
    const text = result?.response?.text?.() || '(sem conteúdo)';

    typing.stop();

    bubble(text, 'a');
    lastAnswerText = text;
    playNotification();

    history.push({ q: question, a: text, time: getTime() });
    persistHistory();

    statusEl.textContent = 'Pronto';
  }catch(err){
    typing.stop();
    bubble(`Erro: ${err?.message || 'desconhecido'}`, 'a');
    statusEl.textContent = 'Ocorreu um erro ao responder.';
  }finally{
    setLoading(false);
  }
});

renderHistory();
