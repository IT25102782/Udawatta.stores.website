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


    return null;
};

export default AddProduct;
