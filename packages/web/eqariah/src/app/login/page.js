"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { unknown } from "zod";

export default function Login() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDown = () => setShowPassword(true);
    const handleMouseUp = () => setShowPassword(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.trim() }));
        setError("");
    };

    useEffect(() => {
        const chekAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/verify-session', {
                    withCredentials: true
                });

                if (response.data.authenticated) {
                    setIsLoggedIn(true);

                    router.push('/')
                }
            } catch (error) {
                console.error("session verification failed", error);
                setIsLoggedIn(false);
            }
        };
        chekAuthStatus();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.identifier || !formData.password) {
            setError("Username/Email and Password are required");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/auth/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
                timeout: 10000
            });

            if (response.data.success) {
                setIsLoggedIn(true);

                router.push('/')
            } else {
                setError("login failed: " + (response.data.message || "unknown error"))
            }
        } catch (error) {
            console.error("Login Error :", error);

            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Sisanya sama dengan kode sebelumnya...
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-[4%] lg:px-36 rounded-lg shadow-lg w-full mx-[3%] md:mx-[18%] lg:mx-[550px]">
                <h2 className="text-[7vw] font-bold mb-[4%] text-center md:text-[3vw] lg:text-2xl">Login</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-[3%] lg:px-3 py-[3%] lg:py-3 rounded mb-[3%] lg:mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form input sama seperti sebelumnya */}
                    <div>
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-[1%] lg:mb-1">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-[2%] lg:py-2 px-[3%] lg:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter Email or Username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-[1%] lg:mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-[2%] lg:py-2 px-[3%] lg:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-[2%] lg:py-2 px-[4%] lg:px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 text-[4vw] md:text-[3vw] lg:text-xl"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p className="mt-[6%] text-center text-[3vw] md:text-[2vw] lg:text-lg lg:mt-6">
                    Don't have an account?{" "}
                    <a href="../register" className="text-blue-500 hover:text-blue-700">Register here</a>
                </p>
            </div>
        </div>
    );
}