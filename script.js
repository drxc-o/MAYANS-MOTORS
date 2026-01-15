const MAX_BIKES = 20;

const bikes = {
    "DINKA": [
        { model: "Akuma", price: 125000 },
        { model: "Double-T", price: 145000 },
        { model: "Enduro", price: 68000 },
        { model: "Thrust", price: 125000 },
        { model: "Vindicator", price: 140000 }
    ],
    "LCC": [
        { model: "Avarus", price: 135000 },
        { model: "Hexer", price: 120000 },
        { model: "Innovation", price: 150000 },
        { model: "Sanctus", price: 225000 }
    ],
    "MAIBATSU": [
        { model: "Manchez", price: 88000 },
        { model: "Manchez Scout", price: 112000 },
        { model: "Sanchez", price: 58000 },
        { model: "Sanchez (Livery)", price: 68000 }
    ],
    "NAGASAKI": [
        { model: "BF-400", price: 78000 },
        { model: "Carbon RS", price: 145000 },
        { model: "Chimera", price: 100000 },
        { model: "Shinobi", price: 195000 },
        { model: "Stryder", price: 110000 }
    ],
    "PEGASSI": [
        { model: "Bati 801", price: 115000 },
        { model: "Bati 801RR", price: 130000 },
        { model: "Esskey", price: 92000 },
        { model: "Faggio", price: 40000 },
        { model: "Faggio Mod", price: 50000 },
        { model: "Faggio Sport", price: 58000 },
        { model: "FCR 1000", price: 118000 },
        { model: "FCR 1000 Custom", price: 140000 },
        { model: "Ruffian", price: 125000 },
        { model: "Vortex", price: 135000 }
    ],
    "PRINCIPE": [
        { model: "Diabolus", price: 125000 },
        { model: "Diabolus Custom", price: 155000 },
        { model: "Lectro", price: 120000 },
        { model: "Nemesis", price: 95000 }
    ],
    "SHITZU": [
        { model: "Defiler", price: 145000 },
        { model: "Hakuchou", price: 150000 },
        { model: "Hakuchou Drag", price: 210000 },
        { model: "PCJ 600", price: 90000 },
        { model: "Vader", price: 95000 }
    ],
    "WESTERN": [
        { model: "Bagger", price: 115000 },
        { model: "Cliffhanger", price: 110000 },
        { model: "Daemon", price: 110000 },
        { model: "Daemon Custom", price: 130000 },
        { model: "Gargoyle", price: 125000 },
        { model: "Nightblade", price: 165000 },
        { model: "Powersurge", price: 165000 },
        { model: "Rat Bike", price: 58000 },
        { model: "Reever", price: 150000 },
        { model: "Sovereign", price: 145000 },
        { model: "Wolfsbane", price: 150000 },
        { model: "Zombie", price: 185000 },
        { model: "Zombie Bobber", price: 170000 }
    ]
};

let brandSelect, modelSelect, invoiceItems, vehiclesSubtotal, finalTotal, discountInput, dateInput, sellerSigInput, clientNameInput, sigDisplay, clientSigDisplay, refDisplay, displayDate;
let brandsGrid, modelsGrid, brandsStep, modelsStep, searchInput;

let currentVehiclesTotal = 0;
let selectedBrand = null;
let selectedModel = null;

function init() {
    brandSelect = document.getElementById('brand-select');
    modelSelect = document.getElementById('model-select');
    invoiceItems = document.getElementById('invoice-items');
    vehiclesSubtotal = document.getElementById('vehicles-subtotal');
    finalTotal = document.getElementById('final-total');
    discountInput = document.getElementById('discount-price');
    dateInput = document.getElementById('date-input');
    sellerSigInput = document.getElementById('seller-sig-input');
    clientNameInput = document.getElementById('client-name-input');
    sigDisplay = document.getElementById('sig-display');
    clientSigDisplay = document.getElementById('client-sig-display');
    refDisplay = document.getElementById('ref-display');
    displayDate = document.getElementById('display-date');
    
    brandsGrid = document.getElementById('brands-grid');
    modelsGrid = document.getElementById('models-grid');
    brandsStep = document.getElementById('brands-step');
    modelsStep = document.getElementById('models-step');
    searchInput = document.getElementById('search-input');
    
    renderBrands();
    setCurrentDate();
    attachEventListeners();
    updateVehicleCounter();
    updateProgress();
}

function renderBrands(filter = '') {
    brandsGrid.innerHTML = '';
    
    for (let brand in bikes) {
        if (filter && !brand.toLowerCase().includes(filter.toLowerCase())) {
            continue;
        }
        
        const card = document.createElement('div');
        card.className = 'brand-card';
        card.onclick = () => selectBrand(brand);
        
        card.innerHTML = `
            <div class="brand-name">${brand}</div>
            <div class="brand-count">${bikes[brand].length} modèle${bikes[brand].length > 1 ? 's' : ''}</div>
        `;
        
        brandsGrid.appendChild(card);
    }
}

function selectBrand(brand) {
    selectedBrand = brand;
    brandsStep.style.display = 'none';
    modelsStep.style.display = 'block';
    renderModels(brand);
}

function renderModels(brand, filter = '') {
    modelsGrid.innerHTML = '';
    
    bikes[brand].forEach(bike => {
        if (filter && !bike.model.toLowerCase().includes(filter.toLowerCase())) {
            return;
        }
        
        const card = document.createElement('div');
        card.className = 'model-card';
        card.onclick = () => selectModel(brand, bike);
        
        card.innerHTML = `
            <div class="model-header">
                <span class="model-icon">🏍️</span>
                <div class="model-name">${bike.model}</div>
            </div>
            <div class="model-price">${formatPrice(bike.price)}</div>
            <div class="model-brand">${brand}</div>
        `;
        
        modelsGrid.appendChild(card);
    });
}

function selectModel(brand, bike) {
    const existingRow = findExistingBike(brand, bike.model);
    
    if (existingRow) {
        const qtyValue = existingRow.querySelector('.qty-value');
        const currentQty = parseInt(qtyValue.textContent);
        const newQty = currentQty + 1;
        
        const totalVehicles = getTotalVehicleCount();
        if (totalVehicles >= MAX_BIKES) {
            alert(`Limite de ${MAX_BIKES} véhicules atteinte !`);
            return;
        }
        
        qtyValue.textContent = newQty;
        
        const totalCell = existingRow.querySelector('.line-total');
        const lineTotal = bike.price * newQty;
        totalCell.textContent = formatPrice(lineTotal);
        totalCell.setAttribute('data-total', lineTotal);
        
        currentVehiclesTotal += bike.price;
        showSuccessNotification(`${brand} ${bike.model} - Quantité: ${newQty}`);
    } else {
        if (invoiceItems.children.length >= MAX_BIKES) {
            alert(`Limite de ${MAX_BIKES} véhicules atteinte !`);
            return;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-brand', brand);
        row.setAttribute('data-model', bike.model);
        row.innerHTML = `
            <td><b>${brand}</b></td>
            <td>${bike.model}</td>
            <td style="text-align: center;">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(this, -1)">-</button>
                    <span class="qty-value">1</span>
                    <button class="qty-btn" onclick="changeQty(this, 1)">+</button>
                </div>
            </td>
            <td class="col-price" data-price="${bike.price}">${formatPrice(bike.price)}</td>
            <td class="col-price line-total" data-total="${bike.price}">${formatPrice(bike.price)}</td>
            <td class="col-action">
                <span class="btn-remove" onclick="removeBike(this)">X</span>
            </td>
        `;
        invoiceItems.appendChild(row);
        
        currentVehiclesTotal += bike.price;
        showSuccessNotification(`${brand} ${bike.model} ajouté !`);
    }
    
    updateSubtotal();
    updateVehicleCounter();
    updateProgress();
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--mayan-green);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Oswald', sans-serif;
        font-size: 1rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function resetSelection() {
    selectedBrand = null;
    selectedModel = null;
    brandsStep.style.display = 'block';
    modelsStep.style.display = 'none';
    searchInput.value = '';
    renderBrands();
}

function populateBrands() {
}

function updateModels() {
}

function addBike() {
}

function findExistingBike(brand, model) {
    const rows = invoiceItems.querySelectorAll('tr');
    for (let row of rows) {
        if (row.getAttribute('data-brand') === brand && row.getAttribute('data-model') === model) {
            return row;
        }
    }
    return null;
}

function getTotalVehicleCount() {
    let total = 0;
    const rows = invoiceItems.querySelectorAll('tr');
    rows.forEach(row => {
        const qtyValue = row.querySelector('.qty-value');
        if (qtyValue) {
            total += parseInt(qtyValue.textContent);
        }
    });
    return total;
}

function changeQty(button, delta) {
    const row = button.closest('tr');
    const qtyValue = row.querySelector('.qty-value');
    const currentQty = parseInt(qtyValue.textContent);
    const newQty = currentQty + delta;
    
    if (newQty < 1) {
        removeBike(row.querySelector('.btn-remove'));
        return;
    }
    
    const totalVehicles = getTotalVehicleCount();
    if (delta > 0 && totalVehicles >= MAX_BIKES) {
        alert(`Limite de ${MAX_BIKES} véhicules atteinte !`);
        return;
    }
    
    qtyValue.textContent = newQty;
    
    const priceCell = row.querySelector('.col-price[data-price]');
    const unitPrice = parseFloat(priceCell.getAttribute('data-price'));
    const lineTotal = unitPrice * newQty;
    
    const totalCell = row.querySelector('.line-total');
    totalCell.textContent = formatPrice(lineTotal);
    totalCell.setAttribute('data-total', lineTotal);
    
    currentVehiclesTotal += unitPrice * delta;
    updateSubtotal();
    updateVehicleCounter();
    updateProgress();
}

function removeBike(button) {
    const row = button.closest('tr');
    const totalCell = row.querySelector('.line-total');
    const lineTotal = parseFloat(totalCell.getAttribute('data-total'));
    
    currentVehiclesTotal -= lineTotal;
    row.remove();
    updateSubtotal();
    updateVehicleCounter();
    updateProgress();
}

function updateVehicleCounter() {
    const counterElement = document.getElementById('vehicle-count');
    if (!counterElement) return;
    
    const count = getTotalVehicleCount();
    counterElement.textContent = count;
    
    counterElement.style.transition = 'transform 0.2s ease';
    counterElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 200);
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (!progressFill || !progressText || !invoiceItems) return;
    
    const count = getTotalVehicleCount();
    const percentage = (count / MAX_BIKES) * 100;
    progressFill.style.width = percentage + '%';
    
    if (count === 0) {
        progressText.textContent = 'Commencez par ajouter un véhicule';
    } else if (count < MAX_BIKES) {
        progressText.textContent = `${count} véhicule${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} • ${MAX_BIKES - count} restant${MAX_BIKES - count > 1 ? 's' : ''}`;
    } else {
        progressText.textContent = '✓ Limite maximale atteinte';
    }
}

function updateSubtotal() {
    vehiclesSubtotal.textContent = formatPrice(currentVehiclesTotal);
    calcTotal();
}

function calcTotal() {
    const discount = parseFloat(discountInput.value) || 0;
    const total = Math.max(0, currentVehiclesTotal - discount);
    finalTotal.textContent = formatPrice(total);
}

function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' $';
}

function updateSellerSig() {
    sigDisplay.textContent = sellerSigInput.value;
}

function updateClientSig() {
    clientSigDisplay.textContent = clientNameInput.value;
}

function updateDate() {
    const dateValue = dateInput.value;
    if (!dateValue) return;
    
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    displayDate.textContent = `Date : ${day}/${month}/${year}`;
    
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    refDisplay.textContent = `INV-${year}${month}${day}-${randomNum}`;
}

function setCurrentDate() {
    dateInput.valueAsDate = new Date();
    updateDate();
}

function downloadPNG() {
    const element = document.getElementById("invoice-page");
    const ref = refDisplay.textContent || "Facture";

    if (typeof html2canvas === 'undefined') {
        alert("Erreur : html2canvas n'est pas chargé.");
        return;
    }

    html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fcfbf9'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Mayans_${ref.replace(/[/\\?%*:|"<>]/g, '_')}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch(error => {
        console.error("Erreur lors de la génération du PNG:", error);
        alert("Erreur lors de la génération de l'image.");
    });
}

function attachEventListeners() {
    if (discountInput) discountInput.addEventListener('input', calcTotal);
    if (dateInput) dateInput.addEventListener('change', updateDate);
    if (sellerSigInput) sellerSigInput.addEventListener('input', updateSellerSig);
    if (clientNameInput) clientNameInput.addEventListener('input', updateClientSig);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filter = e.target.value;
            if (brandsStep.style.display !== 'none') {
                renderBrands(filter);
            } else {
                renderModels(selectedBrand, filter);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
