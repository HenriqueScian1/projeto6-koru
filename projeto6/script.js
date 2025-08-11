
import { GoogleGenerativeAI } from 'https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm';

const form = document.getElementById('aiForm');
const questionEl = document.getElementById('question');
const statusEl = document.getElementById('status');
const answerEl = document.getElementById('answer');
const responseSection = document.getElementById('responseSection');


const API_KEY = 'AIzaSyCCou_j-rKsU_75Xe19W_Wme1L9YoFO2o8';

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const question = questionEl.value.trim();
  if (!question) { statusEl.textContent = 'Digite uma pergunta.'; return; }

  statusEl.textContent = 'Perguntando…';
  answerEl.textContent = '';
  responseSection.hidden = true;

  try {
    const result = await model.generateContent(
      `Responda em português do Brasil, de forma clara e direta: ${question}`
    );
    const text = result.response.text() || '(sem conteúdo)';
    answerEl.textContent = text;
    responseSection.hidden = false;
    statusEl.textContent = 'Pronto';
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Erro: ' + (err.message || 'desconhecido');
  }
});
