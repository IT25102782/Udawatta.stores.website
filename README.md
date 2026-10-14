# Udawatta Stores – Online Grocery Shopping System

**SE2012 – Object Oriented Analysis and Design (OOAD) | Group 39**

Udawatta Stores is a web-based grocery shopping application developed to help customers browse products, manage their shopping carts, and place grocery orders online. The system also provides an administration interface for managing the product catalog and customer orders.

## Live Links

- **Frontend (Vercel):** https://ooad-project-six.vercel.app
- **Backend (Railway):** https://ooad-project-production.up.railway.app
- **GitHub repository:** https://github.com/IT25102782/OOAD-Group-39

> These are the previously configured deployment URLs. The live domains and available features may change as the project is updated.

## Main Features

### Customer

- Register an account and log in.
- Browse, search, and view product details.
- Add products to the shopping cart.
- Update quantities and remove items from the cart.
- Review the order total and proceed to checkout.
- Enter delivery details and place an order.
- View order history and order status.
- Submit product ratings and reviews.

### Administrator

- Access the administration dashboard.
- Add, edit, and delete products.
- View and manage customer orders.
- Update order statuses.

Payment-related backend functionality is also included in the project; the payment options available to customers depend on the current application configuration.

## Technologies Used

| Layer | Technology |
| --- | --- |
| Frontend | React, JavaScript, HTML, CSS, Vite |
| Backend | Java, Spring Boot, Maven |
| Database | MySQL |
| Authentication / security | Spring Security and JWT-related components |
| Version control | Git and GitHub |
| Deployment | Vercel (frontend), Railway (backend and MySQL) |

## Project Structure

```text
OOAD-Group-39/
├── udawatta_stores_backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/udawatta_stores_website/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── udawatta_stores_frontend/
│   └── udawatta-stores-frontend/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

> Some module files are shared between features. For example, the order data model and order API support both checkout and administration.

## Run the Project Locally

### Requirements

- Java Development Kit (JDK) compatible with the backend `pom.xml` (Java 17 or newer for the current Spring Boot project).
- Node.js and npm.
- MySQL Server.
- Git (optional, for cloning the repository).

### 1. Clone the Repository

```bash
git clone https://github.com/IT25102782/OOAD-Group-39.git
cd OOAD-Group-39
```

### 2. Configure MySQL

Create the local MySQL database if it does not exist:

```sql
CREATE DATABASE udawatta_stores;
```

Review the backend configuration in:

```text
udawatta_stores_backend/src/main/resources/application.properties
```

Configure the datasource URL, database username, and database password for your local MySQL instance. **Do not commit real passwords, tokens, or cloud database credentials to GitHub.** Use environment variables or local-only configuration for secrets.

The application's entity mappings and database initialization settings may affect which tables are created automatically.

### 3. Start the Spring Boot Backend

**macOS / Linux:**

```bash
cd udawatta_stores_backend
./mvnw spring-boot:run
```

**Windows PowerShell:**

```powershell
cd udawatta_stores_backend
.\mvnw.cmd spring-boot:run
```

The backend normally runs at:

```text
http://localhost:8080
```

### 4. Start the React Frontend

In a **new terminal**, from the repository root:

```bash
cd udawatta_stores_frontend/udawatta-stores-frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

> Make sure the frontend API configuration points to the backend you want to use (local Spring Boot or the deployed Railway service). A Vercel build was previously configured with a `VITE_API_URL` environment variable; verify the frontend code uses that variable before relying on it locally.

## Group Members and Assigned Responsibilities

| Student ID | Member | Assigned Responsibilities |
| --- | --- | --- |
| **IT25101331** | **Dewmina S. P. C.** | User authentication, customer management, product reviews and ratings |
| **IT25102758** | **Kalhara W. P.** | Product catalog, product management, UI/UX |
| **IT25102760** | **Udawatta U. K. D. S. L.** | Shopping cart, checkout, placing orders |
| **IT25102782** | **Subasingha G. K. E.** | Admin dashboard, order management, customer order history, payment-related controller |

The table describes the **assigned module scope**. Some controllers, entities, repositories, and configuration files are shared dependencies across these modules.

## Development Workflow

Group work is organized through feature branches and pull requests:

```text
main
├── feature/-auth-reviews-(IT25101331)
├── feature/product-catalog(IT25102758)
├── feature/cart-checkout-(IT25102760)
└── feature/order-admin-(IT25102782)
```

Changes should be committed on the appropriate member branch and reviewed through a pull request before merging into `main`. Commit history reflects work recorded in Git and should not be treated as proof of work completed outside Git.

## Academic Project

This repository contains the group project for **SE2012 – Object Oriented Analysis and Design (OOAD)**. The project demonstrates object-oriented system development, a React frontend, REST-style backend services, database integration, and team-based version control.
