/* ===========================
   AUTH.JS - Funcionalidad de Autenticación
   =========================== */

// ===========================
// VARIABLES GLOBALES
// ===========================
let selectedRole = null;

// ===========================
// LOGIN
// ===========================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validación
    if (!email || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    // Simular verificación
    if (!isValidEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Log del usuario (en producción sería una API call)
    console.log('Login intento:', {
        email,
        password: '••••••••',
        remember
    });

    // Simular login exitoso
    showNotification('¡Login exitoso! Redirigiendo...', 'success');
    
    // Guardar sesión simulada
    localStorage.setItem('luxars_user', JSON.stringify({
        email,
        loginTime: new Date().toISOString(),
        remember
    }));

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
        // En producción, redirigir a dashboard
        window.location.href = 'index.html';
    }, 1500);
}

// ===========================
// REGISTRO
// ===========================

function selectRole(role) {
    selectedRole = role;
    
    // Ocultar selección de rol
    document.getElementById('role-selection').classList.add('hidden');
    
    // Mostrar formulario correspondiente
    if (role === 'cliente') {
        document.getElementById('client-form').classList.remove('hidden');
    } else if (role === 'fotografo') {
        document.getElementById('photographer-form').classList.remove('hidden');
    }
}

function backToRole(event) {
    event.preventDefault();
    
    // Mostrar selección de rol
    document.getElementById('role-selection').classList.remove('hidden');
    
    // Ocultar formularios
    document.getElementById('client-form').classList.add('hidden');
    document.getElementById('photographer-form').classList.add('hidden');
    
    selectedRole = null;
}

function handleClientRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validaciones
    if (!firstName || !lastName || !email || !password) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    // Log (en producción sería una API call)
    console.log('Registro de cliente:', {
        firstName,
        lastName,
        email,
        phone,
        type: 'cliente'
    });

    showNotification('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
    
    // Guardar datos
    localStorage.setItem('luxars_user', JSON.stringify({
        type: 'cliente',
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
    }));

    // Redirigir
    setTimeout(() => {
        window.location.href = 'search-photographer.html';
    }, 1500);
}

function handlePhotographerRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validaciones
    if (!firstName || !lastName || !email || !phone || !password) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    console.log('Registro de fotógrafo:', {
        firstName,
        lastName,
        email,
        phone,
        type: 'fotografo'
    });

    showNotification('¡Cuenta de fotógrafo creada! Redirigiendo...', 'success');
    
    localStorage.setItem('luxars_user', JSON.stringify({
        type: 'fotografo',
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
    }));

    setTimeout(() => {
        // Redirigir a panel del fotógrafo (por ahora a inicio)
        window.location.href = 'index.html';
    }, 1500);
}

// ===========================
// UNIRME COMO FOTÓGRAFO
// ===========================

function handlePhotographerJoin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const specialty = formData.get('specialty');
    const experience = formData.get('experience');
    const bio = formData.get('bio');
    const location = formData.get('location');
    const rate = formData.get('rate');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validaciones
    if (!firstName || !lastName || !email || !phone || !password || !specialty || !location || !rate) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    if (parseInt(rate) <= 0) {
        showNotification('La tarifa debe ser mayor a 0', 'error');
        return;
    }

    console.log('Registro fotógrafo profesional:', {
        firstName,
        lastName,
        email,
        phone,
        specialty,
        experience,
        bio,
        location,
        rate,
        type: 'fotografo-profesional'
    });

    showNotification('¡Bienvenido a LuxArs! Tu perfil ha sido creado. Redirigiendo...', 'success');
    
    localStorage.setItem('luxars_user', JSON.stringify({
        type: 'fotografo-profesional',
        firstName,
        lastName,
        email,
        specialty,
        experience,
        location,
        rate,
        createdAt: new Date().toISOString()
    }));

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===========================
// SOCIAL LOGIN (Simulated)
// ===========================

function loginWithGoogle() {
    showNotification('Google Login - En desarrollo', 'info');
    console.log('Google OAuth initiate');
}

function loginWithFacebook() {
    showNotification('Facebook Login - En desarrollo', 'info');
    console.log('Facebook OAuth initiate');
}

// ===========================
// UTILITARIOS
// ===========================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===========================
// INICIALIZAR
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ya está autenticado
    const user = localStorage.getItem('luxars_user');
    
    // Si está en página de login y ya está autenticado, redirigir
    if (user && window.location.pathname.includes('login.html')) {
        const userData = JSON.parse(user);
        console.log('Usuario ya autenticado:', userData.email);
    }
});

console.log('Auth.js loaded successfully');
