/* ===========================
   SCRIPT.JS - LuxArs Landing Page
   Funcionalidad interactiva, optimización y UX
   =========================== */

// ===========================
// VARIABLES GLOBALES
// ===========================
const hamburguer = document.getElementById('hamburger');
const navbarNav = document.querySelector('.navbar-nav');
let currentFilter = 'todos';

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initializeEvents();
    setupLazyLoading();
    setupIntersectionObserver();
    logPerformanceMetrics();
});

// ===========================
// MENÚ HAMBURGUESA
// ===========================
function initializeEvents() {
    if (hamburguer) {
        hamburguer.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    navbarNav.classList.toggle('active');
    hamburguer.classList.toggle('active');
}

function closeMobileMenu() {
    navbarNav.classList.remove('active');
    hamburguer.classList.remove('active');
}

// ===========================
// LAZY LOADING DE IMÁGENES
// ===========================
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// INTERSECTION OBSERVER PARA ANIMACIONES
// ===========================
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos con clases específicas
    document.querySelectorAll('.problema-card, .paso, .beneficio-card, .testimonio-card, .galeria-card').forEach(el => {
        observer.observe(el);
    });
}

// ===========================
// LLAMADOS A LA ACCIÓN (CTA)
// ===========================
function handleCTAClick(userType) {
    const loginUrl = userType === 'cliente' ? '/login?type=client' : '/login?type=photographer';
    
    // Evento analytics (si está disponible)
    if (window.gtag) {
        gtag('event', 'cta_click', {
            'user_type': userType,
            'location': 'landing_page'
        });
    }

    console.log(`CTA Click: ${userType}`);
    
    // Simular navegación (reemplazar con URL real)
    // window.location.href = loginUrl;
    
    // Para demostración, mostrar alerta
    showNotification(`Redirigiendo a ${userType === 'cliente' ? 'búsqueda de fotógrafos' : 'registro de fotógrafos'}...`);
}

// ===========================
// FILTRADO DE GALERÍA
// ===========================
function filterGallery(category) {
    currentFilter = category;
    const cards = document.querySelectorAll('.galeria-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Actualizar botones activos
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category.toLowerCase()) || (category === 'todos' && btn.textContent === 'Todos')) {
            btn.classList.add('active');
        }
    });

    // Filtrar y animar tarjetas
    cards.forEach(card => {
        const cardCategory = card.dataset.categoria;
        if (category === 'todos' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.classList.add('animate-in');
            }, 10);
        } else {
            card.style.display = 'none';
            card.classList.remove('animate-in');
        }
    });
}

// ===========================
// NEWSLETTER / SUSCRIPCIÓN
// ===========================
function handleNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Validar email
    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }

    // Simular envío (reemplazar con API real)
    const formData = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'landing_page'
    };

    console.log('Newsletter subscription:', formData);
    
    // Aquí iría el fetch a tu API
    // fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showNotification('¡Gracias por suscribirte!', 'success');
    //     event.target.reset();
    // })
    // .catch(error => {
    //     showNotification('Error al suscribirse. Intenta de nuevo.', 'error');
    // });

    showNotification('¡Gracias por suscribirte! Pronto recibirás noticias.', 'success');
    event.target.reset();
}

// ===========================
// SCROLL A SECCIONES
// ===========================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Si la sección no existe, ir a un placeholder
        console.warn(`Sección ${sectionId} no encontrada`);
        showNotification('Sección en desarrollo', 'info');
    }
}

// ===========================
// NOTIFICACIONES / TOASTS
// ===========================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===========================
// VALIDACIÓN DE EMAIL
// ===========================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===========================
// MÉTRICAS DE RENDIMIENTO
// ===========================
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log('Performance Metrics:');
                console.log(`Total Page Load Time: ${pageLoadTime}ms`);
                console.log(`Connect Time: ${connectTime}ms`);
                console.log(`Render Time: ${renderTime}ms`);

                // Enviar métricas a analytics si está disponible
                if (window.gtag) {
                    gtag('event', 'page_load_time', {
                        'value': pageLoadTime,
                        'event_category': 'performance'
                    });
                }
            }, 0);
        });
    }
}

// ===========================
// SMOOTH SCROLL BEHAVIOR
// ===========================
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ===========================
// MANEJO DE ERRORES GLOBAL
// ===========================
window.addEventListener('error', function(event) {
    console.error('Error capturado:', event.error);
    // Enviar error a servicio de logging en producción
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejection:', event.reason);
    // Enviar error a servicio de logging en producción
});

// ===========================
// ESTILO DINÁMICO PARA NOTIFICACIONES
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Modo oscuro por defecto */
    @media (prefers-color-scheme: dark) {
        body {
            color-scheme: dark;
        }
    }

    /* Soporte para gestos táctiles */
    @media (hover: none) {
        .btn:hover {
            transform: none;
        }
        
        .btn:active {
            transform: translateY(-2px);
        }
    }
`;
document.head.appendChild(style);

// ===========================
// PRELOAD DE RECURSOS CRÍTICOS
// ===========================
function preloadCriticalResources() {
    // Preload de fuentes si es necesario
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    // Aquí irían las fuentes críticas
}

// ===========================
// SERVICE WORKER REGISTRATION (OPCIONAL)
// ===========================
if ('serviceWorker' in navigator) {
    // Descomentar si tienes un service worker
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js').catch(err => {
    //         console.log('SW registration failed: ', err);
    //     });
    // });
}

// ===========================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ===========================
window.LuxArs = {
    filterGallery,
    handleCTAClick,
    handleNewsletter,
    scrollToSection,
    showNotification
};

console.log('LuxArs Landing Page Script Loaded Successfully');
