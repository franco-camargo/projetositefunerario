document.addEventListener('DOMContentLoaded', () => {

    // 1. CONFIGURAÇÃO REAL DO SEU PROJETO FIREBASE
    const firebaseConfig = {
        apiKey: "AIzaSyCn6xNdARwMuwdPcTlSkAXvMstg4EY_Zt0",
        authDomain: "projetositefuneraria.firebaseapp.com",
        projectId: "projetositefuneraria",
        storageBucket: "projetositefuneraria.firebasestorage.app",
        messagingSenderId: "740700408278",
        appId: "1:740700408278:web:47dfaa154518b364b2bc77"
    };

    // Inicializa Firebase se a biblioteca estiver pronta
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
    }
    const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
    const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

    // 2. LÓGICA DO CARRINHO DE COMPRAS E ATUALIZAÇÃO NO TOPO
    let totalCarrinho = 0;

    function adicionarAoCarrinho(nome, preco) {
        totalCarrinho += preco;
        
        const itemCarrinhoEl = document.getElementById('item-carrinho');
        const totalCarrinhoEl = document.getElementById('total-carrinho');
        const topTotalCarrinhoEl = document.getElementById('top-total-carrinho');

        if (itemCarrinhoEl) itemCarrinhoEl.innerText = `Último item adicionado: ${nome}`;
        if (totalCarrinhoEl) totalCarrinhoEl.innerText = totalCarrinho.toFixed(2);
        if (topTotalCarrinhoEl) topTotalCarrinhoEl.innerText = totalCarrinho.toFixed(2);
    }

    const btnHeaderCart = document.getElementById('header-cart-btn');
    if (btnHeaderCart) {
        btnHeaderCart.addEventListener('click', () => {
            const cartSection = document.getElementById('cart-section');
            if (cartSection) cartSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const btnComprar1 = document.getElementById('btn-comprar-1');
    const btnComprar2 = document.getElementById('btn-comprar-2');
    const btnComprar3 = document.getElementById('btn-comprar-3');

    if (btnComprar1) btnComprar1.addEventListener('click', () => adicionarAoCarrinho('Urna Jacarandá Nobre', 2500.00));
    if (btnComprar2) btnComprar2.addEventListener('click', () => adicionarAoCarrinho('Coroa Floral Homenagem', 350.00));
    if (btnComprar3) btnComprar3.addEventListener('click', () => adicionarAoCarrinho('Plano Assistencial', 89.90));

    // 3. CONTROLE DO MENU DROPDOWN E MODAL DE FEEDBACK
    const btnMenuFeedback = document.getElementById('btn-feedback-menu');
    const dropdownOptions = document.getElementById('dropdown-options');
    const modalFeedback = document.getElementById('modal-feedback');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalTipoInput = document.getElementById('modal-tipo-feedback');

    if (btnMenuFeedback && dropdownOptions) {
        btnMenuFeedback.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', () => {
            dropdownOptions.style.display = 'none';
        });
    }

    window.abrirModalFeedback = function(tipo) {
        if (dropdownOptions) dropdownOptions.style.display = 'none';
        if (modalTipoInput) modalTipoInput.value = tipo;
        if (modalTitle) modalTitle.innerText = `Envie sua mensagem (${tipo.toUpperCase()})`;
        if (modalFeedback) modalFeedback.style.display = 'block';
    };

    const optSugestao = document.getElementById('opt-sugestao');
    const optReclamacao = document.getElementById('opt-reclamacao');
    const optElogio = document.getElementById('opt-elogio');

    if (optSugestao) optSugestao.addEventListener('click', () => abrirModalFeedback('sugestao'));
    if (optReclamacao) optReclamacao.addEventListener('click', () => abrirModalFeedback('reclamacao'));
    if (optElogio) optElogio.addEventListener('click', () => abrirModalFeedback('elogio'));

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modalFeedback) modalFeedback.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalFeedback) modalFeedback.style.display = 'none';
    });

    // 4. GRAVAÇÃO NA COLEÇÃO 'FAQ' DO FIREBASE
    const formFeedbackModal = document.getElementById('form-feedback-modal');
    if (formFeedbackModal) {
        formFeedbackModal.addEventListener('submit', function(e) {
            e.preventDefault();

            const tipo = modalTipoInput ? modalTipoInput.value : 'sugestao';
            const nome = document.getElementById('modal-nome').value;
            const email = document.getElementById('modal-email').value;
            const mensagem = document.getElementById('modal-mensagem').value;

            if (!db) {
                alert('Erro: Conexão com o Firebase não configurada.');
                return;
            }

            db.collection('faq').add({
                tipo: tipo,
                nome: nome,
                email: email,
                mensagem: mensagem,
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert('Mensagem enviada com sucesso! Agradecemos sua contribuição.');
                formFeedbackModal.reset();
                if (modalFeedback) modalFeedback.style.display = 'none';
            })
            .catch((error) => {
                console.error("Erro ao salvar no Firestore: ", error);
                alert('Erro ao enviar mensagem.');
            });
        });
    }

    // 5. API VIACEP E CÁLCULO DE FRETE
    async function buscarCEP() {
        const cepInput = document.getElementById('cep');
        const divResultado = document.getElementById('resultado-cep');

        if (!cepInput || !divResultado) return;

        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            divResultado.innerText = 'Por favor, digite um CEP válido com 8 dígitos.';
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                divResultado.innerText = 'CEP não encontrado.';
            } else {
                divResultado.innerHTML = `
                    Endereço: ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}<br>
                    <span style="color: #27ae60;">Frete: GRATUITO (Região Atendida)</span>
                `;
            }
        } catch (error) {
            divResultado.innerText = 'Erro ao consultar o CEP. Tente novamente.';
        }
    }

    const btnConsultarCep = document.getElementById('btn-consultar-cep');
    if (btnConsultarCep) btnConsultarCep.addEventListener('click', buscarCEP);

    // 6. TECLA DE ATALHO PARA EXIBIR/OCULTAR O PAINEL ADMIN (Ctrl + Shift + A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            
            const adminSection = document.getElementById('admin-section');
            if (adminSection) {
                adminSection.classList.toggle('admin-hidden');
                
                if (!adminSection.classList.contains('admin-hidden')) {
                    adminSection.scrollIntoView({ behavior: 'smooth' });
                    const inputEmail = document.getElementById('admin-email');
                    if (inputEmail) inputEmail.focus();
                }
            }
        }
    });

    // 7. AUTENTICAÇÃO DA ÁREA DO ADMINISTRADOR
    function loginAdmin() {
        const email = document.getElementById('admin-email').value;
        const senha = document.getElementById('admin-senha').value;

        if (!auth) {
            alert("Firebase Auth não está inicializado.");
            return;
        }

        auth.signInWithEmailAndPassword(email, senha)
            .then(() => {
                alert("Acesso autorizado!");
                carregarDashboard();
            })
            .catch((error) => {
                alert("Erro ao autenticar: " + error.message);
            });
    }

    function logoutAdmin() {
        if (!auth) return;
        auth.signOut().then(() => {
            const adminDashboard = document.getElementById('admin-dashboard');
            const loginAdminForm = document.getElementById('login-admin-form');
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (loginAdminForm) loginAdminForm.style.display = 'block';
        });
    }

    const btnLoginAdmin = document.getElementById('btn-login-admin');
    const btnLogoutAdmin = document.getElementById('btn-logout-admin');

    if (btnLoginAdmin) btnLoginAdmin.addEventListener('click', loginAdmin);
    if (btnLogoutAdmin) btnLogoutAdmin.addEventListener('click', logoutAdmin);

    // 8. BUSCA E EXIBIÇÃO DA COLEÇÃO 'FAQ' NO PAINEL ADMIN
    function carregarDashboard() {
        const loginAdminForm = document.getElementById('login-admin-form');
        const adminDashboard = document.getElementById('admin-dashboard');

        if (loginAdminForm) loginAdminForm.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';

        if (!db) return;

        db.collection('faq').orderBy('criadoEm', 'desc').onSnapshot((snapshot) => {
            const tabela = document.getElementById('tabela-faq-corpo');
            if (!tabela) return;
            tabela.innerHTML = '';

            snapshot.forEach((doc) => {
                const dados = doc.data();
                const linha = document.createElement('tr');

                linha.innerHTML = `
                    <td><strong>${dados.tipo ? dados.tipo.toUpperCase() : ''}</strong></td>
                    <td>${dados.nome || ''}</td>
                    <td>${dados.email || ''}</td>
                    <td>${dados.mensagem || ''}</td>
                `;
                tabela.appendChild(linha);
            });
        });
    }

    // 9. LÓGICA DO CHATBOT INTERATIVO
    const toggleChatBtn = document.getElementById('chatbot-toggle-btn');
    const closeChatBtn = document.getElementById('chatbot-close-btn');
    const chatBox = document.getElementById('chatbot-box');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatOptions = document.getElementById('chatbot-options');

    if (toggleChatBtn && chatBox) {
        toggleChatBtn.addEventListener('click', () => {
            chatBox.style.display = (chatBox.style.display === 'flex') ? 'none' : 'flex';
            if (chatMessages && chatMessages.children.length === 0) {
                iniciarChat();
            }
        });
    }

    if (closeChatBtn && chatBox) {
        closeChatBtn.addEventListener('click', () => {
            chatBox.style.display = 'none';
        });
    }

    function adicionarMensagem(texto, tipo) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add(tipo === 'bot' ? 'msg-bot' : 'msg-user');
        msgDiv.innerText = texto;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function mostrarOpcoes(opcoes) {
        if (!chatOptions) return;
        chatOptions.innerHTML = '';
        opcoes.forEach(opt => {
            const btn = document.createElement('button');
            btn.classList.add('chat-opt-btn');
            btn.innerText = opt.texto;
            btn.onclick = () => {
                adicionarMensagem(opt.texto, 'user');
                opt.acao();
            };
            chatOptions.appendChild(btn);
        });
    }

    function iniciarChat() {
        adicionarMensagem("Olá! Seja bem-vindo(a) ao Memorial & Amparo Services. Como podemos te ajudar neste momento?", 'bot');
        menuPrincipal();
    }

    function menuPrincipal() {
        mostrarOpcoes([
            { texto: "📦 Ver Produtos e Serviços", acao: () => ramoProdutos() },
            { texto: "🚚 Consultar Frete / CEP", acao: () => ramoFrete() },
            { texto: "💳 Formas de Pagamento", acao: () => ramoPagamento() },
            { texto: "📑 Planos Assistenciais", acao: () => ramoPlanos() },
            { texto: "👤 Falar com Atendente", acao: () => ramoAtendente() }
        ]);
    }

    function ramoProdutos() {
        setTimeout(() => {
            adicionarMensagem("Rolando a página até nossa vitrine de produtos...", 'bot');
            const grid = document.querySelector('.product-grid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            
            mostrarOpcoes([
                { texto: "🔙 Voltar ao Menu", acao: () => menuPrincipal() }
            ]);
        }, 400);
    }

    function ramoFrete() {
        setTimeout(() => {
            adicionarMensagem("O frete é gratuito para a nossa região de atendimento! Redirecionando para a calculadora de CEP...", 'bot');
            const cartSec = document.getElementById('cart-section');
            const inputCep = document.getElementById('cep');
            if (cartSec) cartSec.scrollIntoView({ behavior: 'smooth' });
            if (inputCep) inputCep.focus();

            mostrarOpcoes([
                { texto: "🔙 Voltar ao Menu", acao: () => menuPrincipal() }
            ]);
        }, 400);
    }

    function ramoPagamento() {
        setTimeout(() => {
            adicionarMensagem("Aceitamos Pix (com 5% de desconto e aprovação imediata), Cartão de Crédito (em até 12x) e Cartão de Débito!", 'bot');
            mostrarOpcoes([
                { texto: "🔙 Voltar ao Menu", acao: () => menuPrincipal() }
            ]);
        }, 400);
    }

    function ramoPlanos() {
        setTimeout(() => {
            adicionarMensagem("Nosso Plano Assistencial Familiar custa R$ 89,90/mês e garante amparo completo para toda a família.", 'bot');
            mostrarOpcoes([
                { 
                    texto: "💳 Adicionar Plano ao Carrinho", 
                    acao: () => {
                        adicionarAoCarrinho('Plano Assistencial', 89.90);
                        adicionarMensagem("Plano adicionado ao seu carrinho com sucesso!", 'bot');
                        menuPrincipal();
                    }
                },
                { texto: "🔙 Voltar ao Menu", acao: () => menuPrincipal() }
            ]);
        }, 400);
    }

    function ramoAtendente() {
        setTimeout(() => {
            adicionarMensagem("Abrindo formulário de atendimento para que nosso plantonista entre em contato...", 'bot');
            if (typeof window.abrirModalFeedback === 'function') {
                window.abrirModalFeedback('sugestao');
            }
            mostrarOpcoes([
                { texto: "🔙 Voltar ao Menu", acao: () => menuPrincipal() }
            ]);
        }, 400);
    }

});