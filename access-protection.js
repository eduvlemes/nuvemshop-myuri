/**
 * Sistema de Proteção de Acesso por Senha
 * Insere dinamicamente um overlay de bloqueio na página e gerencia a autenticação
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURAÇÃO - Edite estas variáveis
    // ========================================
    const CONFIG = {
        overlayTitle: "Acesso Restrito",
        overlayText: "Esta página é protegida. Por favor, insira a senha para continuar.",
        buttonText: "Desbloquear",
        correctPassword: "senha123",
        errorMessage: "Senha incorreta. Tente novamente.",
        storageKey: "page_access_auth",
        placeholder: "Digite a senha"
    };

    // ========================================
    // ESTILOS CSS
    // ========================================
    const CSS_STYLES = `
        <style id="access-protection-styles">
            body.access-protection-no-scroll {
                overflow: hidden;
            }

            .access-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s ease-out;
                font-family: Arial, sans-serif;
            }

            .access-overlay.fade-out {
                animation: fadeOut 0.3s ease-out forwards;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            .access-modal {
                background: #fef2e2;
                border-radius: 12px;
                padding: 32px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .access-modal.shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }

            .access-modal h2 {
                font-size: 24px;
                font-weight: bold;
                color: #430243;
                margin-bottom: 16px;
                text-align: center;
                margin-top: 0;
            }

            .access-modal p {
                font-size: 14px;
                color: #000;
                margin-bottom: 24px;
                text-align: center;
                line-height: 1.6;
                margin-top: 0;
            }

            .password-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .password-input {
                width: 100%;
                padding: 12px;
                font-size: 14px;
                font-family: Arial, sans-serif;
                color: #000;
                background-color: #fff;
                border: 2px solid #ddd;
                border-radius: 8px;
                transition: all 0.15s ease;
                outline: none;
                box-sizing: border-box;
            }

            .password-input:focus {
                border-color: #fc4f00;
                box-shadow: 0 0 0 3px rgba(252, 79, 0, 0.2);
            }

            .error-message {
                font-size: 14px;
                color: #dc2626;
                text-align: center;
                margin-top: -8px;
                opacity: 0;
                max-height: 0;
                overflow: hidden;
                transition: all 0.25s ease;
            }

            .error-message.show {
                opacity: 1;
                max-height: 30px;
                margin-top: 0;
            }

            .submit-btn {
                width: 100%;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 500;
                font-family: Arial, sans-serif;
                color: #fff;
                background: #fc4f00;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.25s ease;
            }

            .submit-btn:hover {
                background: #e04500;
                transform: translateY(-1px);
            }

            .submit-btn:active {
                background: #c73e00;
                transform: translateY(0);
            }

            .submit-btn:focus {
                outline: 2px solid #fc4f00;
                box-shadow: 0 0 0 3px rgba(252, 79, 0, 0.2);
            }

            @media (max-width: 768px) {
                .access-modal {
                    padding: 24px;
                }

                .access-modal h2 {
                    font-size: 20px;
                }
            }
        </style>
    `;

    // ========================================
    // HTML TEMPLATE
    // ========================================
    const HTML_TEMPLATE = `
        <div id="accessOverlay" class="access-overlay" style="display: none;">
            <div class="access-modal" id="accessModal">
                <h2 id="overlayTitle"></h2>
                <p id="overlayText"></p>
                <form class="password-form" id="passwordForm">
                    <input 
                        type="password" 
                        class="password-input" 
                        id="passwordInput" 
                        placeholder=""
                        autocomplete="off"
                        required
                    >
                    <div class="error-message" id="errorMessage"></div>
                    <button type="submit" class="submit-btn" id="submitBtn"></button>
                </form>
            </div>
        </div>
    `;

    // ========================================
    // CLASSE PRINCIPAL
    // ========================================
    class AccessProtection {
        constructor() {
            this.authenticationData = null;
            this.overlay = null;
            this.modal = null;
            this.passwordInput = null;
            this.errorMessageElement = null;
            
            this.init();
        }

        // Inicializa o sistema
        init() {
            this.injectStyles();
            this.injectHTML();
            this.setupElements();
            this.setupEventListeners();
            this.checkAuthentication();
        }

        // Injeta os estilos CSS na página
        injectStyles() {
            if (!document.getElementById('access-protection-styles')) {
                document.head.insertAdjacentHTML('beforeend', CSS_STYLES);
            }
        }

        // Injeta o HTML na página
        injectHTML() {
            // Remove overlay existente se houver
            const existingOverlay = document.getElementById('accessOverlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // Adiciona o HTML ao final do body
            document.body.insertAdjacentHTML('beforeend', HTML_TEMPLATE);
        }

        // Configura os elementos DOM
        setupElements() {
            this.overlay = document.getElementById('accessOverlay');
            this.modal = document.getElementById('accessModal');
            this.passwordInput = document.getElementById('passwordInput');
            this.errorMessageElement = document.getElementById('errorMessage');

            // Configura os textos
            document.getElementById('overlayTitle').textContent = CONFIG.overlayTitle;
            document.getElementById('overlayText').textContent = CONFIG.overlayText;
            document.getElementById('submitBtn').textContent = CONFIG.buttonText;
            this.passwordInput.placeholder = CONFIG.placeholder;
        }

        // Configura os event listeners
        setupEventListeners() {
            const passwordForm = document.getElementById('passwordForm');
            
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordSubmit();
            });

            // Previne que o overlay seja fechado clicando fora
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        // ========================================
        // FUNÇÕES AUXILIARES
        // ========================================

        // Retorna a data atual no formato YYYY-MM-DD
        getCurrentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Verifica se o usuário já foi autenticado hoje
        isAuthenticatedToday() {
            if (!this.authenticationData) return false;
            
            const storedDate = this.authenticationData;
            const currentDate = this.getCurrentDate();
            
            return storedDate === currentDate;
        }

        // Salva a autenticação com a data atual
        saveAuthentication() {
            const currentDate = this.getCurrentDate();
            this.authenticationData = currentDate;
        }

        // Mostra o overlay de bloqueio
        showOverlay() {
            this.overlay.style.display = 'flex';
            document.body.classList.add('access-protection-no-scroll');
            
            // Pequeno delay para garantir que o elemento está visível antes do foco
            setTimeout(() => {
                this.passwordInput.focus();
            }, 100);
        }

        // Remove o overlay com animação
        hideOverlay() {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.style.display = 'none';
                document.body.classList.remove('access-protection-no-scroll');
                this.overlay.classList.remove('fade-out');
            }, 300);
        }

        // Mostra mensagem de erro
        showError() {
            this.errorMessageElement.textContent = CONFIG.errorMessage;
            this.errorMessageElement.classList.add('show');
            this.modal.classList.add('shake');
            
            setTimeout(() => {
                this.modal.classList.remove('shake');
            }, 500);
            
            setTimeout(() => {
                this.errorMessageElement.classList.remove('show');
            }, 3000);
        }

        // Valida a senha inserida
        validatePassword(password) {
            return password === CONFIG.correctPassword;
        }

        // ========================================
        // EVENT HANDLERS
        // ========================================

        // Handler do formulário de senha
        handlePasswordSubmit() {
            const enteredPassword = this.passwordInput.value;
            
            if (this.validatePassword(enteredPassword)) {
                // Senha correta
                this.saveAuthentication();
                this.passwordInput.value = '';
                this.hideOverlay();
            } else {
                // Senha incorreta
                this.showError();
                this.passwordInput.value = '';
                this.passwordInput.focus();
            }
        }

        // Verifica autenticação e mostra overlay se necessário
        checkAuthentication() {
            if (!this.isAuthenticatedToday()) {
                this.showOverlay();
            }
        }

        // ========================================
        // API PÚBLICA
        // ========================================

        // Força a exibição do overlay (útil para testes ou reset)
        forceShowOverlay() {
            this.showOverlay();
        }

        // Remove a autenticação (força nova autenticação)
        clearAuthentication() {
            this.authenticationData = null;
            this.checkAuthentication();
        }

        // Atualiza a configuração
        updateConfig(newConfig) {
            Object.assign(CONFIG, newConfig);
            this.setupElements(); // Atualiza os textos
        }

        // Remove completamente o sistema de proteção
        destroy() {
            // Remove overlay
            if (this.overlay) {
                this.overlay.remove();
            }
            
            // Remove estilos
            const styles = document.getElementById('access-protection-styles');
            if (styles) {
                styles.remove();
            }
            
            // Remove classe do body
            document.body.classList.remove('access-protection-no-scroll');
        }
    }

    // ========================================
    // INICIALIZAÇÃO AUTOMÁTICA
    // ========================================

    // Aguarda o DOM estar pronto
    function initAccessProtection() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.AccessProtection = new AccessProtection();
            });
        } else {
            window.AccessProtection = new AccessProtection();
        }
    }

    // Inicializa automaticamente
    initAccessProtection();

    // Exposição global para customização
    window.AccessProtectionConfig = CONFIG;

})();