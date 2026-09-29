import React, {
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import { CartContext } from "../context/CartContext";

import "./Products.css";


const Products = () => {

    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext);

    useEffect(() => {

        AOS.init({
            duration: 700,
            once: true,
            offset: 50
        });

        axios
            .get("http://localhost:8080/api/products")
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Error fetching products:",
                    error
                );

                setLoading(false);
            });

    }, []);


    /* ======================================
       CATEGORIES
    ====================================== */

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            )
        ];

        return ["All", ...uniqueCategories];

    }, [products]);


    /* ======================================
       FILTER + SEARCH + SORT
    ====================================== */

    const filteredProducts = useMemo(() => {

        let result = [...products];

        if (selectedCategory !== "All") {

            result = result.filter(
                (product) =>
                    product.category === selectedCategory
            );
        }

        if (searchTerm.trim() !== "") {

            const search =
                searchTerm.toLowerCase();

            result = result.filter(
                (product) =>
                    product.name
                        ?.toLowerCase()
                        .includes(search) ||

                    product.category
                        ?.toLowerCase()
                        .includes(search)
            );
        }

        if (sortOption === "price-low") {

            result.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

        } else if (
            sortOption === "price-high"
        ) {

            result.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

        } else if (
            sortOption === "name"
        ) {

            result.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
        }

        return result;

    }, [
        products,
        selectedCategory,
        searchTerm,
        sortOption
    ]);


    /* ======================================
       QUANTITY
    ====================================== */

    const getQuantity = (productId) => {
        return quantities[productId] || 1;
    };


    const handleQuantityChange = (
        productId,
        newQuantity,
        stock
    ) => {

        let quantity =
            parseInt(newQuantity);

        if (
            Number.isNaN(quantity) ||
            quantity < 1
        ) {
            quantity = 1;
        }

        if (quantity > stock) {
            quantity = stock;
        }

        setQuantities((previous) => ({
            ...previous,
            [productId]: quantity
        }));
    };


    /* ======================================
       ADD TO CART
    ====================================== */

    const handleAddToCart = (product) => {

        const quantity =
            getQuantity(product.id);

        addToCart(
            product,
            quantity
        );

        setQuantities((previous) => ({
            ...previous,
            [product.id]: 1
        }));
    };


    /* ======================================
       STOCK
    ====================================== */

    const getStockStatus = (stock) => {

        if (stock <= 0) {
            return {
                text: "Out of Stock",
                className: "stock-out"
            };
        }

        if (stock <= 5) {
            return {
                text: "Low Stock",
                className: "stock-low"
            };
        }

        return {
            text: "In Stock",
            className: "stock-in"
        };
    };


    return (

        <div className="products-page">

            {/* ======================================
                PAGE HERO
            ====================================== */}

            <section className="products-header">

                <div
                    className="products-header-content"
                    data-aos="fade-up"
                >

                    <span className="products-eyebrow">
                        FRESH EVERYDAY
                    </span>

                    <h1>
                        Shop Fresh Products
                    </h1>

                    <p>
                        Discover fresh groceries,
                        everyday essentials and quality
                        products for your family.
                    </p>

                </div>

            </section>


            {/* ======================================
                FILTER AREA
            ====================================== */}

            <section className="products-filter-section">

                <div className="products-toolbar">

                    <div className="products-search">

                        <span className="search-icon">
                            🔍
                        </span>

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


                    <select
                        className="products-sort"
                        value={sortOption}
                        onChange={(event) =>
                            setSortOption(
                                event.target.value
                            )
                        }
                    >
                        <option value="default">
                            Sort By
                        </option>

                        <option value="price-low">
                            Price: Low to High
                        </option>

                        <option value="price-high">
                            Price: High to Low
                        </option>

                        <option value="name">
                            Name A-Z
                        </option>

                    </select>

                </div>


                {/* Category filter */}

                <div className="category-filter">

                    {categories.map(
                        (category) => (

                            <button
                                key={category}
                                className={
                                    selectedCategory ===
                                    category
                                        ? "category-filter-button active"
                                        : "category-filter-button"
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }
                            >
                                {category}
                            </button>

                        )
                    )}

                </div>


                <div className="products-result-info">

                    <p>
                        Showing{" "}
                        <strong>
                            {
                                filteredProducts.length
                            }
                        </strong>{" "}
                        products
                    </p>

                </div>

            </section>


            {/* ======================================
                PRODUCTS
            ====================================== */}

            <section className="products-content">

                {loading ? (

                    <div className="products-loading">

                        <div className="loading-spinner">
                        </div>

                        <p>
                            Loading fresh products...
                        </p>

                    </div>

                ) : filteredProducts.length === 0 ? (

                    <div className="no-products">

                        <div className="no-products-icon">
                            🛒
                        </div>

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Try another category
                            or search term.
                        </p>

                    </div>

                ) : (

                    <div className="products-grid">

                        {filteredProducts.map(
                            (product, index) => {

                                const quantity =
                                    getQuantity(
                                        product.id
                                    );

                                const stockStatus =
                                    getStockStatus(
                                        product.stock
                                    );

                                return (

                                    <article
                                        className="product-card"
                                        key={product.id}
                                        data-aos="fade-up"
                                        data-aos-delay={
                                            Math.min(
                                                index * 50,
                                                300
                                            )
                                        }
                                    >

                                        {/* Product image */}

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="product-image-area"
                                        >
                                            <span
                                                className={`stock-badge ${stockStatus.className}`}
                                            >
                                                {stockStatus.text}
                                            </span>

                                            <img
                                                src={
                                                    product.image ||
                                                    "https://placehold.co/500x500?text=No+Image"
                                                }
                                                alt={product.name}
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        "https://placehold.co/500x500?text=No+Image";
                                                }}
                                            />

                                        </Link>


                                        {/* Product information */}

                                        <div className="product-info">

                                            <span className="product-category">
                                                {
                                                    product.category
                                                }
                                            </span>

                                            <h3>
                                                {
                                                    product.name
                                                }
                                            </h3>


                                            {product.description && (

                                                <p className="product-description">

                                                    {
                                                        product.description
                                                    }

                                                </p>

                                            )}


                                            <div className="product-price-row">

                                                <div>

                                                    <span className="price-label">
                                                        Price
                                                    </span>

                                                    <strong className="product-price">
                                                        Rs.{" "}
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString()}
                                                    </strong>

                                                </div>

                                                <span className="stock-count">
                                                    {
                                                        product.stock
                                                    }{" "}
                                                    available
                                                </span>

                                            </div>


                                            {/* Quantity */}

                                            {product.stock > 0 && (

                                                <div className="quantity-selector">

                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                product.id,
                                                                quantity -
                                                                1,
                                                                product.stock
                                                            )
                                                        }
                                                        disabled={
                                                            quantity <=
                                                            1
                                                        }
                                                    >
                                                        −
                                                    </button>


                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            product.stock
                                                        }
                                                        value={
                                                            quantity
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleQuantityChange(
                                                                product.id,
                                                                event
                                                                    .target
                                                                    .value,
                                                                product.stock
                                                            )
                                                        }
                                                    />


                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                product.id,
                                                                quantity +
                                                                1,
                                                                product.stock
                                                            )
                                                        }
                                                        disabled={
                                                            quantity >=
                                                            product.stock
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            )}


                                            {/* Add cart */}

                                            <button
                                                className="product-cart-button"
                                                disabled={
                                                    product.stock <=
                                                    0
                                                }
                                                onClick={() =>
                                                    handleAddToCart(
                                                        product
                                                    )
                                                }
                                            >

                                                <span>
                                                    🛒
                                                </span>

                                                {product.stock >
                                                0
                                                    ? "Add to Cart"
                                                    : "Out of Stock"}

                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </section>


            {/* ======================================
                DELIVERY INFO
            ====================================== */}

            <section className="products-service-bar">

                <div>
                    <span>🚚</span>

                    <div>
                        <strong>
                            Fast Delivery
                        </strong>

                        <p>
                            Convenient delivery
                            to your doorstep
                        </p>
                    </div>
                </div>


                <div>
                    <span>🌿</span>

                    <div>
                        <strong>
                            Fresh Products
                        </strong>

                        <p>
                            Quality products
                            selected daily
                        </p>
                    </div>
                </div>


                <div>
                    <span>💰</span>

                    <div>
                        <strong>
                            Great Prices
                        </strong>

                        <p>
                            Affordable everyday
                            shopping
                        </p>
                    </div>
                </div>


                <div>
                    <span>✅</span>

                    <div>
                        <strong>
                            Easy Shopping
                        </strong>

                        <p>
                            Simple and convenient
                            checkout
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
};

export default Products;