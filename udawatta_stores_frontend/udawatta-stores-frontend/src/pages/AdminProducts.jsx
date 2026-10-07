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


    return (

        <div className="ap-page">

            <div className="ap-top">

                <div>

                    <span>
                        ADMIN PANEL
                    </span>

                    <h1>
                        Manage Products
                    </h1>

                    <p>
                        Update product details,
                        stock levels and store inventory.
                    </p>

                </div>


                <div className="ap-top-actions">

                    <Link
                        to="/admin/dashboard"
                        className="ap-secondary-button"
                    >
                        ← Dashboard
                    </Link>

                    <Link
                        to="/admin/add-product"
                        className="ap-primary-button"
                    >
                        + Add Product
                    </Link>

                </div>

            </div>


            {/* STATS */}

            <div className="ap-stats">

                <div>
                    <span>📦</span>

                    <section>
                        <small>
                            Total Products
                        </small>

                        <strong>
                            {products.length}
                        </strong>
                    </section>
                </div>


                <div>
                    <span>🗂️</span>

                    <section>
                        <small>
                            Categories
                        </small>

                        <strong>
                            {categoryCount}
                        </strong>
                    </section>
                </div>


                <div>
                    <span>⚠️</span>

                    <section>
                        <small>
                            Low Stock
                        </small>

                        <strong>
                            {lowStockCount}
                        </strong>
                    </section>
                </div>


                <div>
                    <span>❌</span>

                    <section>
                        <small>
                            Out of Stock
                        </small>

                        <strong>
                            {outOfStockCount}
                        </strong>
                    </section>
                </div>

            </div>


            {/* PRODUCT PANEL */}

            <section className="ap-panel">

                <div className="ap-panel-header">

                    <div>

                        <span>
                            PRODUCT CATALOG
                        </span>

                        <h2>
                            All Products
                        </h2>

                    </div>


                    <div className="ap-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {error && (
                    <div className="ap-error">
                        {error}
                    </div>
                )}


                {loading ? (

                    <div className="ap-loading">

                        <div className="ap-spinner">
                        </div>

                        Loading products...

                    </div>

                ) : (

                    <div className="ap-table-wrapper">

                        <table className="ap-table">

                            <thead>

                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                            </thead>


                            <tbody>

                            {filteredProducts.map(
                                (product) => {

                                    const stock =
                                        Number(
                                            product.stock
                                        );

                                    return (

                                        <tr key={product.id}>

                                            <td>

                                                <div className="ap-product-cell">

                                                    <img
                                                        src={
                                                            product.image ||
                                                            "https://placehold.co/100x100?text=No+Image"
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        onError={(event) => {
                                                            event.currentTarget.src =
                                                                "https://placehold.co/100x100?text=No+Image";
                                                        }}
                                                    />

                                                    <div>

                                                        <strong>
                                                            {product.name}
                                                        </strong>

                                                        <small>
                                                            ID #{product.id}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {product.category}
                                            </td>


                                            <td>

                                                <strong className="ap-price">

                                                    Rs.{" "}
                                                    {formatPrice(
                                                        product.price
                                                    )}

                                                </strong>

                                            </td>


                                            <td>
                                                {stock}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        stock <= 0
                                                            ? "ap-stock ap-out"
                                                            : stock < 5
                                                                ? "ap-stock ap-low"
                                                                : "ap-stock ap-good"
                                                    }
                                                >

                                                    {stock <= 0
                                                        ? "Out of Stock"
                                                        : stock < 5
                                                            ? "Low Stock"
                                                            : "In Stock"}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="ap-actions">

                                                    <button
                                                        className="ap-edit"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="ap-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* EDIT MODAL */}

            {editingProduct && (

                <div
                    className="ap-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setEditingProduct(null);
                        }

                    }}
                >

                    <form
                        className="ap-edit-modal"
                        onSubmit={
                            handleUpdateSubmit
                        }
                    >

                        <div className="ap-modal-header">

                            <div>

                                <span>
                                    EDIT PRODUCT
                                </span>

                                <h2>
                                    {editingProduct.name}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setEditingProduct(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="ap-form-grid">

                            <label>
                                Product Name

                                <input
                                    type="text"
                                    value={
                                        editingProduct.name
                                    }
                                    onChange={(event) =>
                                        updateEditField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>


                            <label>
                                Category

                                <input
                                    type="text"
                                    value={
                                        editingProduct.category
                                    }
                                    onChange={(event) =>
                                        updateEditField(
                                            "category",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>


                            <label>
                                Price (Rs.)

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editingProduct.price
                                    }
                                    onChange={(event) =>
                                        updateEditField(
                                            "price",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>


                            <label>
                                Stock

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        editingProduct.stock
                                    }
                                    onChange={(event) =>
                                        updateEditField(
                                            "stock",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>

                        </div>


                        <label className="ap-full-field">

                            Image URL

                            <input
                                type="text"
                                value={
                                    editingProduct.image ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateEditField(
                                        "image",
                                        event.target.value
                                    )
                                }
                            />

                        </label>


                        <label className="ap-full-field">

                            Description

                            <textarea
                                rows="4"
                                value={
                                    editingProduct.description ||
                                    ""
                                }
                                onChange={(event) =>
                                    updateEditField(
                                        "description",
                                        event.target.value
                                    )
                                }
                            />

                        </label>


                        <div className="ap-modal-buttons">

                            <button
                                type="button"
                                className="ap-cancel"
                                onClick={() =>
                                    setEditingProduct(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="ap-save"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            )}

        </div>

    );
};

export default AdminProducts;