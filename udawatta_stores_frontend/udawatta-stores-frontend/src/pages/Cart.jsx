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

                                <article
                                    className="modern-cart-item"
                                    key={item.id}
                                >

                                    {/* Product image */}

                                    <Link
                                        to={`/products/${item.id}`}
                                        className="cart-product-image"
                                    >
                                        <img
                                            src={
                                                item.image ||
                                                "https://placehold.co/300x300?text=No+Image"
                                            }
                                            alt={item.name}
                                            onError={(event) => {
                                                event.currentTarget.src =
                                                    "https://placehold.co/300x300?text=No+Image";
                                            }}
                                        />
                                    </Link>


                                    {/* Product information */}

                                    <div className="cart-product-info">

                                        <span className="cart-product-category">
                                            {item.category || "Product"}
                                        </span>

                                        <Link
                                            to={`/products/${item.id}`}
                                            className="cart-product-name"
                                        >
                                            {item.name}
                                        </Link>

                                        <div className="cart-item-mobile-price">
                                            Rs. {formatPrice(item.price)}
                                        </div>

                                        <div className="cart-product-meta">

                                            <div>
                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {item.quantity}
                                                </strong>
                                            </div>

                                            {item.stock !== undefined && (
                                                <div>
                                                    <span>
                                                        Stock
                                                    </span>

                                                    <strong>
                                                        {item.stock}
                                                    </strong>
                                                </div>
                                            )}

                                        </div>


                                        <button
                                            className="cart-remove-button"
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    {/* Price */}

                                    <div className="cart-item-price">

                                        <span>
                                            Rs. {formatPrice(item.price)}
                                        </span>

                                        <strong>
                                            Rs.{" "}
                                            {formatPrice(
                                                Number(item.price) *
                                                Number(item.quantity)
                                            )}
                                        </strong>

                                        <small>
                                            subtotal
                                        </small>

                                    </div>

                                </article>

                            ))}

                        </div>


                        <Link
                            to="/products"
                            className="back-shopping-link"
                        >
                            ← Continue Shopping
                        </Link>

                    </div>


                    {/* ===============================
                        ORDER SUMMARY
                    =============================== */}

                    <aside className="cart-summary-card">

                        <span className="summary-label">
                            ORDER SUMMARY
                        </span>

                        <h2>
                            Your Total
                        </h2>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                Rs. {formatPrice(getCartTotal())}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Delivery
                            </span>

                            <strong className="free-delivery">
                                FREE
                            </strong>

                        </div>


                        <div className="summary-divider">
                        </div>


                        <div className="summary-total">

                            <div>
                                <span>
                                    Total
                                </span>

                                <small>
                                    Including all items
                                </small>
                            </div>

                            <strong>
                                Rs. {formatPrice(getCartTotal())}
                            </strong>

                        </div>


                        <button
                            className="checkout-button"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >
                            Proceed to Checkout
                            <span>→</span>
                        </button>


                        <div className="cart-secure-note">

                            <span>
                                🔒
                            </span>

                            <p>
                                Secure and convenient
                                checkout
                            </p>

                        </div>


                        <div className="cart-summary-benefits">

                            <p>
                                ✓ Fresh quality products
                            </p>

                            <p>
                                ✓ Fast delivery
                            </p>

                            <p>
                                ✓ Easy order tracking
                            </p>

                        </div>

                    </aside>

                </section>

            )}

        </div>
    );
};

export default Cart;