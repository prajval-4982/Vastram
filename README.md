# Vastram - Premium Laundry & Dry Cleaning E-Commerce Platform

Vastram is a full-stack e-commerce web application designed for a premium laundry and dry-cleaning service. It features a modern, responsive user interface built with React and Tailwind CSS, backed by a robust Node.js/Express server and MongoDB database.

## 🌟 Key Features

### User Experience
- **Modern UI/UX**: Beautifully designed interface with smooth gradients, micro-animations, and full Dark Mode support.
- **Service Catalog**: Browse categorized laundry services (Shirts, Suits, Traditional, Casual, Home Essentials) with distinct, dynamic icons.
- **Shopping Cart**: Real-time cart management using React Context API.
- **Mock Checkout Flow**: Simulated payment processing supporting Cash on Delivery, UPI, and Card inputs (uses Razorpay test keys for safe simulation).
- **User Dashboard**: Customers can track their active and past orders, view membership tiers, and update profiles.

### Admin Capabilities
- **Admin Dashboard**: Dedicated portal protected by role-based access control (RBAC).
- **Order Management**: View all customer orders and update their statuses through the pipeline (Pending -> Confirmed -> Picked Up -> In Progress -> Ready -> Out for Delivery -> Delivered).
- **User Analytics**: View registered customers, their membership tiers, total orders, and lifetime spending.

### Architecture & Security
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **API Protection**: Axios interceptors handle token attachment and graceful 401/404 redirects.
- **Data Integrity**: Express-validator ensures all incoming user data (emails, passwords, phones, addresses) is sanitized and correct.
- **Environment Safety**: Sensitive credentials (MongoDB URI, internal JWT secrets) are secured via `.env` files and strictly excluded from version control.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), React Router v6, Tailwind CSS, Lucide React (Icons), Axios, Context API
- **Backend**: Node.js, Express.js, MongoDB (Atlas), Mongoose, JSON Web Tokens (JWT), Express-Validator

## 🛠️ Local Development Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/prajval-4982/Vastram.git
cd Vastram
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
- Create a \`.env\` file in the \`server\` directory using \`.env.example\` as a template. You will need your own MongoDB Atlas Connection URI and a generated JWT Secret string.
- Start the server:
\`\`\`bash
npm run start
\`\`\`
*(Note: On first boot, the server will automatically seed the database with the default Vastram services catalog).*

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
- Start the development server (runs on port 5173 by default):
\`\`\`bash
npm run dev
\`\`\`

## 📝 License
This project is proprietary software belonging to Vastram.
