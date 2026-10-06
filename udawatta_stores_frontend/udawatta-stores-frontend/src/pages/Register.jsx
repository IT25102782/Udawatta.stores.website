import React, {
    useState
} from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";

import logo from "../assets/logo.png";

import "./Register.css";


function Register() {

    const [formData, setFormData] =
        useState({
            firstName: "",
            lastName: "",
            username: "",
            password: ""
        });


    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const navigate =
        useNavigate();


    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
            event.target.value
        });


        setError("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();


        // Basic frontend password validation
        if (
            formData.password.length < 8
        ) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (
            !/[A-Za-z]/.test(
                formData.password
            ) ||
            !/\d/.test(
                formData.password
            )
        ) {

            setError(
                "Password must contain at least one letter and one number."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            await axios.post(
                "http://localhost:8080/api/users/register",
                formData
            );


            alert(
                "Account created successfully! Please login."
            );


            navigate(
                "/login"
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            const backendError =
                error.response?.data;


            if (
                typeof backendError ===
                "string"
            ) {

                setError(
                    backendError
                );

            } else if (
                backendError?.message
            ) {

                setError(
                    backendError.message
                );

            } else {

                setError(
                    "Account creation failed. Please try again."
                );
            }


        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="register-page">

            <div className="register-background-overlay">
            </div>


            <div className="register-shape register-shape-one">
            </div>

            <div className="register-shape register-shape-two">
            </div>


            <div className="register-container">


                {/* LEFT BRAND SECTION */}

                <section className="register-brand">

                    <div className="register-brand-inner">


                        <div className="register-logo-wrapper">

                            <img
                                src={logo}
                                alt="Udawatta Stores"
                                className="register-logo"
                            />

                        </div>


                        <div className="register-brand-content">

                            <span className="register-brand-label">
                                JOIN UDAWATTA STORES
                            </span>


                            <h1>
                                Fresh groceries,
                                <br />
                                just a few clicks away.
                            </h1>


                            <p>
                                Create your account and enjoy
                                convenient grocery shopping
                                from anywhere.
                            </p>

                        </div>


                        <div className="register-benefits">

                            <div>
                                <span></span>
                                Easy online ordering
                            </div>

                            <div>
                                <span></span>
                                Track your orders
                            </div>

                            <div>
                                <span></span>
                                Fresh products daily
                            </div>

                        </div>

                    </div>

                </section>


                {/* REGISTER FORM */}

                <section className="register-box">

                    <div className="register-form-content">


                        <div className="register-heading">

                            <span>
                                CREATE ACCOUNT
                            </span>


                            <h2>
                                Start shopping with us
                            </h2>


                            <p>
                                Enter your information below
                                to create your account.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="register-error">

                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="register-form"
                        >


                            {/* NAME ROW */}

                            <div className="register-name-row">


                                <div className="register-input-group">

                                    <label htmlFor="firstName">
                                        First Name
                                    </label>


                                    <div className="register-input-wrapper">

                                        <span className="register-input-symbol">
                                            F
                                        </span>


                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            placeholder="First name"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            autoComplete="given-name"
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="register-input-group">

                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>


                                    <div className="register-input-wrapper">

                                        <span className="register-input-symbol">
                                            L
                                        </span>


                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={
                                                formData.lastName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            autoComplete="family-name"
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* USERNAME */}

                            <div className="register-input-group">

                                <label htmlFor="username">
                                    Username
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-symbol">
                                        U
                                    </span>


                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="username"
                                        minLength={3}
                                        maxLength={30}
                                        pattern="[A-Za-z0-9._]+"
                                        title="Use only letters, numbers, dots and underscores."
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="register-input-group">

                                <label htmlFor="password">
                                    Password
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-symbol">
                                        P
                                    </span>


                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Minimum 8 characters"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={64}
                                        required
                                    />


                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {showPassword
                                            ? "Hide"
                                            : "Show"}

                                    </button>

                                </div>


                                <small>
                                    Minimum 8 characters with at least
                                    one letter and one number.
                                </small>

                            </div>


                            {/* TERMS */}

                            <label className="register-terms">

                                <input
                                    type="checkbox"
                                    required
                                />

                                <span>
                                    I agree to the terms
                                    and conditions.
                                </span>

                            </label>


                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span className="register-spinner">
                                        </span>

                                        Creating Account...

                                    </>

                                ) : (

                                    "Create Account"

                                )}

                            </button>

                        </form>


                        <div className="register-login-link">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>


                        <div className="register-secure-note">

                            <span></span>

                            Your account information
                            is handled securely

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}


export default Register;