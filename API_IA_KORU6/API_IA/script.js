document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("api-key");
    const userQuestionInput = document.getElementById("user-question");
    const askButton = document.getElementById("ask-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const errorMessage = document.getElementById("error-message");
    const aiResponseParagraph = document.getElementById("ai-response");
    const clearButton = document.getElementById("clear-button");
    const copyButton = document.getElementById("copy-button");
    const charCount = document.getElementById("char-count");
    const conversationHistoryDiv = document.getElementById("conversation-history");
    const clearHistoryButton = document.getElementById("clear-history-button");
    const themeToggleButton = document.getElementById("theme-toggle");
    const MAX_CHARS = 500;

    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    let conversation = JSON.parse(localStorage.getItem("conversationHistory")) || [];

    function renderHistory() {
        conversationHistoryDiv.innerHTML = "";
        if (conversation.length === 0) {
            clearHistoryButton.classList.add("hidden");
            return;
        }
        clearHistoryButton.classList.remove("hidden");
        conversation.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.classList.add("history-entry");
            entryDiv.innerHTML = `
                <p><strong>Você:</strong> ${entry.question}</p>
                <p><strong>IA:</strong> ${entry.response}</p>
            `;
            conversationHistoryDiv.appendChild(entryDiv);
        });
        conversationHistoryDiv.scrollTop = conversationHistoryDiv.scrollHeight;
    }

    function saveHistory() {
        localStorage.setItem("conversationHistory", JSON.stringify(conversation));
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }

    function hideError() {
        errorMessage.classList.add("hidden");
        errorMessage.textContent = "";
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.classList.remove("hidden");
            askButton.disabled = true;
        } else {
            loadingIndicator.classList.add("hidden");
            askButton.disabled = false;
        }
    }

    clearButton.addEventListener("click", () => {
        aiResponseParagraph.textContent = "";
        clearButton.classList.add("hidden");
        copyButton.classList.add("hidden");
    });

    copyButton.addEventListener("click", () => {
        const textToCopy = aiResponseParagraph.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Resposta copiada para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar texto: ", err);
            alert("Falha ao copiar a resposta.");
        });
    });

    clearHistoryButton.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja limpar todo o histórico de conversas?")) {
            conversation = [];
            saveHistory();
            renderHistory();
        }
    });

    userQuestionInput.addEventListener("input", () => {
        const currentLength = userQuestionInput.value.length;
        charCount.textContent = `${currentLength}/${MAX_CHARS}`;
        if (currentLength > MAX_CHARS) {
            userQuestionInput.classList.add("error");
            askButton.disabled = true;
            showError(`Limite de ${MAX_CHARS} caracteres excedido.`);
        } else {
            userQuestionInput.classList.remove("error");
            askButton.disabled = false;
            hideError();
        }
    });

    function applyTheme(theme) {
        document.body.classList.toggle("dark-mode", theme === "dark");
        themeToggleButton.innerHTML = theme === "dark" ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    themeToggleButton.addEventListener("click", () => {
        const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });

    askButton.addEventListener("click", async () => {
        hideError();
        const apiKey = apiKeyInput.value.trim();
        const question = userQuestionInput.value.trim();

        if (!apiKey) {
            showError("Por favor, insira sua chave de API.");
            return;
        }

        if (!question) {
            showError("Por favor, digite sua pergunta.");
            return;
        }

        if (question.length > MAX_CHARS) {
            showError(`A pergunta excede o limite de ${MAX_CHARS} caracteres.`);
            return;
        }

        localStorage.setItem("openai_api_key", apiKey);

        setLoading(true);
        aiResponseParagraph.textContent = "";
        clearButton.classList.add("hidden");
        copyButton.classList.add("hidden");

        try {
            const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
            
            const response = await fetch(OPENAI_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: question }
                    ],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || "Erro na requisição da API do ChatGPT.");
            }

            const data = await response.json();
            const aiResponseText = data.choices[0].message.content.trim();
            
            aiResponseParagraph.textContent = `Você perguntou: ${question}\n\nResposta da IA: ${aiResponseText}`;
            clearButton.classList.remove("hidden");
            copyButton.classList.remove("hidden");

            conversation.push({ question: question, response: aiResponseText });
            saveHistory();
            renderHistory();

        } catch (error) {
            console.error("Erro:", error);
            showError(`Ocorreu um erro: ${error.message}. Verifique sua chave de API e sua conexão.`);
            aiResponseParagraph.textContent = "Não foi possível obter uma resposta no momento.";
        } finally {
            setLoading(false);
            userQuestionInput.value = "";
            charCount.textContent = `0/${MAX_CHARS}`;
        }
    });

    renderHistory(); 
});

