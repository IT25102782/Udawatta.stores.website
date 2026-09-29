import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import "./AdminDashboard.css";


const AdminDashboard = () => {

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                const [
                    productsResponse,
                    ordersResponse
                ] = await Promise.all([
                    axios.get(
                        "http://localhost:8080/api/products"
                    ),
                    axios.get(
                        "http://localhost:8080/api/orders"
                    )
                ]);

                setProducts(productsResponse.data);
                setOrders(ordersResponse.data);

                setError("");

            } catch (error) {

                console.error(
                    "Error loading dashboard:",
                    error
                );

                setError(
                    "Unable to load dashboard information."
                );

            } finally {

                setLoading(false);

            }
        };


        loadDashboard();

    }, []);


    const stats = useMemo(() => {

        const lowStock =
            products.filter(
                (product) =>
                    Number(product.stock) < 5 &&
                    Number(product.stock) > 0
            ).length;

        const outOfStock =
            products.filter(
                (product) =>
                    Number(product.stock) <= 0
            ).length;

        const pendingOrders =
            orders.filter(
                (order) =>
                    order.status === "PENDING"
            ).length;

        const totalInventory =
            products.reduce(
                (total, product) =>
                    total +
                    Number(product.stock || 0),
                0
            );

        return {
            totalProducts: products.length,
            totalOrders: orders.length,
            pendingOrders,
            lowStock,
            outOfStock,
            totalInventory
        };

    }, [products, orders]);


    const recentOrders = useMemo(() => {

        return [...orders]
            .sort((a, b) => {

                const dateA =
                    a.orderDate
                        ? new Date(a.orderDate)
                        : new Date(0);

                const dateB =
                    b.orderDate
                        ? new Date(b.orderDate)
                        : new Date(0);

                return dateB - dateA;

            })
            .slice(0, 5);

    }, [orders]);


    const formatPrice = (value) =>
        Number(value || 0).toLocaleString();


    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date)
            .toLocaleDateString();

    };


    return (

        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-brand">

                    <div className="dashboard-brand-icon">
                        U
                    </div>

                    <div>
                        <h2>
                            Udawatta
                        </h2>

                        <span>
                            Admin Panel
                        </span>
                    </div>

                </div>


                <nav className="dashboard-nav">

                    <Link
                        to="/admin/dashboard"
                        className="dashboard-nav-active"
                    >
                        <span>▦</span>
                        Dashboard
                    </Link>

                    <Link to="/admin/products">
                        <span>📦</span>
                        Products
                    </Link>

                    <Link to="/admin/add-product">
                        <span>＋</span>
                        Add Product
                    </Link>

                    <Link to="/admin/orders">
                        <span>🧾</span>
                        Orders
                    </Link>

                </nav>


                <div className="dashboard-sidebar-bottom">

                    <Link to="/">
                        ← Back to Store
                    </Link>

                </div>

            </aside>


            {/* MAIN */}

            <main className="dashboard-main">

                <header className="dashboard-topbar">

                    <div>

                        <span>
                            ADMIN OVERVIEW
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back. Here's what is
                            happening at Udawatta Stores.
                        </p>

                    </div>

                    <Link
                        to="/admin/add-product"
                        className="dashboard-add-button"
                    >
                        + Add Product
                    </Link>

                </header>


                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}


                {loading ? (

                    <div className="dashboard-loading">

                        <div className="dashboard-spinner">
                        </div>

                        <p>
                            Loading dashboard...
                        </p>

                    </div>

                ) : (

                    <>

                        {/* STAT CARDS */}

                        <section className="dashboard-stats">

                            <div className="dashboard-stat-card">

                                <div className="dashboard-stat-icon">
                                    📦
                                </div>

                                <div>
                                    <span>
                                        Total Products
                                    </span>

                                    <strong>
                                        {stats.totalProducts}
                                    </strong>

                                    <small>
                                        Products in catalog
                                    </small>
                                </div>

                            </div>


                            <div className="dashboard-stat-card">

                                <div className="dashboard-stat-icon">
                                    🧾
                                </div>

                                <div>
                                    <span>
                                        Total Orders
                                    </span>

                                    <strong>
                                        {stats.totalOrders}
                                    </strong>

                                    <small>
                                        Customer orders
                                    </small>
                                </div>

                            </div>


                            <div className="dashboard-stat-card">

                                <div className="dashboard-stat-icon">
                                    ⏳
                                </div>

                                <div>
                                    <span>
                                        Pending Orders
                                    </span>

                                    <strong>
                                        {stats.pendingOrders}
                                    </strong>

                                    <small>
                                        Need attention
                                    </small>
                                </div>

                            </div>


                            <div className="dashboard-stat-card">

                                <div className="dashboard-stat-icon">
                                    ⚠️
                                </div>

                                <div>
                                    <span>
                                        Low Stock
                                    </span>

                                    <strong>
                                        {stats.lowStock}
                                    </strong>

                                    <small>
                                        Less than 5 units
                                    </small>
                                </div>

                            </div>

                        </section>


                        {/* SECOND ROW */}

                        <section className="dashboard-middle-grid">

                            <div className="dashboard-panel">

                                <div className="dashboard-panel-header">

                                    <div>
                                        <span>
                                            INVENTORY
                                        </span>

                                        <h2>
                                            Stock Overview
                                        </h2>
                                    </div>

                                    <Link to="/admin/products">
                                        Manage →
                                    </Link>

                                </div>


                                <div className="inventory-overview">

                                    <div>

                                        <strong>
                                            {stats.totalInventory}
                                        </strong>

                                        <span>
                                            Total Units
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {stats.lowStock}
                                        </strong>

                                        <span>
                                            Low Stock
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {stats.outOfStock}
                                        </strong>

                                        <span>
                                            Out of Stock
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div className="dashboard-panel">

                                <div className="dashboard-panel-header">

                                    <div>
                                        <span>
                                            QUICK ACTIONS
                                        </span>

                                        <h2>
                                            Manage Store
                                        </h2>
                                    </div>

                                </div>


                                <div className="dashboard-quick-actions">

                                    <Link to="/admin/add-product">
                                        <span>＋</span>

                                        <div>
                                            <strong>
                                                Add Product
                                            </strong>

                                            <small>
                                                Create a new product
                                            </small>
                                        </div>
                                    </Link>


                                    <Link to="/admin/products">
                                        <span>✎</span>

                                        <div>
                                            <strong>
                                                Manage Products
                                            </strong>

                                            <small>
                                                Edit stock and details
                                            </small>
                                        </div>
                                    </Link>


                                    <Link to="/admin/orders">
                                        <span>🧾</span>

                                        <div>
                                            <strong>
                                                Manage Orders
                                            </strong>

                                            <small>
                                                Update order status
                                            </small>
                                        </div>
                                    </Link>

                                </div>

                            </div>

                        </section>



                    </>

                )}

            </main>

        </div>

    );
};

export default AdminDashboard;