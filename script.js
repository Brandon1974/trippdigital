// STRIPE CONFIGURATION
const stripe = Stripe('pk_live_YOUR_STRIPE_KEY_HERE'); // Replace with your Stripe publishable key
let cart = [];

// CART MANAGEMENT
function addToCart(price, name) {
    cart.push({ price: parseFloat(price), name: name });
    updateCartBadge();
    showNotification(`${name} added to cart!`);
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    badge.textContent = cart.length;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #FF6B00;
        color: #000;
        padding: 15px 25px;
        border-radius: 4px;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CART BUTTON HANDLERS
document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const price = btn.getAttribute('data-price');
        const name = btn.getAttribute('data-name');
        addToCart(price, name);
    });
});

// SERVICE PLAN HANDLERS
document.querySelectorAll('.btn-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const price = btn.getAttribute('data-price');
        const name = btn.getAttribute('data-name');
        openCheckout([{ price: parseFloat(price), name: name }]);
    });
});

// CHECKOUT MODAL
const modal = document.getElementById('checkoutModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function openCheckout(items = null) {
    const itemsToCheckout = items || cart;

    if (itemsToCheckout.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    const itemsHtml = itemsToCheckout.map(item => `
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #333;">
            <div style="display: flex; justify-content: space-between;">
                <span>${item.name}</span>
                <span style="color: #FF6B00; font-weight: 700;">$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    const total = itemsToCheckout.reduce((sum, item) => sum + item.price, 0);

    document.getElementById('checkout-items').innerHTML = itemsHtml;
    document.getElementById('checkout-total').innerHTML = `Total: $${total.toFixed(2)}`;

    // Store items for checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.onclick = () => processCheckout(itemsToCheckout);

    modal.style.display = 'block';
}

function processCheckout(items) {
    // Create line items for Stripe
    const lineItems = items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
    }));

    // Redirect to Stripe Checkout
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems }),
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.url;
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Payment processing error. Please try again.');
    });
}

// CART ICON CLICK
document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    openCheckout();
});

// NEWSLETTER FORMS
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    handleNewsletter(email);
});

document.getElementById('footerNewsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    handleNewsletter(email);
});

function handleNewsletter(email) {
    // Simulate newsletter signup (replace with actual API call)
    console.log('Newsletter signup:', email);
    showNotification('Thanks for subscribing!');

    // Clear form
    document.querySelectorAll('input[type="email"]').forEach(input => input.value = '');
}

// ANIMATIONS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#search' && href !== '#account' && href !== '#cart' && href !== '#all-products' && href !== '#checkout') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// INITIALIZE
updateCartBadge();
