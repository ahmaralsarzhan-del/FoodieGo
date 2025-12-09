# 🍔 FoodieGo

**FoodieGo** is a lightweight, distributed online food ordering system designed to demonstrate modern web development principles, RESTful API architecture, and DevOps integration.

It bridges a responsive Frontend Client with a Node.js Backend, featuring a file-based storage system for simplicity and portability.

---

##  Features

### 👤 Customer Experience (Frontend)
*   **Visual Menu**: Browse food items with high-quality images and dynamic price calculations.
*   **Product Details Modal**: Click on any item to view **ingredients**, **detailed descriptions**, and **user reviews** in a responsive popup.
*   **Smart Cart**: Real-time cart management and total calculation.
*   **Enhanced UX**: Beautiful order confirmation alerts using **SweetAlert2**.
*   **Stock Control**: Automatic handling of "Out of Stock" items.

### 👨‍🍳 Kitchen Management (Backend & Admin)
*   **Order Dashboard**: Real-time view of incoming orders.
*   **Lifecycle Management**: Track order status from `Accepted` → `Preparing` → `Ready` → `Completed`.
*   **RESTful API**: Clean API design for scalability.

### ⚙️ DevOps & Engineering
*   **No Database Required**: Uses a JSON file-based persistence layer (`menu.json` & individual order files).
*   **Automated Testing**: Integrated **cURL** shell scripts and **Selenium** UI automation.
*   **CI/CD Ready**: Includes a `Jenkinsfile` for pipeline configuration.
*   **Architecture Documentation**: UML/Architecture diagrams included via Draw.io.

---

##  Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+), SweetAlert2 |
| **Backend** | Node.js, Express.js, CORS, Body-Parser |
| **Database** | JSON File System (Local Storage) |
| **Testing** | Postman, Selenium WebDriver, cURL (Shell Scripts) |
| **DevOps** | Jenkins, Git, GitHub |
| **Design** | Draw.io (Architecture) |

---

##  Project Structure

```text
foodiego/
├── .gitignore                # Git configuration
├── Jenkinsfile               # CI/CD Pipeline definition
├── README.md                 # Project Documentation
├── backend/
│   ├── data/
│   │   ├── menu.json         # Menu data (w/ images, reviews, ingredients)
│   │   └── orders/           # JSON storage for submitted orders
│   ├── server.js             # API Gateway & Logic
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── css/
│   │   └── style.css         # Styling (Modal, Cards, Animations)
│   ├── js/
│   │   ├── app.js            # Customer logic (Fetch API, DOM manipulation)
│   │   └── admin.js          # Admin logic
│   ├── index.html            # Customer Interface
│   └── admin.html            # Kitchen Interface
├── docs/
│   ├── architecture.drawio   # Architecture Diagram Source
│   └── architecture.png      # Architecture Snapshot
└── tests/
    ├── shell/
    │   ├── test_api.sh       # Automated cURL API Test Script
    │   └── order_payload.json
