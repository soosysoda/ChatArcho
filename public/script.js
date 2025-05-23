document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    let conversationHistory = [];

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        conversationHistory.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });
    }

    async function sendMessage(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    "model": "google/gemma-3n-e4b-it:free",
                    message,
                    conversationHistory
                })
            });
            const data = await response.json();

            if (response.ok) {
                addMessage(data.reply, false);
            } else {
                console.error('Error:', data.error);
                addMessage('An error occured while processing your request', false);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('An error occured while processing your request', false);
        }
    }

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessage(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessage(message);
            }
        }
    });
});