# **Order Management System**

This is a promotion-based order management system. The system includes functionality for both admin and client users, allowing product creation, promotions, cart management, and order confirmation.

---

## **Getting Started**

Follow these steps to set up and run the project locally:

### **1. Clone the Repository**
```bash
git clone [https://github.com/mrzahidxy/order-management-system.git](https://github.com/mrzahidxy/order-management-system.git)
cd order-management-system
```

### **2. Install Dependencies**
Navigate to both the **client** and **server** directories and install the required packages:

For the client:
```bash
cd client
npm install
```

For the server:
```bash
cd ../server
npm install
```

### **3. Set Up PostgreSQL Database**
- Set up a local PostgreSQL database.
- Update the **Prisma schema** file (`prisma/schema.prisma`) with your database connection details.

After configuring the database, generate Prisma client and run migrations:
```bash
npx prisma migrate dev
```

### **4. Start the Application**
Start both the client and server separately:

For the client:
```bash
cd client
npm run dev
```

For the server:
```bash
cd ../server
npm start
```

---

## **Usage Guide**

### **1. Sign Up**
- Navigate to the **Sign Up page** at `/auth/signup` to create a new user account.

### **2. Admin User Setup**
- For admin users, manually update the `isAdmin` field to `true` in the database.

### **3. Admin Login**
- Log in to the system via `/auth/login`.
- After logging in as an admin, access the **Admin Dashboard** at `/admin`.

#### **Admin Functionalities:**
- **Create Products**: Add new products from the admin dashboard.
- **Create Promotions**: Define promotions based on the logic provided in the assignment.
- **Confirm Orders**: Manage and confirm client orders.

### **4. Client Login**
- Sign up and log in as a client via `/auth/signup` and `/auth/login`.

#### **Client Functionalities:**
- **Add Products to Cart**: Navigate to the homepage, browse products, and add them to the cart.
- **Place Orders**: Go to the cart page and place orders.

---

## **Features**

- **Admin Dashboard**: Manage products, promotions, and orders.
- **Client Functionality**: Browse products, add them to the cart, and place orders.
- **Order Confirmation**: Admin confirms orders placed by clients.

---

## **Technologies Used**

- **Frontend**: Next.js, Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
