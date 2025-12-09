#!/bin/bash

# 定义基础 URL
BASE_URL="http://localhost:3000/api"

echo "========================================"
echo "🚀 Starting FoodieGo API cURL testing"
echo "========================================"

# 1. 测试 GET Menu
echo ""
echo "Testing 1: Get Menu (GET /menu)..."
curl -s -X GET "$BASE_URL/menu" 
# -s 表示 silent (不显示进度条)

echo ""
echo "----------------------------------------"

# 2. 测试 POST Order
echo ""
echo "Testing 2: 提交订单 (POST /orders)..."
# 使用 -d @文件名 读取 JSON 文件发送
# 使用 -H 设置请求头
# 使用 -i 显示响应头（为了看 HTTP 201 Created）
RESPONSE=$(curl -s -i -H "Content-Type: application/json" -d @order_payload.json "$BASE_URL/orders")

echo "$RESPONSE"

# 尝试从响应中提取 Order ID (简单 grep 查找)
# 注意：这只是简单的字符串匹配，生产环境通常用 jq 工具解析 JSON
ORDER_ID=$(echo "$RESPONSE" | grep -o 'order_[0-9]*')

echo ""
if [ -z "$ORDER_ID" ]; then
  echo "❌ Order failed, Order ID not found."
else 
  echo "✅ Order placed successfully! ID captured: $ORDER_ID"
fi

echo "----------------------------------------"

# 3. 测试 GET Orders (Admin)
echo ""
echo "Testing 3: Employees check orders (GET /orders)..."
curl -s "$BASE_URL/orders"

echo ""
echo "----------------------------------------"

# 4. 测试 PUT Order Status (模拟员工接单)
if [ -n "$ORDER_ID" ]; then
    echo ""
    echo "Testing 4: Update order status (PUT /orders/$ORDER_ID)..."
    
    # 这里直接构建一个简单的 JSON 字符串
    curl -s -X PUT \
      -H "Content-Type: application/json" \
      -d '{"status": "Preparing"}' \
      "$BASE_URL/orders/$ORDER_ID"
      
    echo ""
fi

echo "========================================"
echo "🎉 Test ended"