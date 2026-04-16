// cart.js — shared cart utility for all EyePoint pages

const CART_KEY = 'eyepointCart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  // Check if same item exists, increment qty
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`Added: ${item.name}`);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const num = parseInt((item.price || '0').replace(/[^0-9]/g, ''));
    return sum + num * (item.qty || 1);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  let toast = document.getElementById('ep-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ep-toast';
    toast.style.cssText = `
      position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(100px);
      background:#1a1a1a; color:#fff; padding:14px 28px; border-radius:999px;
      font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:600;
      letter-spacing:0.05em; z-index:9999; opacity:0;
      transition:transform 0.5s cubic-bezier(0.2,0.8,0.2,1), opacity 0.5s;
      box-shadow:0 10px 30px rgba(0,0,0,0.2); white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(0)'; toast.style.opacity = '1'; }, 50);
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; toast.style.opacity = '0'; }, 2800);
}

// Run on every page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
