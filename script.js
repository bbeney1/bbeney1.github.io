// =============================================
// MONO—01 FLUID INTERFACE
// Living Canvas / Magnetic Physics / Gesture Control
// =============================================

// ===== STATE =====
const state = {
    mouse: { x: 0, y: 0 },
    currentFinish: 'black',
    quantity: 1,
    basePrice: 2400,
    cart: [],
    isDraggingProduct: false,
    isDraggingQuantity: false,
    productPosition: { x: 0, y: 0 }
};

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.fluid-cursor');
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function updateCursor() {
    cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
    requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor size on hover
document.querySelectorAll('[data-magnetic], .orb, .product-object, .quantity-handle, .wormhole-core')
    .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

// ===== RIPPLE CANVAS =====
const canvas = document.getElementById('ripple-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const ripples = [];

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 150;
        this.speed = 3;
        this.opacity = 1;
    }

    update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isDead() {
        return this.radius >= this.maxRadius;
    }
}

document.addEventListener('click', (e) => {
    ripples.push(new Ripple(e.clientX, e.clientY));
});

function animateRipples() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();

        if (ripples[i].isDead()) {
            ripples.splice(i, 1);
        }
    }

    requestAnimationFrame(animateRipples);
}
animateRipples();

// ===== MAGNETIC ELEMENTS =====
function applyMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(state.mouse.x - centerX, 2) +
            Math.pow(state.mouse.y - centerY, 2)
        );

        const maxDistance = 200;
        const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.3;

        if (distance < maxDistance) {
            const pullX = (state.mouse.x - centerX) * strength;
            const pullY = (state.mouse.y - centerY) * strength;

            el.style.transform = `translate(${pullX}px, ${pullY}px)`;
        } else {
            el.style.transform = 'translate(0, 0)';
        }
    });

    requestAnimationFrame(applyMagneticEffect);
}
applyMagneticEffect();

// ===== PRODUCT OBJECT DRAGGING =====
const productObject = document.getElementById('product-object');
const productContainer = document.getElementById('product-container');
let productDragOffset = { x: 0, y: 0 };

if (productObject && productContainer) {
    productObject.addEventListener('mousedown', (e) => {
        state.isDraggingProduct = true;
        productObject.classList.add('dragging');

        const rect = productObject.getBoundingClientRect();
        productDragOffset.x = e.clientX - rect.left - rect.width / 2;
        productDragOffset.y = e.clientY - rect.top - rect.height / 2;
    });

    document.addEventListener('mousemove', (e) => {
        if (!state.isDraggingProduct) return;

        const containerRect = productContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left - productDragOffset.x;
        let y = e.clientY - containerRect.top - productDragOffset.y;

        // Constrain to container with some padding
        const padding = 50;
        x = Math.max(padding, Math.min(containerRect.width - padding, x));
        y = Math.max(padding, Math.min(containerRect.height - padding, y));

        state.productPosition.x = x;
        state.productPosition.y = y;

        productObject.style.left = `${x}px`;
        productObject.style.top = `${y}px`;
        productObject.style.transform = 'translate(-50%, -50%)';

        // Check if near cart zone
        checkCartZoneProximity(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
        if (state.isDraggingProduct) {
            state.isDraggingProduct = false;
            productObject.classList.remove('dragging');

            // Check if dropped in cart zone
            const cartZone = document.getElementById('cart-zone');
            if (cartZone) {
                const rect = cartZone.getBoundingClientRect();
                if (state.mouse.x > rect.left &&
                    state.mouse.x < rect.right &&
                    state.mouse.y > rect.top &&
                    state.mouse.y < rect.bottom) {
                    addToCart();
                }
            }

            // Snap back to center with elastic animation
            productObject.style.left = '50%';
            productObject.style.top = '50%';
            productObject.style.transform = 'translate(-50%, -50%)';
        }
    });
}

function checkCartZoneProximity(x, y) {
    const cartZone = document.getElementById('cart-zone');
    if (!cartZone) return;

    const rect = cartZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
        Math.pow(x - centerX, 2) +
        Math.pow(y - centerY, 2)
    );

    const indicator = cartZone.querySelector('.gravity-indicator');
    if (distance < 300) {
        const scale = 1 + (300 - distance) / 300 * 0.3;
        indicator.style.transform = `translate(-50%, -50%) scale(${scale})`;
    } else {
        indicator.style.transform = 'translate(-50%, -50%) scale(1)';
    }
}

// ===== FINISH SELECTOR (Orbs) =====
const orbs = document.querySelectorAll('.orb');

orbs.forEach(orb => {
    orb.addEventListener('click', () => {
        const finish = orb.getAttribute('data-finish');
        selectFinish(finish);
    });
});

function selectFinish(finish) {
    state.currentFinish = finish;

    // Update active state
    orbs.forEach(o => o.classList.remove('active'));
    document.querySelector(`[data-finish="${finish}"]`).classList.add('active');

    // Update product appearance
    if (productObject) {
        productObject.className = 'product-object';
        productObject.classList.add(`finish-${finish}`);
    }

    showToast(`Changed to ${finish.toUpperCase()}`);
}

// ===== QUANTITY SLIDER =====
const quantityHandle = document.getElementById('quantity-handle');
const quantityTrack = document.getElementById('quantity-track');
const handleValue = document.getElementById('handle-value');

if (quantityHandle && quantityTrack) {
    quantityHandle.addEventListener('mousedown', (e) => {
        state.isDraggingQuantity = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!state.isDraggingQuantity) return;

        const trackRect = quantityTrack.getBoundingClientRect();
        let x = e.clientX - trackRect.left;

        // Constrain to track
        x = Math.max(50, Math.min(trackRect.width - 50, x));

        // Convert to quantity (1-10)
        const percentage = (x - 50) / (trackRect.width - 100);
        state.quantity = Math.round(1 + percentage * 9);

        // Update position
        quantityHandle.style.left = `${x}px`;

        // Update display
        if (handleValue) {
            handleValue.textContent = state.quantity;
        }

        updatePrice();
    });

    document.addEventListener('mouseup', () => {
        if (state.isDraggingQuantity) {
            state.isDraggingQuantity = false;
        }
    });
}

// ===== PRICE CALCULATOR =====
function updatePrice() {
    const total = state.basePrice * state.quantity;
    const priceDisplay = document.getElementById('price-display');

    if (priceDisplay) {
        priceDisplay.textContent = `$${total.toLocaleString()}`;
    }
}

// ===== CART SYSTEM =====
function addToCart() {
    const finishNames = {
        'black': 'Matte Black',
        'aluminum': 'Brushed Aluminum',
        'white': 'Matte White',
        'titanium': 'Titanium'
    };

    const item = {
        finish: state.currentFinish,
        finishName: finishNames[state.currentFinish],
        quantity: state.quantity,
        price: state.basePrice
    };

    // Check if same finish exists
    const existingIndex = state.cart.findIndex(cartItem => cartItem.finish === item.finish);

    if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += item.quantity;
    } else {
        state.cart.push(item);
    }

    updateCartDisplay();
    updateCartCount();
    showToast('Added to cart');

    // Reset quantity
    state.quantity = 1;
    if (handleValue) handleValue.textContent = '1';
    if (quantityHandle) quantityHandle.style.left = '10%';
    updatePrice();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    cartItems.innerHTML = state.cart.map((item, index) => `
        <div class="cart-item-mini" data-index="${index}">
            ${item.finishName.split(' ')[0]}<br>×${item.quantity}
        </div>
    `).join('');
}

function updateCartCount() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCheckoutTotal() {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkoutTotal = document.getElementById('checkout-total');

    if (checkoutTotal) {
        checkoutTotal.textContent = `$${total.toLocaleString()}`;
    }
}

// ===== CHECKOUT WORMHOLE =====
const wormholeCore = document.querySelector('.wormhole-core');

if (wormholeCore) {
    wormholeCore.addEventListener('click', () => {
        checkout();
    });
}

function checkout() {
    if (state.cart.length === 0) {
        showToast('Cart is empty');
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    console.log('%c 🌀 CHECKOUT INITIATED', 'font-size: 18px; font-weight: 700;');
    console.log(`%c Total: $${total.toLocaleString()}`, 'font-size: 14px;');
    console.log('%c Items:', 'font-size: 14px;');
    state.cart.forEach(item => {
        console.log(`  • ${item.finishName} × ${item.quantity} = $${(item.price * item.quantity).toLocaleString()}`);
    });

    showToast('Checkout complete ✓');

    // Clear cart
    setTimeout(() => {
        state.cart = [];
        updateCartDisplay();
        updateCartCount();
        updateCheckoutTotal();
    }, 2000);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = toast.querySelector('.toast-text');

    if (toastText) {
        toastText.textContent = message;
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===== AMBIENT PARTICLES =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;

        particlesContainer.appendChild(particle);
    }
}

// ===== INITIALIZE =====
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updatePrice();
    updateCheckoutTotal();

    console.log('%c MONO—01 FLUID INTERFACE', 'font-size: 24px; font-weight: 700;');
    console.log('%c Living Canvas Activated', 'font-size: 14px; color: #666;');
    console.log('%c - Drag the product object', 'font-size: 12px;');
    console.log('%c - Click orbs to change finish', 'font-size: 12px;');
    console.log('%c - Drag quantity slider', 'font-size: 12px;');
    console.log('%c - Drop product in cart zone to add', 'font-size: 12px;');
    console.log('%c - Click wormhole to checkout', 'font-size: 12px;');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Update checkout total periodically
setInterval(() => {
    updateCheckoutTotal();
}, 1000);
