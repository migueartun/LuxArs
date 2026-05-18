/* ===========================
   SEARCH.JS - Funcionalidad de Búsqueda
   =========================== */

// ===========================
// VARIABLES
// ===========================

let currentPage = 1;
let activeFilters = {
    specialties: [],
    budgets: [],
    ratings: 0,
    availability: []
};

// ===========================
// BÚSQUEDA
// ===========================

function handleSearch(event) {
    event.preventDefault();
    
    const searchQuery = document.getElementById('search-query').value;
    
    if (!searchQuery.trim()) {
        showNotification('Por favor ingresa un término de búsqueda', 'error');
        return;
    }

    console.log('Búsqueda:', searchQuery);
    showNotification(`Buscando: ${searchQuery}`, 'info');
    
    // Aquí iría la llamada a la API
    // En producción: fetch(`/api/photographers/search?q=${searchQuery}`)
    
    // Simular resultados después de 500ms
    setTimeout(() => {
        updateResults();
        window.scrollTo({ top: 600, behavior: 'smooth' });
    }, 500);
}

// ===========================
// FILTROS
// ===========================

function applyFilters() {
    console.log('Aplicando filtros...', activeFilters);
    
    // Recopilar especialidades seleccionadas
    const specialtyCheckboxes = document.querySelectorAll('.filter-group:nth-child(1) .filter-checkbox input');
    activeFilters.specialties = Array.from(specialtyCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Recopilar presupuestos
    const budgetCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) .filter-checkbox input');
    activeFilters.budgets = Array.from(budgetCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Rating
    const ratingSlider = document.getElementById('rating-slider');
    activeFilters.ratings = parseFloat(ratingSlider.value);
    updateRatingValue(activeFilters.ratings);
    
    // Disponibilidad
    const availabilityCheckboxes = document.querySelectorAll('.filter-group:nth-child(4) .filter-checkbox input');
    activeFilters.availability = Array.from(availabilityCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    console.log('Filtros aplicados:', activeFilters);
    updateResults();
}

function updateRatingValue(value) {
    const ratingValueSpan = document.getElementById('rating-value');
    if (value === 0 || value === '0') {
        ratingValueSpan.textContent = 'Todas';
    } else {
        ratingValueSpan.textContent = `${value}+ ⭐`;
    }
}

function resetFilters() {
    // Resetear checkboxes
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
        cb.checked = false;
    });
    
    // Resetear slider
    document.getElementById('rating-slider').value = 0;
    updateRatingValue(0);
    
    // Resetear variables
    activeFilters = {
        specialties: [],
        budgets: [],
        ratings: 0,
        availability: []
    };
    
    // Limpiar búsqueda
    document.getElementById('search-query').value = '';
    
    showNotification('Filtros eliminados', 'info');
    updateResults();
}

// ===========================
// ACTUALIZAR RESULTADOS
// ===========================

function updateResults() {
    const resultsCount = document.getElementById('results-count');
    
    if (activeFilters.specialties.length > 0 || activeFilters.budgets.length > 0) {
        const filterText = [];
        if (activeFilters.specialties.length > 0) {
            filterText.push(`${activeFilters.specialties.join(', ')}`);
        }
        if (activeFilters.budgets.length > 0) {
            filterText.push(`${activeFilters.budgets.join(', ')}`);
        }
        resultsCount.textContent = `Mostrando fotógrafos con filtros: ${filterText.join(' • ')}`;
    } else {
        resultsCount.textContent = 'Mostrando fotógrafos destacados';
    }
    
    // Aquí se llamaría a la API con los filtros
    console.log('Actualizando resultados con filtros:', activeFilters);
}

// ===========================
// CONTACTAR FOTÓGRAFO
// ===========================

function contactPhotographer(photographerName) {
    // Verificar si está autenticado
    const user = localStorage.getItem('luxars_user');
    
    if (!user) {
        showNotification('Debes iniciar sesión para contactar al fotógrafo', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const userData = JSON.parse(user);
    
    if (userData.type === 'fotografo' || userData.type === 'fotografo-profesional') {
        showNotification('Los fotógrafos no pueden contactar a otros fotógrafos', 'error');
        return;
    }

    console.log('Contactando a:', photographerName);
    showNotification(`Contactando a ${photographerName}... Redirigiendo a su perfil...`, 'success');
    
    // Redirigir a perfil del fotógrafo (en producción)
    setTimeout(() => {
        // window.location.href = `/photographer/${photographerName.toLowerCase().replace(' ', '-')}`;
        alert(`Perfil de ${photographerName}\n\nEn una aplicación completa, aquí verías:\n- Portafolio completo\n- Disponibilidad\n- Reseñas\n- Sistema de reservas`);
    }, 1000);
}

// ===========================
// PAGINACIÓN
// ===========================

function nextPage() {
    currentPage++;
    console.log('Página:', currentPage);
    showNotification(`Cargando página ${currentPage}...`, 'info');
    
    // Aquí iría la paginación
    // window.scrollTo({ top: 600, behavior: 'smooth' });
}

// ===========================
// UTILIDADES
// ===========================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
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
    // Inicializar valores de rating
    updateRatingValue(0);
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('style[data-search-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-search-animations', '');
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
        `;
        document.head.appendChild(style);
    }
    
    console.log('Search.js loaded successfully');
});
