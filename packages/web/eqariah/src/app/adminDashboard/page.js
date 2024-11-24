"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react"


export default function AdminDashboard() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        category_id: "",
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verifikasi session saat komponen dimount
    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/verify-session', {
                    withCredentials: true // Penting untuk cookies
                });

                if (response.data.authenticated && response.data.user.role === 'admin') {
                    setIsAuthenticated(true);
                } else {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('Session verification failed:', error);
                router.replace('/login');
            }
        };

        verifySession();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
        // Reset error dan success messages saat user mulai mengetik
        setError('');
        setSuccess('');
    };

    const validateForm = () => {
        if (!formData.title.trim() || !formData.detail.trim() || !formData.category_id.trim()) {
            setError('All fields are required');
            return false;
        }

        const category = formData.category_id.toLowerCase();
        if (!['announcement', 'appeal'].includes(category)) {
            setError('Category must be either "announcement" or "appeal"');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3001/api/auth/announcement',
                formData,
                {
                    withCredentials: true, // Penting untuk cookies
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 201) {
                setSuccess(response.data.message || 'Announcement created successfully');
                // Reset form setelah berhasil
                setFormData({
                    title: "",
                    detail: "",
                    category_id: ""
                });
            }
        } catch (err) {
            console.error('Announcement creation error:', err);

            if (err.response?.status === 403) {
                setError('You do not have permission to create announcements');
                router.replace('/login');
            } else if (err.response?.status === 401) {
                setError('Session expired. Please log in again');
                router.replace('/login');
            } else {
                setError(err.response?.data?.error || "Failed to create announcement");
            }
        } finally {
            setLoading(false);
        }
    };

    // Jika belum terautentikasi, tampilkan loading atau halaman kosong
    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>;
    }

    const InputField = ({ name, type = "text", placeholder, label }) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-[2%] lg:py-2 px-[3%] lg:px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={placeholder}
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-[4%] lg:px-36 rounded-lg shadow-lg w-full mx-[3%] md:ms-[1%] lg:mx-[550px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[7vw] font-bold text-center md:text-[3vw] lg:text-2xl">
                        Announcement
                    </h2>
                    <button
                        onClick={async () => {
                            try {
                                await axios.post('http://localhost:3001/api/auth/logout', {}, {
                                    withCredentials: true
                                });
                                router.replace('/login');
                            } catch (error) {
                                console.error('Logout error:', error);
                                router.replace('/login');
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4 bg-green-100 text-green-800 border-green-300">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        name="title"
                        placeholder="Input title Announcements"
                        label="Title"
                    />
                    <div className="mb-4">
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-2">
                            Detail
                        </label>
                        <textarea
                            name="detail"
                            value={formData.detail}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-[2%] lg:py-2 px-[3%] lg:px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
                            placeholder="Input detail announcement"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-[3.5vw] md:text-[2.5vw] lg:text-xl font-bold mb-2">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-[2%] lg:py-2 px-[3%] lg:px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select category</option>
                            <option value="announcement">Announcement</option>
                            <option value="appeal">Appeal</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-[2%] lg:py-2 px-[4%] lg:px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 text-[4vw] md:text-[3vw] lg:text-xl"
                    >
                        {loading ? "Loading..." : "Announce"}
                    </button>
                </form>
            </div>
        </div>
    );
}