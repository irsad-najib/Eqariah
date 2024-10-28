"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleMouseDown = (field) => {
        if (field === 'password') setShowPassword(true);
        if (field === 'confirmPassword') setShowConfirmPassword(true);
    };

    const handleMouseUp = (field) => {
        if (field === 'password') setShowPassword(false);
        if (field === 'confirmPassword') setShowConfirmPassword(false);
    };

    const handleTouchStart = (field) => {
        if (field === 'password') setShowPassword(true);
        if (field === 'confirmPassword') setShowConfirmPassword(true);
    };

    const handleTouchEnd = (field) => {
        if (field === 'password') setShowPassword(false);
        if (field === 'confirmPassword') setShowConfirmPassword(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Check password match when either password field changes
        if (name === "password" || name === "confirmPassword") {
            if (name === "password") {
                setPasswordMatch(value === formData.confirmPassword);
            } else {
                setPasswordMatch(value === formData.password);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', formData, {
                headers: {
                    "Content-Type": 'application/json'
                },
            });

            const data = response.data;

            window.location.href = "/login";

        } catch (error) {
            if (axios.isAxiosError(error)) {

                const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred');
            }
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-[4%] lg:px-36 rounded-lg shadow-lg w-full mx-[3%] md:mx-[18%] lg:mx-[550px] ">
                <h2 className=" text-[7vw] font-bold mb-[4%] text-center md:text-[3vw] lg:text-2xl">Register</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-[3%] py-[3%] rounded mb-[3%]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-[1%] lg:mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-[1%] lg:mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Choose a username"
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
                                className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onMouseDown={() => handleMouseDown('password')}
                                onMouseUp={() => handleMouseUp('password')}
                                onMouseLeave={() => handleMouseUp('password')}
                                onTouchStart={() => handleTouchStart('password')}
                                onTouchEnd={() => handleTouchEnd('password')}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <p className="text-[2.8vw] md:text-[2vw] text-gray-500 mt-[0.7%] lg:text-lg">
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-[1%] lg:mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onMouseDown={() => handleMouseDown('confirmPassword')}
                                onMouseUp={() => handleMouseUp('confirmPassword')}
                                onMouseLeave={() => handleMouseUp('confirmPassword')}
                                onTouchStart={() => handleTouchStart('confirmPassword')}
                                onTouchEnd={() => handleTouchEnd('confirmPassword')}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {!passwordMatch && formData.confirmPassword && (
                            <p className="text-[2.8vw] text-red-500 mt-[0.7%[">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !passwordMatch}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-[2%] lg:py-2 px-[4%] lg:px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 text-[4vw] md:text-[3vw] lg:text-xl"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-[6%] text-center text-[3vw] md:text-[2vw] lg:text-lg lg:mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:text-blue-700">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}