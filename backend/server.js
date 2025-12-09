const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json());

// 数据路径配置
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_DIR = path.join(DATA_DIR, 'orders');

// 确保订单目录存在
if (!fs.existsSync(ORDERS_DIR)) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
}

// --- API 路由 ---

// 1. 获取菜单 (GET /api/menu)
app.get('/api/menu', (req, res) => {
    fs.readFile(MENU_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Unable to read menu' });
        res.json(JSON.parse(data));
    });
});

// 2. 提交订单 (POST /api/orders)
app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    
    // 生成唯一订单ID (基于时间戳)
    const orderId = 'order_' + Date.now();
    const newOrder = {
        id: orderId,
        items: orderData.items,
        total: orderData.total,
        status: 'Accepted', // 初始状态
        timestamp: new Date().toISOString()
    };

    const filePath = path.join(ORDERS_DIR, `${orderId}.json`);

    fs.writeFile(filePath, JSON.stringify(newOrder, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Order failed' });
        res.status(201).json({ message: 'Order submitted', orderId: orderId });
    });
});

// 3. 获取所有订单 (GET /api/orders) - 用于员工端
app.get('/api/orders', (req, res) => {
    fs.readdir(ORDERS_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Unable to read order list' });

        const orders = [];
        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const data = fs.readFileSync(path.join(ORDERS_DIR, file), 'utf8');
                orders.push(JSON.parse(data));
            }
        });
        
        // 按时间倒序排列
        orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(orders);
    });
});

// 4. 更新订单状态 (PUT /api/orders/:id)
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const filePath = path.join(ORDERS_DIR, `${orderId}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Order does not exist' });
    }

    // 读取现有订单，更新状态，再写回
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const order = JSON.parse(fileContent);
    order.status = status;

    fs.writeFile(filePath, JSON.stringify(order, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Status update failed' });
        res.json({ message: 'Status updated', status: status });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`FoodieGo API Gateway Running in http://localhost:${PORT}`);
});