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


    return null;
};

export default AdminOrders;
