// CHATBOT FUNCTIONALITY
class ChatBot {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.widget = document.getElementById('chatbotWidget');
        this.toggle = document.getElementById('chatbotToggle');
        this.messagesContainer = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.chatInput = document.getElementById('chatInput');
        this.closeChatbot = document.getElementById('closeChatbot');

        this.initializeEventListeners();
        this.addWelcomeMessage();
    }

    initializeEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeChatbot.addEventListener('click', () => this.closeChat());
        this.chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.widget.classList.contains('open')) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.widget.classList.toggle('open');
        if (this.widget.classList.contains('open')) {
            setTimeout(() => this.chatInput.focus(), 300);
        }
    }

    closeChat() {
        this.widget.classList.remove('open');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content:
                "👋 Hi! I'm the Tripp Digital assistant. Ask me about our website services, digital products, pricing, or anything else about growing your business online!",
        };
        this.messages.push(welcomeMessage);
        this.renderMessage(welcomeMessage);
    }

    async handleSendMessage(e) {
        e.preventDefault();

        const userMessage = this.chatInput.value.trim();
        if (!userMessage || this.isLoading) return;

        // Clear input
        this.chatInput.value = '';

        // Add user message to UI
        const userMsg = { role: 'user', content: userMessage };
        this.messages.push(userMsg);
        this.renderMessage(userMsg);

        // Show loading indicator
        this.showLoadingIndicator();

        try {
            // Call Claude API
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.messages }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const assistantMessage = {
                role: 'assistant',
                content: data.message,
            };

            this.messages.push(assistantMessage);
            this.removeLoadingIndicator();
            this.renderMessage(assistantMessage);
            this.scrollToBottom();
        } catch (error) {
            console.error('Chat error:', error);
            this.removeLoadingIndicator();
            const errorMessage = {
                role: 'system',
                content:
                    'Sorry, I encountered an error. Please try again or email us at trippdigital@gmail.com',
            };
            this.messages.push(errorMessage);
            this.renderMessage(errorMessage);
        }

        this.isLoading = false;
    }

    renderMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.role}`;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = message.content;

        messageEl.appendChild(bubble);
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    showLoadingIndicator() {
        this.isLoading = true;
        const loadingEl = document.createElement('div');
        loadingEl.className = 'chat-message assistant';
        loadingEl.id = 'loadingIndicator';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `;

        loadingEl.appendChild(bubble);
        this.messagesContainer.appendChild(loadingEl);
        this.scrollToBottom();
    }

    removeLoadingIndicator() {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
