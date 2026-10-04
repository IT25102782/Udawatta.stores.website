import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import "./AdminOrders.css";


const AdminOrders = () => {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // FETCH ORDERS
    // ==========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await axios.get(
                    "http://localhost:8080/api/orders"
                );


            setOrders(response.data);


        } catch (error) {

            console.error(
                "Error fetching orders:",
                error
            );


            setError(
                "Unable to load customer orders."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrders();

    }, []);


    // ==========================================
    // HELPERS
    // ==========================================

    const formatPrice = (value) => {

        return Number(
            value || 0
        ).toLocaleString();

    };


    const formatDate = (value) => {

        if (!value) {
            return "Not available";
        }


        return new Date(
            value
        ).toLocaleString();

    };


    // ==========================================
    // STATS
    // ==========================================

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            (order) =>
                order.status === "PENDING"
        ).length;


    const shippedOrders =
        orders.filter(
            (order) =>
                order.status === "SHIPPED"
        ).length;


    const deliveredOrders =
        orders.filter(
            (order) =>
                order.status === "DELIVERED"
        ).length;


    return (

        <div className="modern-admin-orders">

            {/* ======================================
                PAGE HEADER
            ====================================== */}

            <div className="admin-orders-top">

                <div>

                    <span>
                        ORDER MANAGEMENT
                    </span>

                    <h1>
                        Customer Orders
                    </h1>

                    <p>
                        Review customer orders and
                        update their delivery status.
                    </p>

                </div>


                <Link
                    to="/admin/dashboard"
                    className="admin-dashboard-button"
                >
                    Back to Dashboard
                </Link>

            </div>


            {/* ======================================
                ORDER STATS
            ====================================== */}

            <div className="admin-order-stats">

                <div className="admin-stat-card">

                    <div>

                        <small>
                            Total Orders
                        </small>

                        <strong>
                            {totalOrders}
                        </strong>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div>

                        <small>
                            Pending
                        </small>

                        <strong>
                            {pendingOrders}
                        </strong>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div>

                        <small>
                            Shipped
                        </small>

                        <strong>
                            {shippedOrders}
                        </strong>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div>

                        <small>
                            Delivered
                        </small>

                        <strong>
                            {deliveredOrders}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ======================================
                ORDERS SECTION
            ====================================== */}

            <div className="admin-orders-section">

                <div className="admin-orders-section-header">

                    <div>

                        <span>
                            ALL ORDERS
                        </span>

                        <h2>
                            Manage Customer Orders
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={fetchOrders}
                    >
                        Refresh
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="admin-orders-error">
                        {error}
                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="admin-orders-loading">

                        <div className="admin-loading-spinner" />

                        <p>
                            Loading orders...
                        </p>

                    </div>

                ) : (

                    <div className="modern-orders-table-wrapper">

                        <table className="modern-orders-table">

                            <thead>

                            <tr>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Address
                                </th>

                                <th>
                                    Order Items
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {orders.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="admin-no-orders"
                                    >
                                        No customer orders found.
                                    </td>

                                </tr>

                            ) : (

                                orders.map((order) => (

                                    <tr key={order.id}>

                                        {/* ORDER ID */}

                                        <td>

                                            <strong className="admin-order-id">
                                                #{order.id}
                                            </strong>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="admin-customer-info">

                                                <strong>
                                                    {order.customerName}
                                                </strong>

                                                <span>
                                                    {order.phone}
                                                </span>

                                            </div>

                                        </td>


                                        {/* ADDRESS */}

                                        <td>

                                            <div className="admin-address">

                                                {order.address}

                                                {order.postalCode && (

                                                    <span>
                                                        Postal Code:{" "}
                                                        {order.postalCode}
                                                    </span>

                                                )}

                                            </div>

                                        </td>


                                        {/* ITEMS */}

                                        <td>

                                            <div className="admin-order-items">
                                                {order.orderItems}
                                            </div>

                                        </td>


                                        {/* TOTAL */}

                                        <td>

                                            <strong className="admin-order-total">

                                                Rs.{" "}
                                                {formatPrice(
                                                    order.totalAmount
                                                )}

                                            </strong>

                                        </td>


                                        {/* PAYMENT */}

                                        <td>

                                            <div className="admin-customer-info">

                                                <strong>
                                                    {order.paymentMethod ||
                                                        "COD"}
                                                </strong>

                                                <span>
                                                    {order.paymentStatus ||
                                                        "PENDING"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    `admin-status-badge ${
                                                        order.status
                                                            ? order.status.toLowerCase()
                                                            : "pending"
                                                    }`
                                                }
                                            >

                                                {order.status ||
                                                    "PENDING"}

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="admin-order-date">

                                                {formatDate(
                                                    order.orderDate
                                                )}

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <div className="admin-order-actions">


                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default AdminOrders;