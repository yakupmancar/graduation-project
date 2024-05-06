import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (values) => {
        try {
            const res = await axios.post("http://localhost:8800/auth/login", values);
            setCurrentUser(res.data);
            return res.data; 
        } catch (error) {
            console.error(error);
            return { Error: "Login failed" }; 
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:8800/auth/logout");
            setCurrentUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

