documentação do site funerária 
📚 Documentação Técnica do Projeto
Projeto: E-commerce Funerário – Memorial & Amparo Services

Desenvolvedora: Jeniffer Franco

Tecnologias: HTML5, CSS3, JavaScript Vanilla (ES6+), Firebase (Firestore & Authentication), ViaCEP API, VLibras API.

📄 1. Visão Geral do Sistema
O Memorial & Amparo Services é uma aplicação web full stack frontend/serverless desenvolvida para o segmento funerário. O sistema permite a navegação por serviços e produtos, adição ao carrinho com cálculo automatizado de frete, múltiplos meios de pagamento visualizados, acessibilidade completa em Libras, chatbot interativo com suporte guiado e uma central de feedback que armazena dados em tempo real no banco de dados, protegida por um painel administrativo oculto por atalho de teclado.

🛠️ 2. Arquitetura e Tecnologias Utilizadas
Frontend & Interface
HTML5: Estrutura semântica composta por cabeçalho, vitrine de produtos, carrinho de compras, modais, widget de chat, tabela administrativa e rodapé.

CSS3 (Moderno): Layout responsivo utilizando Grid Layout (para os cards de produtos 3x1) e Flexbox (para alinhamentos e cabeçalho). Suporte a variáveis CSS (:root), efeitos de hover, animações suaves (transition) e manipulação de janelas flutuantes.

JavaScript Vanilla (ES6+): Programação assíncrona (async/await, fetch), manipulação dinâmica do DOM, controle de rotas internas no chatbot e escutadores de eventos (DOMContentLoaded, keydown, submit).

APIs & Serviços de Terceiros
Firebase Firestore: Banco de dados NoSQL utilizado para gravar e ler mensagens de feedback da coleção faq.

Firebase Authentication: Módulo de autenticação seguro por E-mail e Senha para controle de acesso do Administrador.

ViaCEP API: Consumo RESTful via fetch ([https://viacep.com.br/ws/](https://viacep.com.br/ws/){cep}/json/) para pré-preenchimento de endereço e validação de frete gratuito.

VLibras API: Suite do Governo Federal para tradução automática do conteúdo textual do site em Língua Brasileira de Sinais (Libras).

⚙️ 3. Módulos e Funcionalidades do Código
🛒 A. Vitrine de Produtos & Carrinho de Compras
Vitrine em Cards: Organizados um ao lado do outro em grid tridimensional (repeat(3, 1fr)). Cada card contém imagem descritiva, título, preço e botão de ação.

Carrinho no Topo: Botão fixo no canto superior direito do cabeçalho que acumula e exibe o valor total do pedido em tempo real. Ao ser clicado, realiza uma rolagem suave (smooth scroll) até a seção de detalhes.

Opções de Pagamento: Exibição visual de selos e seletor de checkout para Pix (com desconto automático anunciado), Cartão de Crédito (parcelamento) e Cartão de Débito.

🚚 B. Integração ViaCEP e Frete
Validação de CEP contendo exatamente 8 dígitos numéricos.

Consulta assíncrona com tratamento de erros (CEP inexistente ou falha de conexão).

Retorno automatizado do Logradouro, Bairro, Cidade e Estado, confirmando o Frete Gratuito para a região.

💬 C. Chatbot Interativo com Roteiro
Interface Flutuante: Botão de bolha no canto inferior direito que expande uma janela de atendimento.

Roteiro de Navegação (Árvore de Decisão):

📦 Ver Produtos: Rola a página até a vitrine de produtos.

🚚 Consultar Frete: Direciona o foco para o campo do CEP.

💳 Formas de Pagamento: Informa detalhes sobre Pix e cartões.

📑 Planos Assistenciais: Permite adicionar o plano familiar diretamente ao carrinho.

👤 Falar com Atendente: Abre o modal de atendimento/feedback.

💡 D. Sistema de Feedback e Coleção faq (Firebase)
Menu Dropdown superior com três categorias: Sugestão, Reclamação e Elogio.

A seleção abre um Modal Pop-up intuitivo para captura de Nome, E-mail e Mensagem.

Estrutura de dados salva no Firestore (Coleção faq):

JSON
{
  "tipo": "sugestao | reclamacao | elogio",
  "nome": "Nome do Cliente",
  "email": "cliente@email.com",
  "mensagem": "Conteúdo da mensagem",
  "criadoEm": "serverTimestamp()"
}
🔑 E. Painel do Administrador Oculto
Segurança por Ocultação: A seção <section class="admin-section admin-hidden"> fica invisível por padrão para usuários comuns.

Atalho Secreto: Tecla de atalho Ctrl + Shift + A para revelar ou ocultar a área administrativa.

Dashboard em Tempo Real: Autenticação via firebase.auth() que libera uma tabela conectada ao listener .onSnapshot() do Firestore, listando todos os chamados da coleção faq em ordem cronológica.

♿ F. Acessibilidade & Redes Sociais
VLibras Widget: Widget oficial inserido no documento para tradução de acessibilidade.

Redes Sociais: Ícones em vetor SVG para Instagram, TikTok e Facebook.

Rodapé Personalizado: Registro de direitos e autoria "Desenvolvido por Jeniffer Franco".

🔄 4. Histórico do Processo de Desenvolvimento
Estruturação Inicial (Arquitetura Monolítica):

Criação do layout inicial funerário contendo formulários, integração das bibliotecas SDK do Firebase (v9/v10 compat), consulta ViaCEP e widget do VLibras em um único documento.

Refatoração e Separação de Camadas:

Separação estrita dos arquivos em três pilares: index.html (marcação), style.css (estilização) e script.js (lógica e regras de negócio).

Aprimoramento do Layout (CSS Grid & Header):

Ajuste do container de produtos para dispor os cards lado a lado.

Criação do componente do carrinho no canto superior direito do cabeçalho com atualização de saldo em tempo real.

Inclusão das marcas/ícones de pagamento (Pix, Cartão de Crédito e Débito).

Transformação da Interface de Feedback:

Substituição do formulário estático por um Menu Dropdown no topo com as três opções (Sugestão, Reclamação, Elogio), acionando uma janela Modal Pop-up.

Desenvolvimento do Chatbot Flutuante:

Criação do widget de bate-papo no canto inferior direito.

Implementação do motor de decisões do bot com opções dinâmicas que executam ações diretas na página (rolagem, foco em inputs e adição ao carrinho).

Implementação de Segurança e Atalho Admin:

Ocultação da seção do painel administrativo do fluxo de navegação público.

Implementação do ouvinte de eventos de teclado para a combinação Ctrl + Shift + A.

Conexão Real com o Firebase:

Vinculação das chaves de API do projeto projetositefuneraria.

Envolvimento de toda a lógica do script.js no evento DOMContentLoaded para evitar falhas de execução e botões inativos.
