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

