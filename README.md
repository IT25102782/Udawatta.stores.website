[README.md](https://github.com/user-attachments/files/33367620/README.md)
# Udawatta Stores — Product Catalog and Admin Products

Member 2 contribution to the OOAD Group 39 project.

| Detail | Value |
| --- | --- |
| Member | Kalhara W. P. |
| Student ID | IT25102758 |
| Group | 39 |
| Branch | `feature/product-catalog(IT25102758)` |
| Repository | [OOAD-Group-39](https://github.com/IT25102782/OOAD-Group-39) |

## Overview

Udawatta Stores is a group web application for browsing store products and managing store operations. This document describes Member 2's product catalog, user interface, and admin product management scope.

The module is part of the shared application, not a standalone project. Authentication, cart, reviews, orders, and shared configuration require integration with the other members' work. Features described here reflect the supplied source; their presence on a particular branch depends on which files have been committed.

## Features

### Customer interface

- Browse products with names, prices, categories, images, and stock information.
- Search products by name or category and filter by category.
- Sort products by price or name.
- View individual product details.
- Select quantities and connect to the shared cart functionality.
- Display the home page and navigation interface.

### Admin product management

- Add products through the product creation form.
- View, edit, and delete products.
- Maintain product descriptions, prices, categories, stock quantities, and image references.
- Validate product input through the backend controller.
- Provide product inventory statistics for integration with the admin dashboard.

Admin access relies on the shared authentication and security configuration.

## Technology

| Layer | Technologies used in the supplied project |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, CSS, AOS |
| Backend | Java, Spring Boot, Spring Data JPA |
| Database | MySQL |
| Shared security | Spring Security and JWT |
| Version control | Git and GitHub |

The backend build file specifies Java 17. Use the team's agreed compatible Java and Node.js installations and the dependency versions recorded in the project build files.

## Main files

Backend files are under `udawatta_stores_backend/src/main/java/com/example/udawatta_stores_website/`.

| File | Purpose |
| --- | --- |
| `model/Product.java` | Product entity and its data fields |
| `repository/ProductRepository.java` | Database access and case-insensitive product-name lookup |
| `service/ProductService.java` | Product listing and saving operations |
| `controller/ProductController.java` | Product API endpoints, validation, and inventory statistics |

Frontend files are under `udawatta_stores_frontend/udawatta-stores-frontend/src/`.

| Files | Purpose |
| --- | --- |
| `pages/Products.jsx` and `Products.css` | Customer product catalog |
| `pages/ProductDetails.jsx` and `ProductDetails.css` | Individual product details |
| `pages/AdminProducts.jsx` and `AdminProducts.css` | Admin product listing, editing, and deletion |
| `pages/AddProduct.jsx` and `AddProduct.css` | Product creation form |
| `pages/Home.jsx` and `Home.css` | Home page |
| `components/Navbar.jsx` and `Navbar.css` | Navigation |
| `assets/` | Images used by the interface |

`Home.jsx` and `ProductDetails.jsx` include review-related functionality shared with Member 1. Shared dependency copies do not imply exclusive authorship. Coordinate changes to `App.jsx`, authentication, cart context, security, and build configuration with their owners.

## Product API

The supplied frontend targets `http://localhost:8080` for backend requests.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/products` | List products |
| GET | `/api/products/{id}` | Get a product by ID |
| GET | `/api/products/stats` | Get inventory statistics |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

Authorization is enforced by the shared security configuration. Admin operations require the appropriate authenticated role.

## Running the integrated project locally

Use a complete, integrated project checkout. A branch containing only some of the feature files may not build or run yet.

### 1. Prepare the database and configuration

1. Start MySQL and obtain the team's database schema or SQL setup file.
2. Create and populate the required schema according to that setup.
3. Configure the database connection and shared application settings locally.

The supplied configuration uses the database name `udawatta_stores_sql_test` and `spring.jpa.hibernate.ddl-auto=validate`. The tables must already exist and match the entities; this setting does not create them automatically.

Provide the required database credentials, JWT secret, and any settings needed by other integrated modules through the team's local configuration process. Do not commit actual secrets.

### 2. Start the backend

From the repository root in Windows PowerShell:

```powershell
cd udawatta_stores_backend
.\mvnw.cmd spring-boot:run
```

### 3. Start the frontend

Open a second terminal at the repository root:

```powershell
cd udawatta_stores_frontend/udawatta-stores-frontend
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The supplied backend allows that frontend origin; if the frontend uses a different port, coordinate the origin settings.

## Contribution workflow

Keep Member 2 changes on `feature/product-catalog(IT25102758)`.

1. Confirm the current branch with `git branch --show-current`.
2. Stage only the intended files for a meaningful checkpoint.
3. Review the selection with `git diff --cached --stat` and `git diff --cached`.
4. Commit with a message describing the actual change.
5. Push to the Member 2 branch.
6. Open a pull request to the team's agreed integration branch, normally `main`.
7. Complete review and integration checks before merging.

Example upload command after a successful commit:

```powershell
git push origin "feature/product-catalog(IT25102758)"
```

Use a merge commit when the team needs to preserve individual progress commits in the integration branch. Coordinate shared-file changes and resolve conflicts with the relevant member.

## Verification checklist

These are checks to complete before merging, not claims of completed testing.

- [ ] The backend starts with the agreed database and configuration.
- [ ] The frontend builds with `npm run build` from its application folder.
- [ ] Product listing, searching, filtering, and sorting work.
- [ ] Product details and stock information display correctly.
- [ ] Admin product creation, editing, and deletion work.
- [ ] Invalid product input is handled appropriately.
- [ ] Non-admin users cannot perform admin product operations.
- [ ] Cart and review integrations still work.
- [ ] Shared routes and other members' features remain intact.

## Project context

Developed as a contribution to the SLIIT Year 2 Semester 1 Object-Oriented Analysis and Design group project. This README documents Member 2's scope and should accompany the team's main project documentation.
