import React, { useContext, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import cartIcon from "../assets/icons/cart.png";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import logo from "../assets/logo.png";

import "./Navbar.css";


const Navbar = () => {

    const { cartItems } =
        useContext(CartContext);

    const { user, logout } =
        useContext(AuthContext);


    const location =
        useLocation();

    const navigate =
        useNavigate();


    const [menuOpen, setMenuOpen] =
        useState(false);


    // Hide customer navbar on
    // login, register and admin pages
    if (
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/admin")
    ) {
        return null;
    }


    // Calculate total cart items
    const totalCartItems =
        cartItems.reduce(
            (total, item) =>
                total + (item.quantity || 1),
            0
        );


    // Close mobile menu
    const closeMenu = () => {

        setMenuOpen(false);

    };


    // Logout
    const handleLogout = () => {

        logout();

        setMenuOpen(false);

        navigate("/login");

    };


    return (

        <>

            {/* =============================
                TOP ANNOUNCEMENT
            ============================== */}

            <div className="top-announcement">

                <p>

                    Fresh groceries delivered to your doorstep

                    <span>
                        {" "}• Islandwide Delivery
                    </span>

                </p>

            </div>


            {/* =============================
                MAIN NAVBAR
            ============================== */}

            <nav className="main-navbar">

                <div className="navbar-inner">


                    {/* =========================
                        LOGO
                    ========================== */}

                    <Link
                        to="/"
                        className="brand-logo"
                        onClick={closeMenu}
                    >

                        <img
                            src={logo}
                            alt="Udawatta Stores"
                        />

                    </Link>


                    {/* =========================
                        NAVIGATION LINKS
                    ========================== */}

                    <ul
                        className={
                            menuOpen
                                ? "nav-menu nav-menu-open"
                                : "nav-menu"
                        }
                    >


                        {/* HOME */}

                        <li>

                            <Link
                                to="/"
                                className="nav-iridescent"
                                onClick={closeMenu}
                            >

                                Home

                            </Link>

                        </li>


                        {/* PRODUCTS */}

                        <li>

                            <Link
                                to="/products"
                                className="nav-iridescent"
                                onClick={closeMenu}
                            >

                                Products

                            </Link>

                        </li>


                        {/* MY ORDERS */}

                        {user && (

                            <li>

                                <Link
                                    to="/my-orders"
                                    className="nav-iridescent"
                                    onClick={closeMenu}
                                >

                                    My Orders

                                </Link>

                            </li>

                        )}


                        {/* =====================
                            USER / LOGIN
                        ====================== */}

                        {user ? (

                            <>

                                <li className="nav-user">

                                    Hi, {user.firstName}

                                </li>


                                <li>

                                    <button
                                        type="button"
                                        className="nav-logout"
                                        onClick={handleLogout}
                                    >

                                        Logout

                                    </button>

                                </li>

                            </>

                        ) : (

                            <li>

                                <Link
                                    to="/login"
                                    className="nav-login"
                                    onClick={closeMenu}
                                >

                                    Login

                                </Link>

                            </li>

                        )}

                    </ul>


                    {/* =========================
                        RIGHT ACTIONS
                    ========================== */}

                    <div className="navbar-actions">


                        {/* CART */}

                        <Link
                            to="/cart"
                            className="nav-cart"
                            onClick={closeMenu}
                        >

                            <span className="cart-symbol">

                                <img
                                    src={cartIcon}
                                    alt="Cart"
                                    className="cart-icon-image"
                                />

                            </span>


                            <span className="cart-label">

                                Cart

                            </span>


                            <span className="cart-number">

                                {totalCartItems}

                            </span>

                        </Link>


                        {/* =========================
                            MOBILE MENU BUTTON
                        ========================== */}

                        <button
                            type="button"
                            className="hamburger"
                            onClick={() =>
                                setMenuOpen(
                                    !menuOpen
                                )
                            }
                            aria-label="Toggle menu"
                        >

                            {
                                menuOpen
                                    ? "✕"
                                    : "☰"
                            }

                        </button>

                    </div>

                </div>

            </nav>

        </>

    );

};


export default Navbar;