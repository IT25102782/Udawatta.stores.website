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


    return null;
};

export default Products;
