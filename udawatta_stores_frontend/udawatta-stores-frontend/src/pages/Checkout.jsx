import React, {
    useContext,
    useState
} from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import "./Checkout.css";


const Checkout = () => {

    const {
        getCartTotal,
        clearCart,
        cartItems
    } = useContext(CartContext);

    const { user } =
        useContext(AuthContext);

    const navigate =
        useNavigate();


    const [submitting, setSubmitting] =
        useState(false);


    // For now only COD is available locally
    const [paymentMethod] =
        useState("COD");


    const [customerInfo, setCustomerInfo] =
        useState({

            customerName: "",
            address: "",
            postalCode: "",
            phone: ""

        });


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleInputChange = (event) => {

        setCustomerInfo({

            ...customerInfo,

            [event.target.name]:
            event.target.value

        });
    };


    // ==========================================
    // PRICE FORMAT
    // ==========================================

    const formatPrice = (value) => {

        return Number(
            value || 0
        ).toLocaleString();

    };


    // ==========================================
    // PLACE ORDER
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // User must login
        if (!user) {

            alert(
                "Please login before placing an order."
            );

            navigate("/login");

            return;
        }


        // Cart must contain products
        if (cartItems.length === 0) {

            alert(
                "Your cart is empty."
            );

            navigate("/products");

            return;
        }


        // Convert cart items to string
        const itemsString = cartItems
            .map(
                (item) =>
                    `${item.name} (x${item.quantity})`
            )
            .join(", ");


        // Order data sent to backend
        const orderData = {

            customerName:
            customerInfo.customerName,

            address:
            customerInfo.address,

            postalCode:
            customerInfo.postalCode,

            phone:
            customerInfo.phone,

            totalAmount:
                getCartTotal(),

            orderItems:
            itemsString,

            userId:
            user.id,

            // Payment information
            paymentMethod:
            paymentMethod,

            paymentStatus:
                "PENDING",

            paymentId:
                null
        };


        try {

            setSubmitting(true);


            // Save order
            await axios.post(
                "http://localhost:8080/api/orders",
                orderData
            );


            alert(
                "Order placed successfully! You can pay when your order is delivered."
            );


            // Clear cart after successful order
            clearCart();


            // Go to customer order history
            navigate("/my-orders");


        } catch (error) {

            console.error(
                "Error placing order:",
                error
            );

            const backendMessage =
                error.response?.data?.message;

            alert(
                backendMessage ||
                "Failed to place the order. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="modern-checkout-page">

            {/* ==============================
                PAGE HEADER
            ============================== */}

            <section className="checkout-page-header">

                <span>
                    FINAL STEP
                </span>

                <h1>
                    Checkout
                </h1>

                <p>
                    Enter your delivery information,
                    review your order and place your order.
                </p>

            </section>


            <section className="checkout-layout">

                {/* ==============================
                    CHECKOUT FORM
                ============================== */}

                <div className="checkout-form-card">

                    <div className="checkout-card-heading">

                        <span>
                            DELIVERY DETAILS
                        </span>

                        <h2>
                            Where should we deliver?
                        </h2>

                        <p>
                            Please enter accurate information
                            so we can deliver your order.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="modern-checkout-form"
                    >

                        {/* FULL NAME */}

                        <div className="checkout-form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="customerName"
                                value={
                                    customerInfo.customerName
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                                placeholder="Enter your full name"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="checkout-form-group">

                            <label>
                                Delivery Address
                            </label>

                            <textarea
                                name="address"
                                value={
                                    customerInfo.address
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                                placeholder="House number, street, city..."
                                rows="4"
                            />

                        </div>


                        {/* POSTAL CODE + PHONE */}

                        <div className="checkout-input-row">

                            <div className="checkout-form-group">

                                <label>
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    name="postalCode"
                                    value={
                                        customerInfo.postalCode
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    required
                                    placeholder="Postal code"
                                />

                            </div>


                            <div className="checkout-form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        customerInfo.phone
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    required
                                    placeholder="077 123 4567"
                                />

                            </div>

                        </div>


                        {/* ==============================
                            PAYMENT METHOD
                        ============================== */}

                        <div className="checkout-payment-section">

                            <div className="checkout-payment-heading">

                                <span>
                                    PAYMENT
                                </span>

                                <h3>
                                    Choose payment method
                                </h3>

                            </div>


                            {/* COD - ACTIVE */}

                            <label
                                className="
                                    payment-method-card
                                    payment-method-active
                                "
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked
                                    readOnly
                                />

                                <div className="payment-method-info">

                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <span>
                                        Pay when your groceries
                                        are delivered.
                                    </span>

                                </div>

                            </label>


                            {/* ONLINE PAYMENT - DISABLED */}

                            <label
                                className="
                                    payment-method-card
                                    payment-method-disabled
                                "
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ONLINE"
                                    disabled
                                />

                                <div className="payment-method-info">

                                    <strong>
                                        Pay Online with PayHere
                                    </strong>

                                    <span>
                                        Available after website deployment.
                                    </span>

                                </div>


