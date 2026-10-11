import React, {
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    AuthContext
} from "../context/AuthContext";

import "./MyOrders.css";


const MyOrders = () => {

    const {
        user,
        token
    } = useContext(AuthContext);


    const navigate =
        useNavigate();


    const [orders, setOrders] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD LOGGED-IN USER'S ORDERS
    // =========================================================

    useEffect(() => {

        if (!user) {

            navigate(
                "/login"
            );

            return;
        }


        if (!token) {
            return;
        }


        const fetchOrders =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const response =
                        await axios.get(
                            "http://localhost:8080/api/orders/my-orders",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                    setOrders(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "Error loading orders:",
                        error
                    );


                    if (
                        error.response?.status === 401
                    ) {

                        setError(
                            "Your session has expired. Please login again."
                        );

                    } else if (
                        error.response?.status === 403
                    ) {

                        setError(
                            "You are not allowed to view these orders."
                        );

                    } else {

                        setError(
                            "Unable to load your orders."
                        );
                    }

                } finally {

                    setLoading(false);
                }
            };


        fetchOrders();

    }, [
        user,
        token,
        navigate
    ]);


    // =========================================================
    // FORMAT PRICE
    // =========================================================

    const formatPrice = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString();
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "N/A";
        }


        return new Date(
            date
        ).toLocaleString();
    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {

        if (!status) {
            return "pending";
        }


        return status
            .toLowerCase();
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="my-orders-page">

                <div className="orders-loading">

                    <div className="orders-spinner">
                    </div>

                    <p>
                        Loading your orders...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="my-orders-page">


            {/* PAGE HEADER */}

            <section className="my-orders-header">

                <span>
                    ORDER HISTORY
                </span>

                <h1>
                    My Orders
                </h1>

                <p>
                    Track your previous orders
                    and view delivery information.
                </p>

            </section>


            <section className="my-orders-content">


                {/* ERROR */}

                {error && (

                    <div className="orders-error">

                        {error}

