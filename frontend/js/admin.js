const API_URL = 'http://localhost:3000/api';

// 1. 初始化
document.addEventListener('DOMContentLoaded', loadOrders);

// 2. 加载订单列表
function loadOrders() {
    fetch(`${API_URL}/orders`)
        .then(res => res.json())
        .then(orders => {
            renderOrders(orders);
        })
        .catch(err => console.error('Error loading orders:', err));
}

// 3. 渲染订单
function renderOrders(orders) {
    const container = document.getElementById('orders-list');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p>No orders yet</p>';
        return;
    }

    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-card';
        
        const itemsList = order.items.map(i => i.name).join(', ');
        
        div.innerHTML = `
            <div style="flex: 2;">
                <strong>Order number: ${order.id}</strong> <br>
                <small>${new Date(order.timestamp).toLocaleString()}</small> <br>
                Dishes: ${itemsList} <br>
                <strong>total: ¥${order.total}</strong>
            </div>
            <div style="flex: 1; text-align: right;">
                <span class="status-badge status-${order.status}">${order.status}</span>
                <br><br>
                <select onchange="updateStatus('${order.id}', this.value)">
                    <option value="Accepted" ${order.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>Ready</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    });
}

// 4. 更新订单状态
function updateStatus(orderId, newStatus) {
    fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
        // 重新加载列表以显示最新状态样式
        loadOrders();
    })
    .catch(err => alert("Status update failed"));
}