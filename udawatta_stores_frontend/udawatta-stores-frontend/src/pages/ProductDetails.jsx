import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css";

import { CartContext } from "../context/CartContext";

import "./ProductDetails.css";
import { AuthContext } from "../context/AuthContext";

const ProductDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart } =
        useContext(CartContext);

    const {
        user,
        token
    } = useContext(AuthContext);


    const [reviews, setReviews] =
        useState([]);

    const [reviewRating, setReviewRating] =
        useState(5);

    const [reviewComment, setReviewComment] =
        useState("");

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    const [reviewError, setReviewError] =
        useState("");

    const [reviewSuccess, setReviewSuccess] =
        useState("");


    const [product, setProduct] =
        useState(null);

    const [allProducts, setAllProducts] =
        useState([]);

    const [quantity, setQuantity] =
        useState(1);

    const [loading, setLoading] =
        useState(true);


    /* ===================================
       LOAD PRODUCT
    =================================== */

    useEffect(() => {

        AOS.init({
            duration: 700,
            once: true
        });


        Promise.all([

            axios.get(
                `http://localhost:8080/api/products/${id}`
            ),

            axios.get(
                "http://localhost:8080/api/products"
            ),

            axios.get(
                `http://localhost:8080/api/reviews/product/${id}`
            )

        ])
            .then(
                ([
                     productResponse,
                     productsResponse,
                     reviewsResponse
                 ]) => {

                    setProduct(
                        productResponse.data
                    );

                    setAllProducts(
                        productsResponse.data
                    );

                    setReviews(
                        reviewsResponse.data
                    );

                    setQuantity(1);

                    setReviewRating(5);

                    setReviewComment("");

                    setReviewError("");

                    setReviewSuccess("");

                    setLoading(false);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            )
            .catch((error) => {

                console.error(
                    "Error loading product:",
                    error
                );

                setLoading(false);

            });

    }, [id]);


    /* ===================================
       QUANTITY
    =================================== */

    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(
                quantity - 1
            );

        }

    };


    const increaseQuantity = () => {

        if (
            product &&
            quantity < product.stock
        ) {

            setQuantity(
                quantity + 1
            );

        }

    };


    /* ===================================
       ADD TO CART
    =================================== */

    const handleAddToCart = () => {

        if (!product) {
            return;
        }

        addToCart(
            product,
            quantity
        );

    };

    /* ===================================
   REVIEWS
=================================== */

    const refreshReviews = async () => {

        try {

            const response =
                await axios.get(
                    `http://localhost:8080/api/reviews/product/${id}`
                );

            setReviews(
                response.data
            );

        } catch (error) {

            console.error(
                "Error refreshing reviews:",
                error
            );
        }
    };


    const handleReviewSubmit = async (event) => {

        event.preventDefault();

        setReviewError("");
        setReviewSuccess("");


        if (!user || !token) {

            navigate("/login");

            return;
        }


        const cleanComment =
            reviewComment.trim();


        if (cleanComment.length < 3) {

            setReviewError(
                "Please write at least 3 characters."
            );

            return;
        }


        if (cleanComment.length > 1000) {

            setReviewError(
                "Review cannot exceed 1000 characters."
            );

            return;
        }


        try {

            setReviewSubmitting(true);


            await axios.post(
                "http://localhost:8080/api/reviews",
                {
                    productId: product.id,
                    rating: reviewRating,
                    comment: cleanComment
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setReviewComment("");

            setReviewRating(5);

            setReviewSuccess(
                "Thank you. Your review has been added."
            );


            await refreshReviews();


        } catch (error) {

            console.error(
                "Review submission error:",
                error
            );


            const backendMessage =
                error.response?.data?.message;


            setReviewError(
                backendMessage ||
                "Unable to submit your review."
            );


        } finally {

            setReviewSubmitting(false);
        }
    };


    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (total, review) =>
                        total +
                        Number(review.rating),
                    0
                ) / reviews.length
            )
            : 0;


    const roundedRating =
        Math.round(
            averageRating
        );


    const formatReviewDate = (date) => {

        if (!date) {
            return "";
        }


        return new Date(date)
            .toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );
    };


    /* ===================================
       RELATED PRODUCTS
    =================================== */

    const relatedProducts =
        product
            ? allProducts
                .filter(
                    (item) =>
                        item.category ===
                        product.category &&
                        item.id !==
                        product.id
                )
                .slice(0, 4)
            : [];


    /* ===================================
       LOADING
    =================================== */

    if (loading) {

        return (

            <div className="details-loading">

                <div className="details-spinner">
                </div>

                <p>
                    Loading product...
                </p>

            </div>

        );

    }


    /* ===================================
       PRODUCT NOT FOUND
    =================================== */

    if (!product) {

        return (

            <div className="product-not-found">

                <h2>
                    Product not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Back to Products
                </button>

            </div>

        );

    }


    return (

        <div className="product-details-page">


            {/* ===================================
                BREADCRUMB
            =================================== */}

            <div className="product-breadcrumb">

                <Link to="/">
                    Home
                </Link>

                <span>›</span>

                <Link to="/products">
                    Products
                </Link>

                <span>›</span>

                <span>
                    {product.name}
                </span>

            </div>


            {/* ===================================
                MAIN PRODUCT
            =================================== */}

            <section className="product-detail-main">


                {/* PRODUCT IMAGE */}

                <div
                    className="product-detail-image-section"
                    data-aos="fade-right"
                >

                    <div className="product-detail-image">

                        <img
                            src={
                                product.image ||
                                "https://placehold.co/700x700?text=No+Image"
                            }
                            alt={product.name}
                            onError={(event) => {

                                event.currentTarget.src =
                                    "https://placehold.co/700x700?text=No+Image";

                            }}
                        />

                    </div>


                    <div className="image-quality-note">

                        <span>
                            🌿
                        </span>

                        <p>
                            Fresh quality products
                            selected for Udawatta
                            Stores customers.
                        </p>

                    </div>

                </div>


                {/* PRODUCT INFORMATION */}

                <div
                    className="product-detail-info"
                    data-aos="fade-left"
                >

                    <div className="detail-top-row">

                        <span className="detail-category">
                            {product.category}
                        </span>


                        <span
                            className={
                                product.stock > 0
                                    ? "detail-stock available"
                                    : "detail-stock unavailable"
                            }
                        >

                            {product.stock > 0
                                ? "In Stock"
                                : "Out of Stock"}

                        </span>

                    </div>


                    <h1>
                        {product.name}
                    </h1>


                    <div className="detail-rating">

                        <small>

                            {reviews.length > 0
                                ? `${averageRating.toFixed(1)} / 5 · ${reviews.length} review${
                                    reviews.length === 1
                                        ? ""
                                        : "s"
                                }`
                                : "No customer reviews yet"}

                        </small>

                    </div>


                    <div className="detail-price">

                        Rs.{" "}
                        {Number(
                            product.price
                        ).toLocaleString()}

                    </div>


                    <div className="detail-divider">
                    </div>


                    <div className="detail-description">

                        <h3>
                            Product Description
                        </h3>

                        <p>

                            {product.description ||
                                "Fresh quality product available from Udawatta Stores."}

                        </p>

                    </div>


                    <div className="detail-stock-info">

                        <span>
                            Available quantity
                        </span>

                        <strong>
                            {product.stock}
                        </strong>

                    </div>


                    {/* QUANTITY */}

                    {product.stock > 0 && (

                        <div className="detail-purchase">

                            <div className="detail-quantity">

                                <button
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        quantity <= 1
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        quantity >=
                                        product.stock
                                    }
                                >
                                    +
                                </button>

                            </div>


                            <button
                                className="detail-add-cart"
                                onClick={
                                    handleAddToCart
                                }
                            >

                                🛒 Add to Cart

                            </button>

                        </div>

                    )}


                    {product.stock <= 0 && (

                        <button
                            className="detail-add-cart disabled"
                            disabled
                        >
                            Out of Stock
                        </button>

                    )}


                    {/* BENEFITS */}

                    <div className="detail-benefits">

                        <div>

                            <span>
                                🚚
                            </span>

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

                            <span>
                                🌿
                            </span>

                            <div>

                                <strong>
                                    Fresh Products
                                </strong>

                                <p>
                                    Quality checked
                                    products
                                </p>

                            </div>

                        </div>


                        <div>

                            <span>
                                🔒
                            </span>

                            <div>

                                <strong>
                                    Secure Shopping
                                </strong>

                                <p>
                                    Simple and reliable
                                    checkout
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ===================================
    CUSTOMER REVIEWS
=================================== */}

            <section
                className="product-reviews-section"
                data-aos="fade-up"
            >

                <div className="product-reviews-header">

                    <div>

            <span>
                CUSTOMER FEEDBACK
            </span>

                        <h2>
                            Customer Reviews
                        </h2>

                        <p>
                            See what customers think about{" "}
                            {product.name}.
                        </p>

                    </div>


                    {reviews.length > 0 && (

                        <div className="product-review-summary">

                            <strong>
                                {averageRating.toFixed(1)}
                            </strong>

                            <div>

                    <span className="review-summary-stars">

                        {"★".repeat(
                            roundedRating
                        )}

                        <span>
                            {"★".repeat(
                                5 -
                                roundedRating
                            )}
                        </span>

                    </span>

                                <small>
                                    Based on{" "}
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </small>

                            </div>

                        </div>

                    )}

                </div>


                <div className="product-reviews-layout">


                    {/* REVIEW FORM */}

                    <div className="product-review-form-card">

            <span className="review-form-label">
                SHARE YOUR EXPERIENCE
            </span>

                        <h3>
                            Write a Review
                        </h3>


                        {!user ? (

                            <div className="review-login-message">

                                <p>
                                    Please login to leave
                                    a review for this product.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login to Review
                                </button>

                            </div>

                        ) : (

                            <form
                                onSubmit={
                                    handleReviewSubmit
                                }
                            >

                                <div className="review-rating-field">

                                    <label>
                                        Your Rating
                                    </label>

                                    <div className="review-star-buttons">

                                        {[1, 2, 3, 4, 5]
                                            .map(
                                                (star) => (

                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className={
                                                            star <=
                                                            reviewRating
                                                                ? "active"
                                                                : ""
                                                        }
                                                        onClick={() => {

                                                            setReviewRating(
                                                                star
                                                            );

                                                            setReviewError(
                                                                ""
                                                            );

                                                            setReviewSuccess(
                                                                ""
                                                            );
                                                        }}
                                                        aria-label={
                                                            `${star} star rating`
                                                        }
                                                    >
                                                        ★
                                                    </button>

                                                )
                                            )}

                                    </div>

                                    <small>
                                        {reviewRating} / 5
                                    </small>

                                </div>


                                <div className="review-comment-field">

                                    <label
                                        htmlFor="reviewComment"
                                    >
                                        Your Review
                                    </label>

                                    <textarea
                                        id="reviewComment"
                                        value={
                                            reviewComment
                                        }
                                        onChange={(event) => {

                                            setReviewComment(
                                                event.target.value
                                            );

                                            setReviewError("");

                                            setReviewSuccess("");
                                        }}
                                        maxLength={1000}
                                        rows={5}
                                        placeholder={
                                            `Tell us what you think about ${product.name}...`
                                        }
                                        required
                                    />

                                    <small>
                                        {reviewComment.length}
                                        /1000
                                    </small>

                                </div>


                                {reviewError && (

                                    <div className="review-message error">
                                        {reviewError}
                                    </div>

                                )}


                                {reviewSuccess && (

                                    <div className="review-message success">
                                        {reviewSuccess}
                                    </div>

                                )}


                                <button
                                    type="submit"
                                    className="review-submit-button"
                                    disabled={
                                        reviewSubmitting
                                    }
                                >

                                    {reviewSubmitting
                                        ? "Submitting..."
                                        : "Submit Review"}

                                </button>

                            </form>

                        )}

                    </div>


                    {/* REVIEW LIST */}

                    <div className="product-review-list">

                        {reviews.length === 0 ? (

                            <div className="reviews-empty">

                                <h3>
                                    No reviews yet
                                </h3>

                                <p>
                                    Be the first customer
                                    to review this product.
                                </p>

                            </div>

                        ) : (

                            reviews.map(
                                (review) => (

                                    <article
                                        className="product-review-card"
                                        key={review.id}
                                    >

                                        <div className="product-review-card-top">

                                            <div className="review-customer-avatar">

                                                {review.customerName
                                                    ? review.customerName
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "C"}

                                            </div>


                                            <div className="review-customer-details">

                                                <strong>
                                                    {review.customerName}
                                                </strong>

                                                <small>
                                                    Verified customer
                                                </small>

                                            </div>


                                            <time>
                                                {formatReviewDate(
                                                    review.createdAt
                                                )}
                                            </time>

                                        </div>


                                        <div className="product-review-stars">

                                <span>

                                    {"★".repeat(
                                        Number(
                                            review.rating
                                        )
                                    )}

                                </span>

                                            <span className="review-empty-stars">

                                    {"★".repeat(
                                        5 -
                                        Number(
                                            review.rating
                                        )
                                    )}

                                </span>

                                        </div>


                                        <p>
                                            {review.comment}
                                        </p>

                                    </article>

                                )
                            )

                        )}

                    </div>

                </div>

            </section>


            {/* ===================================
                RELATED PRODUCTS
            =================================== */}

            {relatedProducts.length > 0 && (

                <section className="related-products">

                    <div className="related-header">

                        <div>

                            <span>
                                YOU MAY ALSO LIKE
                            </span>

                            <h2>
                                Related Products
                            </h2>

                        </div>


                        <Link to="/products">
                            View All →
                        </Link>

                    </div>


                    <div className="related-grid">

                        {relatedProducts.map(
                            (item) => (

                                <Link
                                    to={
                                        `/products/${item.id}`
                                    }
                                    className="related-card"
                                    key={item.id}
                                >

                                    <div className="related-image">

                                        <img
                                            src={
                                                item.image ||
                                                "https://placehold.co/400x400?text=No+Image"
                                            }
                                            alt={
                                                item.name
                                            }
                                        />

                                    </div>


                                    <div className="related-info">

                                        <span>
                                            {
                                                item.category
                                            }
                                        </span>

                                        <h3>
                                            {
                                                item.name
                                            }
                                        </h3>

                                        <strong>

                                            Rs.{" "}
                                            {Number(
                                                item.price
                                            ).toLocaleString()}

                                        </strong>

                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                </section>

            )}

        </div>

    );
};

export default ProductDetails;