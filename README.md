# Member 1: Authentication & Reviews Module
**OOAD Group 39**

* **Role:** Member 1[cite: 1]
* **Branch:** `feature/-auth-reviews-(IT25101331)`[cite: 1]
* **Assigned Modules:** User Authentication, User Management, and Product Reviews[cite: 1, 4]

---
This module handles secure user authentication, authorization, role management, and product reviews for the Udawatta Stores web application[cite: 4]. It provides a full-stack implementation comprising Spring Boot REST APIs with JWT security on the backend and React components on the frontend[cite: 4].

---

##Contribute files

### Backend (`udawatta_stores_backend`)[cite: 4]

#### Controllers
* `UserController.java` – Endpoints for user registration, login, and user profile management[cite: 4].
* `ReviewController.java` – Endpoints for adding, retrieving, and managing product reviews[cite: 4].

#### Models
* `User.java` – JPA entity mapping user details, credentials, and roles[cite: 4].
* `Review.java` – JPA entity mapping product ratings, comments, and timestamps to users and products[cite: 4].

#### Repositories
* `UserRepository.java` – Spring Data JPA repository for database operations on the User entity[cite: 4].
* `ReviewRepository.java` – Spring Data JPA repository for querying review records[cite: 4].

#### Security
* `JwtAuthenticationFilter.java` – Custom filter intercepting HTTP requests to validate JWT bearer tokens[cite: 4].
* `JwtUtil.java` – Utility component for generating, parsing, and verifying JWT tokens[cite: 4].
* `SecurityConfig.java` – Spring Security filter chain configuration, endpoint access policies, and CORS configuration[cite: 4].

---

### Frontend (`udawatta_stores_frontend`)[cite: 4]

#### Context & Route Protection
* `src/context/AuthContext.jsx` – React context provider managing global authentication state, token storage, and session handling[cite: 4].
* `src/components/ProtectedRoute.jsx` – Higher-order component restricting access to authenticated views[cite: 4].

#### Pages & Styling
* `src/pages/Login.jsx` & `src/pages/Login.css` – User interface and styling for account login[cite: 4].
* `src/pages/Register.jsx` & `src/pages/Register.css` – User interface and styling for new user registration[cite: 4].

---

##Key Functional Features

1. **Stateless JWT Authentication:** Secure login session handling with cryptographic token generation and validation[cite: 4].
2. **Spring Security Integration:** Configured security filter chains for protected endpoints and role-based permissions[cite: 4].
3. **User Management:** Password encryption, input validation, and user profile persistence[cite: 4].
4. **Product Review Handling:** Allows authenticated users to submit ratings and feedback tied to specific products[cite: 4].
5. **Client-Side Route Protection:** Automatic redirects for unauthorized users trying to access restricted application routes[cite: 4].


