document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const userQuestionInput = document.getElementById('user-question');
    const askButton = document.getElementById('ask-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const aiResponseParagraph = document.getElementById('ai-response');
    const clearButton = document.getElementById('clear-button');
    const copyButton = document.getElementById('copy-button');

    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
            askButton.disabled = true;
        } else {
            loadingIndicator.classList.add('hidden');
            askButton.disabled = false;
        }
    }

    clearButton.addEventListener('click', () => {
        aiResponseParagraph.textContent = '';
        clearButton.classList.add('hidden');
        copyButton.classList.add('hidden');
    });

    copyButton.addEventListener('click', () => {
        const textToCopy = aiResponseParagraph.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Resposta copiada para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar texto: ', err);
            alert('Falha ao copiar a resposta.');
        });
    });

    askButton.addEventListener('click', async () => {
        hideError();
        const apiKey = apiKeyInput.value.trim();
        const question = userQuestionInput.value.trim();

        if (!apiKey) {
            showError('Por favor, insira sua chave de API.');
            return;
        }

        if (!question) {
            showError('Por favor, digite sua pergunta.');
            return;
        }

        localStorage.setItem('openai_api_key', apiKey);

        setLoading(true);
        aiResponseParagraph.textContent = '';
        clearButton.classList.add('hidden');
        copyButton.classList.add('hidden');

        try {

            const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
            const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
            
            const API_URL = OPENAI_ENDPOINT; 

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', 
                    messages: [
                        { role: 'user', content: question }
                    ],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Erro na requisição da API.');
            }

            const data = await response.json();
            const aiResponseText = data.choices[0].message.content.trim();
            
            aiResponseParagraph.textContent = `Você perguntou: ${question}\n\nResposta da IA: ${aiResponseText}`;
            clearButton.classList.remove('hidden');
            copyButton.classList.remove('hidden');

        } catch (error) {
            console.error('Erro:', error);
            showError(`Ocorreu um erro: ${error.message}. Verifique sua chave de API e sua conexão.`);
            aiResponseParagraph.textContent = 'Não foi possível obter uma resposta no momento.';
        } finally {
            setLoading(false);
            userQuestionInput.value = '';
        }
    });
});


