// admin.js
// Handles rendering orders, products, customers, analytics, etc.

(function () {
  const ORDERS_KEY = "orders";
  const PRODUCTS_KEY = "products";
  const CUSTOMERS_KEY = "customers"; // optional separate store

  // Utility: Get/set storage
  function getStorage(key, fallback = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }
  function setStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // -----------------------------
  // ORDERS
  // -----------------------------
  function renderOrders() {
    const orders = getStorage(ORDERS_KEY);
    const container = document.getElementById("ordersContainer");
    if (!container) return;

    if (!orders.length) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    let html = "<h2>Orders</h2><ul>";
    orders.forEach(order => {
      html += `
        <li>
          <strong>${order.orderId}</strong> - ${order.status} <br>
          Items: ${order.cart.length} | Customer: ${(order.customer?.name || "Guest")}
        </li>
      `;
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  // -----------------------------
  // CUSTOMERS
  // -----------------------------
  function renderCustomers() {
    const orders = getStorage(ORDERS_KEY);
    const customers = {};

    // Collect customers from orders
    orders.forEach(order => {
      if (order.customer && order.customer.email) {
        customers[order.customer.email] = order.customer;
      }
    });

    const container = document.getElementById("customersContainer");
    if (!container) return;

    if (!Object.keys(customers).length) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    let html = "<h2>Customers</h2><ul>";
    Object.values(customers).forEach(c => {
      html += `<li>${c.name} (${c.email})</li>`;
    });
    html += "</ul>";

    container.innerHTML = html;
  }

  // -----------------------------
  // PRODUCTS
  // -----------------------------
  function renderProducts() {
    const products = getStorage(PRODUCTS_KEY);
    const container = document.getElementById("productsContainer");
    if (!container) return;

    let html = `
      <h2>Products</h2>
      <button id="addProductBtn">+ Add Product</button>
      <ul>
    `;
    products.forEach((p, i) => {
      html += `
        <li>
          <strong>${p.title}</strong> - ${p.price} <br>
          ${p.category} | Stock: ${p.stock} <br>
          <button onclick="Admin.editProduct(${i})">Edit</button>
          <button onclick="Admin.deleteProduct(${i})">Delete</button>
        </li>
      `;
    });
    html += "</ul>";

    container.innerHTML = html;

    // Hook add product
    const addBtn = document.getElementById("addProductBtn");
    if (addBtn) addBtn.addEventListener("click", showAddProductForm);
  }

  function showAddProductForm() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = `
      <h2>Add Product</h2>
      <form id="addProductForm">
        <input type="text" id="title" placeholder="Title" required><br>
        <textarea id="description" placeholder="Description"></textarea><br>
        <input type="number" id="price" placeholder="Price" required><br>
        <input type="number" id="stock" placeholder="Stock" required><br>
        <input type="text" id="category" placeholder="Category"><br>
        <button type="submit">Save</button>
      </form>
    `;

    document
      .getElementById("addProductForm")
      .addEventListener("submit", e => {
        e.preventDefault();
        const products = getStorage(PRODUCTS_KEY);

        const newProduct = {
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          price: parseFloat(document.getElementById("price").value),
          stock: parseInt(document.getElementById("stock").value),
          category: document.getElementById("category").value,
          createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        setStorage(PRODUCTS_KEY, products);

        renderProducts();
      });
  }

  // -----------------------------
  // EDIT & DELETE
  // -----------------------------
  function editProduct(index) {
    const products = getStorage(PRODUCTS_KEY);
    const p = products[index];
    const container = document.getElementById("productsContainer");

    container.innerHTML = `
      <h2>Edit Product</h2>
      <form id="editProductForm">
        <input type="text" id="title" value="${p.title}" required><br>
        <textarea id="description">${p.description}</textarea><br>
        <input type="number" id="price" value="${p.price}" required><br>
        <input type="number" id="stock" value="${p.stock}" required><br>
        <input type="text" id="category" value="${p.category}"><br>
        <button type="submit">Update</button>
      </form>
    `;

    document
      .getElementById("editProductForm")
      .addEventListener("submit", e => {
        e.preventDefault();

        products[index] = {
          ...products[index],
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          price: parseFloat(document.getElementById("price").value),
          stock: parseInt(document.getElementById("stock").value),
          category: document.getElementById("category").value,
          updatedAt: new Date().toISOString()
        };

        setStorage(PRODUCTS_KEY, products);

        renderProducts();
      });
  }

  function deleteProduct(index) {
    const products = getStorage(PRODUCTS_KEY);
    if (!confirm("Delete this product?")) return;

    products.splice(index, 1);
    setStorage(PRODUCTS_KEY, products);

    renderProducts();
  }

  // -----------------------------
  // HOOKS
  // -----------------------------
  function init() {
    renderOrders();
    renderCustomers();
    renderProducts();
  }

  document.addEventListener("DOMContentLoaded", init);

  // Expose Admin namespace for edit/delete
  window.Admin = {
    editProduct,
    deleteProduct
  };
})();