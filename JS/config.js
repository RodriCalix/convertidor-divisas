// =================================================================
// 1. LÓGICA DE GUARDADO DE CONFIGURACIÓN
// =================================================================

function saveDefaultCurrencies() {
    const defaultFromSelect = document.getElementById('default-from');
    const defaultToSelect = document.getElementById('default-to');
    const configMessageDiv = document.getElementById('config-message');

    if (!defaultFromSelect || !defaultToSelect || !configMessageDiv) return;

    const defaultFrom = defaultFromSelect.value;
    const defaultTo = defaultToSelect.value;

    if (defaultFrom === defaultTo) {
        configMessageDiv.innerHTML = '<div class="alert alert-warning">¡Advertencia! Las monedas de origen y destino por defecto no deben ser iguales.</div>';
        return;
    }

    try {
        localStorage.setItem('defaultFrom', defaultFrom);
        localStorage.setItem('defaultTo', defaultTo);
        configMessageDiv.innerHTML = '<div class="alert alert-success">Configuración guardada exitosamente.</div>';
    } catch (e) {
        configMessageDiv.innerHTML = '<div class="alert alert-danger">Error al guardar la configuración.</div>';
        console.error("Error guardando en localStorage:", e);
    }
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        configMessageDiv.innerHTML = '';
    }, 3000);
}


// =================================================================
// 2. INICIALIZACIÓN DE LA PÁGINA CONFIGURACIÓN
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-defaults');
    
    // Solo ejecuta si estamos en la página de Configuración
    if (saveButton) {
        // 1. Rellena los selectores de la configuración
        // Llama a la función global de app.js
        if (typeof populateCurrencies === 'function') {
            populateCurrencies('default-from', 'default-to'); 
        }

        // 2. Asigna el evento de guardado
        saveButton.addEventListener('click', saveDefaultCurrencies);
    }
});