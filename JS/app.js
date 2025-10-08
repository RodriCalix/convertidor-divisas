// =================================================================
// 1. TASAS DE CAMBIO Y LISTA DE DIVISAS (SIMULACIÓN OCT-2025)
// =================================================================

// Tasas de cambio fijas y simuladas (actualizada 5/10/25), donde USD es la base (1.00)
const exchangeRates = { 
    // Moneda base
    'USD': 1.0000,
    
    // Tasas para América
    'MXN': 18.3986,   // Peso Mexicano
    'SVC': 8.7500,    // Colón Salvadoreño (Tasa fija aproximada)
    'COP': 3883.69,   // Peso Colombiano
    'ARS': 1424.14,   // Peso Argentino
    'CAD': 1.3967,    // Dólar Canadiense
    'BRL': 5.3500,    // Real Brasileño
    'CLP': 961.54,    // Peso Chileno
    
    // Tasas para Europa
    'EUR': 0.8517,    // Euro
    'GBP': 0.7420,    // Libra Esterlina
    'CHF': 0.7956,    // Franco Suizo
    
    // Tasas para Asia/Oceanía
    'JPY': 147.44,    // Yen Japonés
    'AUD': 1.5148,    // Dólar Australiano
    'CNY': 7.1000,    // Yuan Chino
    'INR': 88.9000    // Rupia India
};

// Lista de divisas para rellenar los select (Dropdowns)
const currencies = [
    { code: 'USD', name: 'Dólar Estadounidense' }, 
    { code: 'EUR', name: 'Euro' },
    { code: 'MXN', name: 'Peso Mexicano' }, 
    { code: 'SVC', name: 'Colón Salvadoreño' },
    { code: 'COP', name: 'Peso Colombiano' }, 
    { code: 'ARS', name: 'Peso Argentino' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Yen Japonés' },
    { code: 'CAD', name: 'Dólar Canadiense' }, 
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'CHF', name: 'Franco Suizo' }, 
    { code: 'CNY', name: 'Yuan Chino' },
    { code: 'INR', name: 'Rupia India' }, 
    { code: 'BRL', name: 'Real Brasileño' },
    { code: 'CLP', name: 'Peso Chileno' }
];


// Los datos se quedan hasta que se cierra la pestaña del navegador.
let conversionHistory = JSON.parse(sessionStorage.getItem('conversionHistory')) || [];
// =================================================================
// 2. FUNCIONES COMPARTIDAS (populate, getConfig)
// =================================================================

function getDefaultConfig() {
    const defaultFrom = localStorage.getItem('defaultFrom');
    const defaultTo = localStorage.getItem('defaultTo');
    return {
        from: defaultFrom || 'USD',
        to: defaultTo || 'EUR'
    };
}

function populateCurrencies(fromId, toId) {
    const fromSelect = document.getElementById(fromId);
    const toSelect = document.getElementById(toId);
    
    if (!fromSelect || !toSelect) return;

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;

        fromSelect.appendChild(option.cloneNode(true));
        toSelect.appendChild(option.cloneNode(true));
    });

    const config = getDefaultConfig();
    fromSelect.value = config.from;
    toSelect.value = config.to;
}

// =================================================================
// 3. LÓGICA DEL CONVERSOR Y HISTORIAL
// =================================================================

function updateHistoryTable() {
    const historyTableBody = document.querySelector('.table tbody');
    if (!historyTableBody) return;

    historyTableBody.innerHTML = ''; 

    if (conversionHistory.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay conversiones en el historial aún.</td></tr>`;
        return;
    }

    conversionHistory.forEach(entry => {
        const row = historyTableBody.insertRow();
        row.insertCell().textContent = entry.amountFrom;
        row.insertCell().textContent = entry.currencyFrom;
        row.insertCell().textContent = entry.amountTo;
        row.insertCell().textContent = entry.currencyTo;
        row.insertCell().textContent = entry.dateTime;
    });
}

function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const currencyFromSelect = document.getElementById('currency-from');
    const currencyToSelect = document.getElementById('currency-to');
    const resultDiv = document.getElementById('result');

    if (!amountInput || !currencyFromSelect || !currencyToSelect || !resultDiv) return;

    const amount = parseFloat(amountInput.value);
    const fromCurrency = currencyFromSelect.value;
    const toCurrency = currencyToSelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = '<span class="text-danger">Por favor, introduce una cantidad válida y positiva.</span>';
        return;
    }

    if (fromCurrency === toCurrency) {
        resultDiv.innerHTML = `<span class="text-info">${amount.toFixed(2)} ${fromCurrency} es igual a ${amount.toFixed(2)} ${toCurrency}.</span>`;
        return;
    }

    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];

    if (!rateFrom || !rateTo) {
        resultDiv.innerHTML = '<span class="text-danger">Error: Una o ambas divisas no son compatibles.</span>';
        return;
    }

    const amountInUSD = amount / rateFrom;
    const convertedAmount = amountInUSD * rateTo;
    const toCurrencyName = currencies.find(c => c.code === toCurrency)?.name || toCurrency;

    resultDiv.innerHTML = `
        <strong class="text-success">${amount.toFixed(2)} ${fromCurrency}</strong> es igual a 
        <strong class="text-primary">${convertedAmount.toFixed(4)} ${toCurrency} (${toCurrencyName})</strong> 
        (Tasa simulada Oct-2025).
    `;
    
    // REGISTRO Y ACTUALIZACIÓN DEL HISTORIAL
    const now = new Date();
    const historyEntry = {
        amountFrom: amount.toFixed(2),
        currencyFrom: fromCurrency,
        amountTo: convertedAmount.toFixed(4),
        currencyTo: toCurrency,
        dateTime: now.toLocaleDateString('es-ES') + ' ' + now.toLocaleTimeString('es-ES')
    };
    conversionHistory.unshift(historyEntry); 
    
    //  Guarda el historial actualizado en sessionStorage
    sessionStorage.setItem('conversionHistory', JSON.stringify(conversionHistory)); 
    
    updateHistoryTable(); 
}

/**
 * Limpia el historial al hacer clic en el botón.
 */
function clearConversionHistory() {
    conversionHistory = []; // Borra el array en memoria
    sessionStorage.removeItem('conversionHistory'); // Borra el almacenamiento del navegador
    updateHistoryTable(); // Actualiza la tabla para mostrar que está vacía
}


// =================================================================
// 4. INICIALIZACIÓN DE LA PÁGINA CONVERSOR
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convert');
    const amountInput = document.getElementById('amount');
    const clearHistoryButton = document.getElementById('clear-history'); 

    // Lógica que SOLO se ejecuta si estamos en la página del Conversor
    if (convertButton) {
        populateCurrencies('currency-from', 'currency-to');

        convertButton.addEventListener('click', convertCurrency);
        if (amountInput) {
            amountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    convertCurrency();
                }
            });
        }
        
        // :Asigna el evento al botón de borrar
        if (clearHistoryButton) {
            clearHistoryButton.addEventListener('click', clearConversionHistory);
        }

        // Renderiza el historial cargado al inicio (si lo hay)
        updateHistoryTable(); 
    }
});