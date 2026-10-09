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


    return null;
};

export default MyOrders;
