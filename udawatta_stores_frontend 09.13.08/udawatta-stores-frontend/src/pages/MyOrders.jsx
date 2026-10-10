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

                    </div>
                )}


                {/* EMPTY ORDERS */}

                {!error &&
                orders.length === 0 ? (

                    <div className="my-orders-empty">

                        <div className="empty-orders-icon">
                            📦
                        </div>

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            You haven't placed any
                            orders with Udawatta Stores yet.
                        </p>

                        <Link
                            to="/products"
                            className="orders-shop-button"
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (

                    !error && (

                        <>

                            {/* TOP ROW */}

                            <div className="orders-top-row">

                                <div>

                                    <span>
                                        YOUR PURCHASES
                                    </span>

                                    <h2>
                                        Recent Orders
                                    </h2>

                                </div>


                                <strong>

                                    {orders.length}{" "}

                                    {orders.length === 1
                                        ? "Order"
                                        : "Orders"}

                                </strong>

                            </div>


                            {/* ORDERS */}

                            <div className="modern-orders-list">

                                {orders.map(
                                    (order) => (

                                        <article
                                            className="modern-order-card"
                                            key={order.id}
                                        >


                                            {/* HEADER */}

                                            <div className="modern-order-header">

                                                <div>

                                                    <span className="order-number-label">
                                                        ORDER NUMBER
                                                    </span>

                                                    <h3>
                                                        #{order.id}
                                                    </h3>

                                                </div>


                                                <span
                                                    className={
                                                        `modern-order-status ${getStatusClass(
                                                            order.status
                                                        )}`
                                                    }
                                                >
                                                    {
                                                        order.status ||
                                                        "PENDING"
                                                    }
                                                </span>

                                            </div>


                                            {/* DETAILS */}

                                            <div className="order-detail-grid">


                                                {/* ITEMS */}

                                                <div className="order-detail-block">

                                                    <span>
                                                        📦 Items
                                                    </span>

                                                    <p>
                                                        {
                                                            order.orderItems ||
                                                            "No items available"
                                                        }
                                                    </p>

                                                </div>


                                                {/* ADDRESS */}

                                                <div className="order-detail-block">

                                                    <span>
                                                        📍 Delivery Address
                                                    </span>

                                                    <p>

                                                        {
                                                            order.address ||
                                                            "N/A"
                                                        }

                                                        {
                                                            order.postalCode &&
                                                            `, ${order.postalCode}`
                                                        }

                                                    </p>

                                                </div>


                                                {/* CONTACT */}

                                                <div className="order-detail-block">

                                                    <span>
                                                        📞 Contact
                                                    </span>

                                                    <p>
                                                        {
                                                            order.phone ||
                                                            "N/A"
                                                        }
                                                    </p>

                                                </div>


                                                {/* DATE */}

                                                <div className="order-detail-block">

                                                    <span>
                                                        🕒 Order Date
                                                    </span>

                                                    <p>
                                                        {
                                                            formatDate(
                                                                order.orderDate
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* FOOTER */}

                                            <div className="modern-order-footer">

                                                <div>

                                                    <span>
                                                        Order Total
                                                    </span>

                                                    <strong>

                                                        Rs.{" "}

                                                        {
                                                            formatPrice(
                                                                order.totalAmount
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                                <Link
                                                    to="/products"
                                                    className="order-again-link"
                                                >
                                                    Shop Again →
                                                </Link>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>

                        </>

                    )

                )}

            </section>

        </div>
    );
};


export default MyOrders;