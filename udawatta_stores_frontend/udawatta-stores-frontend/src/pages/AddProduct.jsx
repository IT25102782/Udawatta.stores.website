import React, {
    useState
} from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";

import "./AddProduct.css";


const AddProduct = () => {

    const navigate =
        useNavigate();


    const [product, setProduct] =
        useState({

            name: "",
            price: "",
            category: "",
            stock: "",
            image: "",
            description: ""

        });


    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleChange = (event) => {

        setProduct(
            (previous) => ({

                ...previous,

                [event.target.name]:
                event.target.value

            })
        );

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        try {

            setSaving(true);

            setError("");


            const productData = {

                ...product,

                price:
                    Number(product.price),

                stock:
                    Number(product.stock)

            };


            await axios.post(
                "http://localhost:8080/api/products",
                productData
            );


            alert(
                "Product added successfully!"
            );


            navigate(
                "/admin/products"
            );


        } catch (error) {

            console.error(
                "Error adding product:",
                error
            );

            setError(
                "Unable to add product. Please check the details and try again."
            );


        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="add-product-page">

            <div className="add-product-top">

                <div>

                    <span>
                        PRODUCT MANAGEMENT
                    </span>

                    <h1>
                        Add New Product
                    </h1>

                    <p>
                        Add a new grocery item to
                        the Udawatta Stores catalog.
                    </p>

                </div>


                <Link
                    to="/admin/products"
                    className="add-back-button"
                >
                    ← Products
                </Link>

            </div>


            <div className="add-product-layout">

                {/* FORM */}

                <form
                    className="add-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="add-form-heading">

                        <span>
                            PRODUCT INFORMATION
                        </span>

                        <h2>
                            Product Details
                        </h2>

                    </div>


                    {error && (

                        <div className="add-product-error">
                            {error}
                        </div>

                    )}


                    <div className="add-form-grid">

                        <label>

                            Product Name

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Fresh Carrots"
                                value={product.name}
                                onChange={handleChange}
                                required
                            />

                        </label>


                        <label>

                            Category

                            <input
                                type="text"
                                name="category"
                                list="product-categories"
                                placeholder="e.g. Vegetables"
                                value={product.category}
                                onChange={handleChange}
                                required
                            />

                            <datalist id="product-categories">

                                <option value="Vegetables" />
                                <option value="Fruits" />
                                <option value="Dairy" />
                                <option value="Rice & Grains" />
                                <option value="Bakery" />
                                <option value="Beverages" />

                            </datalist>

                        </label>


                        <label>

                            Price (Rs.)

                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={product.price}
                                onChange={handleChange}
                                required
                            />

                        </label>


                        <label>

                            Stock Quantity

                            <input
                                type="number"
                                name="stock"
                                min="0"
                                placeholder="0"
                                value={product.stock}
                                onChange={handleChange}
                                required
                            />

                        </label>

                    </div>


                    <label className="add-full-field">

                        Product Image URL

                        <input
                            type="text"
                            name="image"
                            placeholder="https://example.com/product.jpg"
                            value={product.image}
                            onChange={handleChange}
                            required
                        />

                        <small>
                            Enter a direct image URL.
                            Later we can replace this with
                            image upload.
                        </small>

                    </label>


                    <label className="add-full-field">

                        Description

                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Describe the product..."
                            value={
                                product.description
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </label>


                    <div className="add-form-actions">

                        <Link
                            to="/admin/products"
                            className="add-cancel-button"
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            className="add-save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving Product..."
                                : "Save Product"}

                        </button>

                    </div>

                </form>


                {/* PREVIEW */}

                <aside className="add-product-preview">

                    <span className="preview-label">
                        LIVE PREVIEW
                    </span>

                    <h2>
                        Product Preview
                    </h2>


                    <div className="preview-image">

                        {product.image ? (

                            <img
                                src={product.image}
                                alt="Product preview"
                                onError={(event) => {

                                    event.currentTarget.src =
                                        "https://placehold.co/500x400?text=Invalid+Image";

                                }}
                            />

                        ) : (

                            <div className="preview-placeholder">
                                🛒
                            </div>

                        )}

                    </div>


                    <span className="preview-category">

                        {product.category ||
                            "Category"}

                    </span>


                    <h3>

                        {product.name ||
                            "Product Name"}

                    </h3>


                    <strong className="preview-price">

                        Rs.{" "}

                        {product.price
                            ? Number(
                                product.price
                            ).toLocaleString()
                            : "0"}

                    </strong>


                    <p>

                        {product.description ||
                            "Your product description will appear here."}

                    </p>


                    <div className="preview-stock">

                        <span>
                            Stock
                        </span>

                        <strong>
                            {product.stock || 0}
                        </strong>

                    </div>

                </aside>

            </div>

        </div>

    );
};

export default AddProduct;