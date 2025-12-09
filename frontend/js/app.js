const API_URL = 'http://localhost:3000/api';
let cart = [];
let menuData = [];

// 1. 初始化：加载菜单
document.addEventListener('DOMContentLoaded', () => {
    fetch(`${API_URL}/menu`)
        .then(response => response.json())
        .then(data => {
            menuData = data;
            renderMenu(data);
        })
        .catch(err => console.error('Error fetching menu:', err));
});

// 2. 渲染菜单
function renderMenu(items) {
    const menuContainer = document.getElementById('menu-list');
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        
        // 如果没有图片链接，提供一个默认占位图（可选）
        const imgSrc = item.image ? item.image : 'https://via.placeholder.com/150';

        div.innerHTML = `
            <!-- 修改点：给图片加了 onclick 事件 -->
            <img src="${imgSrc}" alt="${item.name}" class="menu-img" 
                 style="cursor: pointer;" onclick="openModal(${item.id})">
            
            <div class="menu-info">
                <!-- 修改点：点击名字也能打开详情 -->
                <strong style="cursor: pointer;" onclick="openModal(${item.id})">${item.name}</strong> <br>
                <span class="menu-category">${item.category}</span>
                <!-- 新增：显示简略评分 -->
                <small style="color: #ffc107">★ ${item.rating || 'New'}</small>
            </div>
            
            <!-- 下面的价格和按钮部分保持不变... -->
            <div style="text-align: right;">
               <!-- ... -->
            </div>
        `;
        menuContainer.appendChild(div);
    });
}

// 3. 加入购物车逻辑
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    if (item) {
        cart.push(item);
        updateCartUI();
    }
}

// 4. 更新购物车界面
function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    
    cartList.innerHTML = cart.map(item => `<li>${item.name} - ¥${item.price}</li>`).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalSpan.innerText = total;
}

// 5. 提交订单
function placeOrder() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart is Empty',
            text: 'Please select some delicious food before placing the order!',
            confirmButtonColor: '#ffc107'
        });
        return;
    }

    const orderPayload = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    })
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(data => {
        // ✨ Using SweetAlert2 here ✨
        Swal.fire({
            icon: 'success',
            title: 'Order Placed Successfully!',
            html: `Your Order ID is:<br><b>${data.orderId}</b>`, // Supports HTML content
            confirmButtonText: 'Awesome',
            confirmButtonColor: '#28a745',
            timer: 5000, // Auto-close after 5 seconds (optional)
            timerProgressBar: true
        });
        
        // Clear cart and UI
        cart = [];
        updateCartUI();
    })
    .catch(err => {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Order failed. Please check if the backend service is running',
            confirmButtonColor: '#dc3545'
        });
    });
}
// --- Detail Modal Logic ---

function openModal(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;

    // 1. Populate Data
    document.getElementById('modal-img').src = item.image || 'https://via.placeholder.com/300';
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-price').innerText = `¥${item.price}`;
    document.getElementById('modal-rating').innerText = `★ ${item.rating} (${item.reviews.length} reviews)`;
    document.getElementById('modal-desc').innerText = item.description || "No description available";

    // 2. Render Ingredient Tags
    const ingredientsContainer = document.getElementById('modal-ingredients');
    if (item.ingredients && item.ingredients.length > 0) {
        ingredientsContainer.innerHTML = item.ingredients.map(ing => 
            `<span class="ingredient-tag">${ing}</span>`
        ).join('');
    } else {
        ingredientsContainer.innerHTML = '<span style="color:#999">No ingredient information available</span>';
    }

    // 3. Render Reviews
    const reviewsContainer = document.getElementById('modal-reviews');
    if (item.reviews && item.reviews.length > 0) {
        reviewsContainer.innerHTML = item.reviews.map(r => 
            `<li><strong>${r.user}:</strong> ${r.comment}</li>`
        ).join('');
    } else {
        reviewsContainer.innerHTML = '<li style="color:#999; text-align:center;">No reviews yet, be the first!</li>';
    }

    // 4. Set Button Logic
    const addBtn = document.getElementById('modal-add-btn');
    if (item.available) {
        addBtn.disabled = false;
        addBtn.innerText = "Add to Cart";
        addBtn.onclick = () => {
            addToCart(item.id);
            closeModal(); // Close modal after adding
            // Use the previous SweetAlert notification here
            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
            });
            Toast.fire({ icon: 'success', title: 'Added to cart' });
        };
    } else {
        addBtn.disabled = true;
        addBtn.innerText = "Sold Out";
    }

    // 5. Display Modal
    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Close when clicking outside the modal/on the overlay
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target == modal) {
        closeModal();
    }
}