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
function limparHistorico() {
    conversationHistory = [];
    
    // Limpa as mensagens na tela
    const container = document.querySelector(".chat-container");
    if (container) {
        container.innerHTML = '';
    }
    
    // Adiciona mensagem de confirmação
    addMessage("🔄 Conversa reiniciada. Como posso ajudar?", "bot");
    
    // Limpa cache local se existir
    if (typeof localCache !== 'undefined') {
        localCache.clear();
    }
    
    console.log("🧹 Histórico limpo - Nova conversa iniciada");
    
    // Foca no input para nova mensagem
    const input = document.getElementById("msg");
    if (input) {
        input.focus();
    }
}
function explicaIA(){
    Swal.fire({
        title: "IA",
        html: `<div class="ia-container">
        <h3>🤖 O que é Inteligência Artificial (IA)?</h3>
        
        <p>A <strong>Inteligência Artificial (IA)</strong> é um campo da ciência da computação focado na criação de <strong>sistemas ou máquinas que podem simular a inteligência humana</strong>.</p>
        
        <p>Em essência, a IA permite que computadores <strong>aprendam</strong>, <strong>tomem decisões</strong>, <strong>resolvam problemas</strong> e <strong>compreendam</strong> a linguagem humana.</p>
        
        <h4>💡 Como a IA funciona?</h4>
        
        <p>A base da IA moderna é o <strong>Aprendizado de Máquina (Machine Learning)</strong>. Em vez de serem explicitamente programados para cada tarefa, os algoritmos são "treinados" em grandes quantidades de dados para:</p>
        
        <ul>
            <li><strong>Identificar Padrões:</strong> Processar dados (fotos, textos, números) para encontrar correlações.</li>
            <li><strong>Tomar Decisões:</strong> Usar esses padrões para fazer previsões ou escolhas.</li>
            <li><strong>Melhorar:</strong> Ajustar seus parâmetros a cada nova informação, tornando-se cada vez mais preciso.</li>
        </ul>
        
        <h4>🌎 Onde encontramos a IA?</h4>
        
        <p>A IA está presente em nosso dia a dia em diversas aplicações, tais como:</p>
        
        <ul>
            <li><strong>Assistentes Virtuais</strong> (Siri, Alexa).</li>
            <li><strong>Sistemas de Recomendação</strong> (Netflix, Spotify).</li>
            <li><strong>Carros Autônomos</strong> e sistemas de navegação avançados.</li>
            <li><strong>Análise de dados complexos</strong> e diagnóstico médico.</li>
        </ul>
        
        <p>Em resumo, a IA é a tecnologia que confere às máquinas a capacidade de <strong>raciocinar, aprender e agir</strong> de forma "inteligente" para realizar tarefas complexas.</p>
    
    </div>`
      });
}
window.onload = explicaIA()