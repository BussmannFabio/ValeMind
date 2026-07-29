/* ==========================================================================
   VALEMIND SOFTWARE SOLUTIONS - INTERACTIVE JAVASCRIPT
   Unified Estimator & Contact Form with Professional, Human & Clear Messages
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initProjectEstimator();
    initScrollAnimations();
});

/* ==========================================================================
   HEADER & STICKY NAVBAR
   ========================================================================== */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

/* ==========================================================================
   UNIFIED PROJECT ESTIMATOR & CONTACT FORM (HUMAN & PROFESSIONAL FLOW)
   ========================================================================== */
function initProjectEstimator() {
    const estimatorForm = document.getElementById('estimator-form');
    const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
    const featureCheckboxes = document.querySelectorAll('#feature-options input[type="checkbox"]');
    const timeDisplay = document.getElementById('estimated-time');
    const sendEstimateBtn = document.getElementById('send-estimate-btn');
    const estimatorStatus = document.getElementById('estimator-status');

    // Contact Inputs
    const estName = document.getElementById('est-name');
    const estPhone = document.getElementById('est-phone');
    const estEmail = document.getElementById('est-email');
    const estCompany = document.getElementById('est-company');
    const estMessage = document.getElementById('est-message');

    if (!timeDisplay || !estimatorForm) return;

    // Realistic Conservative Time Matrix (Weeks)
    const projectTypes = {
        webapp: { timeWeeks: [4, 8], label: 'Web App / Sistema Interno' },
        chatbot: { timeWeeks: [3, 6], label: 'Chatbot de IA / WhatsApp' },
        automation: { timeWeeks: [2, 5], label: 'Automação de Processos' },
        landing: { timeWeeks: [2, 4], label: 'Site Institucional / Landing Page' }
    };

    const featureAddons = {
        whatsapp_api: { timeAdd: 1.5, label: 'Integração WhatsApp API / Webhooks' },
        auth_users: { timeAdd: 1.0, label: 'Autenticação & Controle de Acesso' },
        ai_llm: { timeAdd: 2.0, label: 'Inteligência Artificial (ChatGPT API)' },
        database_prisma: { timeAdd: 1.5, label: 'Banco de Dados (PostgreSQL + Prisma)' },
        admin_panel: { timeAdd: 2.0, label: 'Painel Administrativo para Equipe' },
        email_notifications: { timeAdd: 1.0, label: 'Notificações Automáticas E-mail/SMS' }
    };

    function calculateEstimate() {
        // Selected Solution Type
        let selectedTypeKey = 'webapp';
        projectTypeInputs.forEach(input => {
            const card = input.closest('.option-card');
            if (input.checked) {
                selectedTypeKey = input.value;
                if (card) card.classList.add('active');
            } else {
                if (card) card.classList.remove('active');
            }
        });

        const typeInfo = projectTypes[selectedTypeKey] || projectTypes.webapp;
        let minWeeks = typeInfo.timeWeeks[0];
        let maxWeeks = typeInfo.timeWeeks[1];
        let selectedFeatures = [];

        // Checkbox Features
        featureCheckboxes.forEach(cb => {
            const addon = featureAddons[cb.value];
            if (cb.checked && addon) {
                minWeeks += addon.timeAdd;
                maxWeeks += addon.timeAdd;
                selectedFeatures.push(addon.label);
            }
        });

        const finalMinWeeks = Math.round(minWeeks);
        const finalMaxWeeks = Math.round(maxWeeks);
        const timeText = `${finalMinWeeks} a ${finalMaxWeeks} semanas`;

        // Update UI
        timeDisplay.textContent = timeText;

        return {
            typeLabel: typeInfo.label,
            features: selectedFeatures,
            time: timeText
        };
    }

    // Attach Event Listeners for dynamic timeline updates
    projectTypeInputs.forEach(input => input.addEventListener('change', calculateEstimate));
    featureCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));

    // Handle Form Submission with Validation
    estimatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = estName ? estName.value.trim() : '';
        const phoneVal = estPhone ? estPhone.value.trim() : '';
        const emailVal = estEmail ? estEmail.value.trim() : '';
        const companyVal = estCompany ? estCompany.value.trim() : 'Não informada';
        const msgVal = estMessage ? estMessage.value.trim() : 'Sem observações adicionais';

        // Validate mandatory contact fields
        if (!nameVal || !phoneVal || !emailVal) {
            if (estimatorStatus) {
                estimatorStatus.className = 'estimator-status error';
                estimatorStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Por favor, preencha seu Nome Completo, WhatsApp e E-mail para enviarmos a análise.';
            }
            return;
        }

        const estimate = calculateEstimate();

        if (sendEstimateBtn) {
            sendEstimateBtn.disabled = true;
            sendEstimateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando simulação...';
        }

        setTimeout(() => {
            if (sendEstimateBtn) {
                sendEstimateBtn.disabled = false;
                sendEstimateBtn.innerHTML = '<i class="fa-solid fa-check"></i> Simulação Enviada!';
            }

            if (estimatorStatus) {
                estimatorStatus.className = 'estimator-status success';
                estimatorStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Obrigado, ${nameVal}!</strong> Recebemos sua proposta de projeto (${estimate.typeLabel} - estimado em ${estimate.time}). Nossa equipe técnica analisará as necessidades e responderá pelo WhatsApp (${phoneVal}) ou E-mail (${emailVal}) o quanto antes!`;
            }

            estimatorForm.reset();
            calculateEstimate();

            setTimeout(() => {
                if (sendEstimateBtn) {
                    sendEstimateBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Simulação para Análise';
                }
            }, 6000);
        }, 1200);
    });

    // Initial Run
    calculateEstimate();
}

/* ==========================================================================
   SCROLL ANIMATIONS & INTERSECTION OBSERVER
   ========================================================================== */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.glass-card, .section-header, .diff-item, .tech-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}
