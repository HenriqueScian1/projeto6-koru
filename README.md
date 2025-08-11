
# 🤖 Assistente de IA Web — Aulas 22 e 25 (Projeto Fullstack)

## 📌 Visão Geral
Este guia abrange as **Aulas 22 e 25** do projeto fullstack, onde desenvolveremos um **Assistente de IA Web completo** usando **HTML**, **CSS** e **JavaScript puro** (*sem frameworks*).

---

## 🎯 Objetivos Gerais
Ao final das tutorias, você será capaz de:

- Criar uma aplicação web interativa do zero
- Integrar com APIs externas (OpenAI / Google Gemini)
- Implementar validação de formulários
- Gerenciar estados de carregamento e erro
- Usar APIs do navegador (`localStorage`, `clipboard`)
- Criar interfaces responsivas e acessíveis
- Aplicar boas práticas de UX/UI

---

## 📂 Estrutura do Projeto
```

assistente-ia/
├── index.html
├── style.css
└── script.js

````

---

## 💡 Conceito da Aplicação
1. Usuário digita uma pergunta
2. Clica em **"Perguntar"**
3. App faz requisição para a API da OpenAI
4. Exibe a resposta da IA

---

## ⚙️ Funcionalidades do Projeto

### **Requisitos Básicos**
1. **Estrutura HTML Básica**
   - Cabeçalho com título
   - Input para chave de API
   - Campo de pergunta e botão de envio
   - Área para resposta da IA

2. **Interface de Entrada**
   - Campo de texto para pergunta
   - Botão **"Perguntar"**
   - Input de API Key (tipo `password`)

3. **Exibição da Resposta**
   - Área dedicada para resposta
   - Texto formatado e legível
   - Área oculta até receber resposta

4. **Integração com API**
   - Requisição `POST` para a OpenAI
   - Envio de pergunta + API Key
   - Processamento e exibição da resposta
   - Uso de `fetch()` e `async/await`

---

### **Requisitos Extras (Opcionais)**

#### 📌 Estados e Validação
- Loading durante requisição
- Botão desabilitado durante carregamento
- Validação de API Key e pergunta
- Tratamento de erros
- Mensagens amigáveis

#### 📌 Interação
- Limpar resposta
- Copiar resposta para clipboard
- Salvar API Key no `localStorage`
- Atalhos de teclado (`Ctrl+Enter`)

#### 📌 Interface
- Mostrar pergunta junto da resposta
- Ícones nos botões
- Animações suaves
- Contador de caracteres
- Scroll automático para resposta
- Dropdown para escolher modelo de IA

#### 📌 Configurações Avançadas
- Histórico de conversas
- Temas **dark mode / light mode**

---

## 🔧 Configuração e Uso

### **Pré-requisitos**
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Chave de API da OpenAI ou Google Gemini
- Editor de código (VS Code recomendado)
- Conhecimentos básicos em HTML, CSS e JavaScript

---

## 🚀 Fluxo da Aplicação
1. Obter API Key da OpenAI ou Google Gemini
2. Abrir a aplicação no navegador
3. Inserir API Key
4. Digitar pergunta
5. Clicar em **"Perguntar"** ou usar `Ctrl+Enter`
6. Ver resposta da IA
7. Copiar ou limpar para nova pergunta

---

## 🔑 Como Obter uma API Key

### **OpenAI (Pago com créditos gratuitos iniciais)**
1. [Acesse o site](https://platform.openai.com/)
2. Crie conta ou faça login
3. Vá em **API Keys**
4. Clique em **Create new secret key**
5. Copie e guarde em local seguro

💡 *Novos usuários recebem créditos gratuitos limitados.*

---

### **Google Gemini (Gratuito)**
1. [Acesse o Google AI Studio](https://aistudio.google.com/)
2. Faça login com conta Google
3. Clique em **Get API Key**
4. Crie e salve sua chave
5. Aproveite uso gratuito generoso para testes

🔹 *Não adicione dados de pagamento para manter o plano gratuito.*

---

## 🔄 Adaptando o Código para Gemini
A API do Google Gemini é compatível com o formato da OpenAI. Basta ajustar:

```js
const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const apiKey = "SUA_API_KEY_GEMINI";
````

---

## 🏁 Conclusão

Ao finalizar, você terá criado uma aplicação que:

✅ Integra com uma API de IA real
✅ Possui interface profissional e responsiva
✅ Segue boas práticas de desenvolvimento
✅ Oferece excelente experiência do usuário
✅ Demonstra conceitos fundamentais da web

---

📜 *Este projeto é uma base sólida para criar aplicações modernas usando tecnologias fundamentais da web.*

```

