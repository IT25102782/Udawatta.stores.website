import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";

import "./Cart.css";

const Cart = () => {

    const {
        cartItems,
        removeFromCart,
        getCartTotal
    } = useContext(CartContext);

    const navigate = useNavigate();

    const formatPrice = (value) => {
        return Number(value || 0).toLocaleString();
    };

    return (
        <div className="cart-page">

            {/* ===============================
                PAGE HEADER
            =============================== */}

            <section className="cart-page-header">

                <span>
                    YOUR SHOPPING BAG
                </span>

                <h1>
                    Shopping Cart
                </h1>

                <p>
                    Review your selected products before
                    continuing to checkout.
                </p>

            </section>


            {/* ===============================
                EMPTY CART
            =============================== */}

            {cartItems.length === 0 ? (

                <section className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="continue-shopping-button"
                    >
                        Start Shopping
                    </Link>

                </section>

            ) : (

                <section className="cart-layout">

                    {/* ===============================
                        CART ITEMS
                    =============================== */}

                    <div className="cart-items-section">

                        <div className="cart-section-title">

                            <div>
                                <span>
                                    YOUR PRODUCTS
                                </span>

                                <h2>
                                    Cart Items
                                </h2>
                            </div>

                            <strong>
                                {cartItems.reduce(
                                    (total, item) =>
                                        total +
                                        Number(item.quantity || 0),
                                    0
                                )}{" "}
                                items
                            </strong>

                        </div>


                        <div className="cart-items-list">

                            {cartItems.map((item) => (

