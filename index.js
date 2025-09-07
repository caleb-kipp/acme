// index.js
// Collects items from ss_cart and builds a vessel payload in sessionStorage

(function () {
  // Namespace for your site cart
  const CART_KEY = "ss_cart";
  const CHECKOUT_KEY = "checkoutCart";

  // Utility: Get current cart
  function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Utility: Get customer (if logged in / stored)
  function getCustomer() {
    const customer = localStorage.getItem("customerInfo");
    return customer ? JSON.parse(customer) : null;
  }

  // Build checkout vessel
  function buildCheckoutVessel() {
    const cartItems = getCart();
    const customer = getCustomer();

    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    const vessel = {
      cart: cartItems,
      customer: customer,
      timestamp: new Date().toISOString()
    };

    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(vessel));

    // Redirect to checkout.html
    window.location.href = "checkout.html";
  }

  // Attach handler to Checkout button in cart modal
  document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", buildCheckoutVessel);
    }
  });
})();