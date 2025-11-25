const WORKER_URL = "https://iafscr.davi-af26.workers.dev";

let conversationHistory = [];

async function enviar() {
    const input = document.getElementById("msg");
    const userMsg = input.value.trim();
    if (!userMsg) return;

    addMessage(userMsg, "user");
    input.value = "";
    autoResize(input);
    input.disabled = true;

    const loadingId = showLoading();

    try {
        console.log('📤 Enviando para IA...');

        const body = { 
            content: userMsg,
            history: conversationHistory
        };

        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("📥 Resposta recebida:", data);

        hideLoading(loadingId);

        if (!response.ok || data.error) {
            throw new Error(data.message || `Erro ${response.status}`);
        }

        if (data.success && data.content) {
            addMessage(data.content, "bot");
            if (data.updatedHistory) {
                conversationHistory = data.updatedHistory;
            }
            console.log(`💬 Histórico: ${conversationHistory.length} mensagens`);
        } else {
            throw new Error("Resposta inválida do servidor");
        }

    } catch (error) {
        hideLoading(loadingId);
        console.error("💥 Erro:", error);

        if (error.message.includes('serviço') || error.message.includes('indisponível')) {
            addMessage("🔧 Estamos com problemas técnicos no momento. Tente novamente em alguns minutos.", "bot");
        } else if (error.message.includes('conexão')) {
            addMessage("🌐 Erro de conexão. Verifique sua internet e tente novamente.", "bot");
        } else {
            addMessage("❌ Ops! Algo deu errado: " + error.message, "bot");
        }
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function addMessage(text, type) {
    const container = document.querySelector(".chat-container");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type);
    msgDiv.innerText = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function showLoading() {
    const container = document.querySelector(".chat-container");
    const loadingDiv = document.createElement("div");
    const loadingId = "loading-" + Date.now();
    loadingDiv.id = loadingId;
    loadingDiv.classList.add("message", "bot", "loading");
    loadingDiv.innerHTML = "💭 Processando sua mensagem...";
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;
    return loadingId;
}

function hideLoading(id) {
    const loadingEl = document.getElementById(id);
    if (loadingEl) loadingEl.remove();
}

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function limparHistorico() {
    conversationHistory = [];
    const container = document.querySelector(".chat-container");
    container.innerHTML = '';
    addMessage("🔄 Conversa reiniciada. Como posso ajudar?", "bot");
    console.log("🧹 Histórico limpo");
}

document.addEventListener("DOMContentLoaded", function() {
    const textarea = document.getElementById("msg");
    if (textarea) {
        textarea.addEventListener("input", function() {
            autoResize(this);
        });
        
        textarea.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar();
            }
        });
        
        textarea.focus();
    }
    
    const container = document.querySelector(".chat-container");
    if (container && container.children.length === 0) {
        addMessage("👋 Olá! Estou aqui para ajudar. Pode me fazer qualquer pergunta!", "bot");
    }
    
    console.log("✅ Chat inicializado - Otimizado para custos");
});