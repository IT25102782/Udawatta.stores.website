import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import "./AdminProducts.css";


const AdminProducts = () => {

    const [products, setProducts] =
        useState([]);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);


    useEffect(() => {

        fetchProducts();

    }, []);


    const fetchProducts = () => {

        setLoading(true);

        axios
            .get(
                "http://localhost:8080/api/products"
            )
            .then((response) => {

                setProducts(response.data);

                setError("");

            })
            .catch((error) => {

                console.error(
                    "Error fetching products:",
                    error
                );

                setError(
                    "Unable to load products."
                );

            })
            .finally(() => {

                setLoading(false);

            });
    };


    const filteredProducts =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!search) {
                return products;
            }

            return products.filter(
                (product) =>
                    product.name
                        ?.toLowerCase()
                        .includes(search) ||
                    product.category
                        ?.toLowerCase()
                        .includes(search)
            );

        }, [products, searchTerm]);


    const lowStockCount =
        products.filter(
            (product) =>
                Number(product.stock) < 5 &&
                Number(product.stock) > 0
        ).length;


    const outOfStockCount =
        products.filter(
            (product) =>
                Number(product.stock) <= 0
        ).length;


    const categoryCount =
        new Set(
            products
                .map(
                    (product) =>
                        product.category
                )
                .filter(Boolean)
        ).size;


    const handleDelete = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this product?"
            )
        ) {
            return;
        }

        axios
            .delete(
                `http://localhost:8080/api/products/${id}`
            )
            .then(() => {

                fetchProducts();

            })
            .catch((error) => {

                console.error(
                    "Error deleting product:",
                    error
                );

                alert(
                    "Unable to delete product."
                );

            });
    };


    const handleEditClick = (product) => {

        setEditingProduct({
            ...product
        });

    };


    const updateEditField = (
        field,
        value
    ) => {

        setEditingProduct(
            (previous) => ({
                ...previous,
                [field]: value
            })
        );
    };


    const handleUpdateSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            const updatedProduct = {
                ...editingProduct,
                price:
                    Number(
                        editingProduct.price
                    ),
                stock:
                    Number(
                        editingProduct.stock
                    )
            };


            await axios.put(
                `http://localhost:8080/api/products/${editingProduct.id}`,
                updatedProduct
            );


            setEditingProduct(null);

            fetchProducts();

        } catch (error) {

            console.error(
                "Error updating product:",
                error
            );

            alert(
                "Unable to update product."
            );

        } finally {

            setSaving(false);

        }
    };


    const formatPrice = (value) =>
        Number(value || 0)
            .toLocaleString();


    return null;
};

export default AdminProducts;
