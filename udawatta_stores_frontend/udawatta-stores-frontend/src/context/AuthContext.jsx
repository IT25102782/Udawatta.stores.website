import React, {
    createContext,
    useEffect,
    useState
} from "react";

import axios from "axios";


export const AuthContext =
    createContext();


export const AuthProvider = ({
                                 children
                             }) => {

    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);


    // =========================================================
    // CLEAR LOGIN DATA
    // =========================================================

    const clearLoginData = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        delete axios.defaults.headers.common[
            "Authorization"
            ];
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {

        clearLoginData();

        window.location.href =
            "/login";
    };


    // =========================================================
    // READ JWT EXPIRATION TIME
    // =========================================================

    const getTokenExpiration = (
        jwtToken
    ) => {

        try {

            const payloadPart =
                jwtToken.split(".")[1];


            if (!payloadPart) {
                return null;
            }


            // JWT uses URL-safe Base64
            const normalizedPayload =
                payloadPart
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");


            const payload =
                JSON.parse(
                    atob(
                        normalizedPayload
                    )
                );


            if (!payload.exp) {
                return null;
            }


            // exp is stored in seconds.
            // JavaScript Date uses milliseconds.
            return payload.exp * 1000;

        } catch (error) {

            console.error(
                "Unable to read JWT:",
                error
            );

            return null;
        }
    };


    // =========================================================
    // LOAD SAVED LOGIN
    // =========================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );

        const storedToken =
            localStorage.getItem(
                "token"
            );


        if (
            !storedUser ||
            !storedToken
        ) {

            return;
        }


        const expirationTime =
            getTokenExpiration(
                storedToken
            );


        // Token already expired
        if (
            expirationTime &&
            expirationTime <= Date.now()
        ) {

            clearLoginData();

            return;
        }


        try {

            setUser(
                JSON.parse(
                    storedUser
                )
            );

            setToken(
                storedToken
            );


            axios.defaults.headers.common[
                "Authorization"
                ] =
                `Bearer ${storedToken}`;

        } catch (error) {

            console.error(
                "Unable to restore login:",
                error
            );

            clearLoginData();
        }

    }, []);


    // =========================================================
    // LOGIN
    // =========================================================

    const login = (
        loginData
    ) => {

        const {
            token: jwtToken,
            ...userData
        } = loginData;


        if (!jwtToken) {

            console.error(
                "JWT token was not returned by backend."
            );

            return;
        }


        setUser(
            userData
        );

        setToken(
            jwtToken
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                userData
            )
        );


        localStorage.setItem(
            "token",
            jwtToken
        );


        axios.defaults.headers.common[
            "Authorization"
            ] =
            `Bearer ${jwtToken}`;
    };


    // =========================================================
    // AUTO LOGOUT WHEN JWT EXPIRES
    // =========================================================

    useEffect(() => {

        if (!token) {
            return;
        }


        const expirationTime =
            getTokenExpiration(
                token
            );


        if (!expirationTime) {
            return;
        }


        const remainingTime =
            expirationTime -
            Date.now();


        // Token already expired
        if (remainingTime <= 0) {

            logout();

            return;
        }


        const logoutTimer =
            setTimeout(
                () => {

                    logout();

                },
                remainingTime
            );


        return () => {

            clearTimeout(
                logoutTimer
            );
        };

    }, [token]);


    // =========================================================
    // AXIOS 401 INTERCEPTOR
    // =========================================================

    useEffect(() => {

        const interceptor =
            axios.interceptors.response.use(

                // Successful response
                (response) => {

                    return response;
                },


                // Error response
                (error) => {

                    if (
                        error.response?.status === 401
                    ) {

                        const storedToken =
                            localStorage.getItem(
                                "token"
                            );


                        // Only auto logout when
                        // there was an active login.
                        //
                        // This prevents a failed login attempt
                        // from causing unnecessary behaviour.
                        if (storedToken) {

                            clearLoginData();

                            window.location.href =
                                "/login";
                        }
                    }


                    return Promise.reject(
                        error
                    );
                }
            );


        return () => {

            axios.interceptors.response.eject(
                interceptor
            );
        };

    }, []);


    // =========================================================
    // CONTEXT
    // =========================================================

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};