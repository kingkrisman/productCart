let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render the desserts
function renderDesserts() {
    const dessertsGrid = document.getElementById('dessertsGrid');
    productsData.forEach(product => {
        const dessertItem = document.createElement('div');
        dessertItem.classList.add('dessert-item');
        dessertItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="dessert-image">
           
            <p>${product.category}</p>
 <h3 class=" desserts-menu ">${product.name}</h3>
            <p class="pri">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>

            <div class="quantity-selector" style="display: none;">
                <div class="quantity-btn">
                    <img src="assets/images/icon-decrement-quantity.svg" class="icon-decrement-quantity" data-id="${product.id}">
                    <h6 class="quantity-display">1</h6>
                    <img src="assets/images/icon-increment-quantity.svg" class="icon-increment-quantity" data-id="${product.id}">
                </div>
            </div>
        `;
        dessertsGrid.appendChild(dessertItem);
    });
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = ''; 
    let totalAmount = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `<div class="cart-cards">
            <span class="cart-items">${item.name} <div class="item-quantity">x${item.quantity}</div></span>
            <span class="item-price-fixed">@$${item.price.toFixed(2)}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="delete-item" data-id="${item.id}">X</button></div>
        `;
        cartItemsList.appendChild(cartItem);
        totalAmount += item.price * item.quantity;
    });

    document.getElementById('orderTotalAmount').innerText = `$${totalAmount.toFixed(2)}`;
    document.getElementById('cartCount').innerText = cart.length;
}

// Function to handle adding items to the cart
function addToCart(productId, button) {
    const product = productsData.find(item => item.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    // Hide "Add to Cart" button and show the quantity selector
    button.style.display = 'none';
    button.nextElementSibling.style.display = 'block';

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Function to handle changing the quantity of an item
function changeQuantity(button, change) {
    const productId = parseInt(button.dataset.id);
    const cartItem = cart.find(item => item.id === productId);
    const quantityDisplay = button.closest('.quantity-btn').querySelector('.quantity-display');

    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity < 1) {
            cartItem.quantity = 1; 
        }
        quantityDisplay.innerText = cartItem.quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to handle deleting items from the cart and restoring "Add to Cart" button
function deleteItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();

    // Find the dessert item and revert to "Add to Cart" button
    const dessertItem = document.querySelector(`.add-to-cart[data-id='${productId}']`);
    if (dessertItem) {
        dessertItem.style.display = 'block'; 
        dessertItem.nextElementSibling.style.display = 'none'; 
    }
}

// Initial render of desserts and cart display
document.addEventListener('DOMContentLoaded', () => {
    renderDesserts();
    updateCartDisplay();

    // Event delegation for adding items to the cart
    document.getElementById('dessertsGrid').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId, e.target);
        }
    });

    // Event delegation for quantity changes
    document.getElementById('dessertsGrid').addEventListener('click', (e) => {
        if (e.target.classList.contains('icon-increment-quantity')) {
            changeQuantity(e.target, 1);
        } else if (e.target.classList.contains('icon-decrement-quantity')) {
            changeQuantity(e.target, -1);
        }
    });

    // Event delegation for deleting items from the cart
    document.getElementById('cartItemsList').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item')) {
            const productId = parseInt(e.target.dataset.id);
            deleteItemFromCart(productId);
        }
    });
});













// Function to handle the confirm order button
document.querySelector('.confirm-order-button').addEventListener('click', () => {
    displayOrderConfirmation();
});

function displayOrderConfirmation() {
    const orderDetailsList = document.getElementById('orderDetailsList');
    orderDetailsList.innerHTML = ''; 
    let totalAmount = 0;

    // Populate the order details
    cart.forEach(item => {
        const orderDetail = document.createElement('li');
        orderDetail.innerHTML = `${item.name} (${item.quantity} x $${item.price.toFixed(2)})`;
        orderDetailsList.appendChild(orderDetail);
        totalAmount += item.price * item.quantity;
    });

    // Update the total amount in the modal
    document.getElementById('modalOrderTotalAmount').innerText = `$${totalAmount.toFixed(2)}`;
    
    // Show the modal
    document.getElementById('orderConfirmationModal').style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    document.getElementById('orderConfirmationModal').style.display = 'none';
}

// Function to start a new order
function startNewOrder() {
   
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    closeModal();
}

