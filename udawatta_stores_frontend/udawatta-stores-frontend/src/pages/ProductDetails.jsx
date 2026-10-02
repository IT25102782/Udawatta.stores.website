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


    return null;
};

export default ProductDetails;
