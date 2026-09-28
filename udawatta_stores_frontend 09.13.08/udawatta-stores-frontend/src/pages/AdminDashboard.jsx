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


    return null;
};

export default AdminDashboard;
