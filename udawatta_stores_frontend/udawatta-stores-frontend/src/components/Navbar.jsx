import React, { useContext, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import cartIcon from "../assets/icons/cart.png";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import logo from "../assets/logo.png";

import "./Navbar.css";


