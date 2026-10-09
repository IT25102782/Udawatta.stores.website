import React, {
    useContext,
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

import logo from "../assets/logo.png";

import "./Login.css";


function Login() {

    const [credentials, setCredentials] =
        useState({
            username: "",
            password: ""
        });


    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const { login } =
        useContext(AuthContext);


    const navigate =
        useNavigate();


    const handleChange = (event) => {

        setCredentials({
            ...credentials,
            [event.target.name]:
            event.target.value
        });

        setError("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);
            setError("");


            const response =
                await axios.post(
                    "http://localhost:8080/api/users/login",
                    credentials
                );


            login(response.data);


            if (
                response.data.role ===
                "ADMIN"
            ) {

                navigate(
                    "/admin/dashboard"
                );

            } else {

                navigate("/");

            }


        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            setError(
                "Invalid username or password. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            {/* Background overlay */}

            <div className="login-background-overlay">
            </div>


            {/* Decorative background shapes */}

            <div className="login-shape login-shape-one">
            </div>

            <div className="login-shape login-shape-two">
            </div>

            <div className="login-shape login-shape-three">
            </div>


            <div className="login-container">


                {/* ==========================
                    LEFT SIDE
                =========================== */}

                <section className="login-brand">

                    <div className="login-brand-inner">

                        <div className="login-logo-wrapper">

                            <img
                                src={logo}
                                alt="Udawatta Stores"
                                className="login-logo"
                            />

                        </div>


                        <div className="login-brand-copy">

                            <span className="login-brand-label">
                                UDAWATTA STORES
                            </span>


                            <h1>
                                Fresh shopping,
                                <br />
                                made simple.
                            </h1>


                            <p>
                                Quality groceries,
                                everyday essentials and
                                convenient shopping in one place.
                            </p>

                        </div>


                        <div className="login-brand-features">

                            <div>
                                <span className="feature-dot">
                                </span>

                                Fresh products
                            </div>


                            <div>
                                <span className="feature-dot">
                                </span>

                                Simple ordering
                            </div>


                            <div>
                                <span className="feature-dot">
                                </span>

                                Reliable delivery
                            </div>

                        </div>

                    </div>

                </section>



                {/* ==========================
                    LOGIN FORM
                =========================== */}

                <section className="login-box">

                    <div className="login-form-content">


                        <div className="login-heading">

                            <span>
                                WELCOME BACK
                            </span>


                            <h2>
                                Login to your account
                            </h2>


                            <p>
                                Enter your account details
                                to continue shopping.
                            </p>

                        </div>



                        {error && (

                            <div className="login-error">

                                <span className="login-error-mark">
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}



                        <form
                            onSubmit={handleSubmit}
                            className="login-form"
                        >


                            {/* USERNAME */}

                            <div
                                className="input-group login-field-one"
                            >

                                <label
                                    htmlFor="username"
                                >
                                    Username
                                </label>


                                <div className="login-input-wrapper">

                                    <span className="login-input-symbol">
                                        U
                                    </span>


                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={
                                            credentials.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="username"
                                        required
                                    />

                                </div>

                            </div>



                            {/* PASSWORD */}

                            <div
                                className="input-group login-field-two"
                            >

                                <label
                                    htmlFor="password"
                                >
                                    Password
                                </label>


                                <div className="login-input-wrapper">

                                    <span className="login-input-symbol">
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
                                        placeholder="Enter your password"
                                        value={
                                            credentials.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="current-password"
                                        required
                                    />


                                    <button
                                        type="button"
                                        className="password-toggle"
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

                            </div>



                            {/* OPTIONS */}

                            <div className="login-options">

                                <label className="remember">

                                    <input
                                        type="checkbox"
                                    />

                                    <span>
                                        Remember me
                                    </span>

                                </label>


                                <a
                                    href="#"
                                    onClick={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    Forgot password?
                                </a>

                            </div>



                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span className="login-spinner">
                                        </span>

                                        Signing in...

                                    </>

                                ) : (

                                    "Login"

                                )}

                            </button>

                        </form>



                        {/* REGISTER */}

                        <div className="login-register-area">

                            <span>
                                Don't have an account?
                            </span>


                            <Link to="/register">
                                Create Account
                            </Link>

                        </div>



                        <div className="login-secure-note">

                            <span>
                            </span>

                            Secure access to your
                            Udawatta Stores account

                        </div>

                    </div>

                </section>

            </div>

        </div>

    );
}


export default Login;