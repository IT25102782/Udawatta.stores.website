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


