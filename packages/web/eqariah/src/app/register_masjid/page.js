"use client"

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../component/registerMosqueSchema';
import { useRouter } from "next/navigation";

export default function RegisterMosque() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (formData) => {
        setError("");
        setLoading(true);  // Set loading di awal
        try {
            console.log('Submitting form data:', formData);

            const response = await axios.post(
                'http://localhost:3001/api/auth/registerMosque',
                formData,
                {
                    headers: {
                        "Content-Type": 'application/json'
                    },
                }
            );

            console.log('Response:', response.data);

            if (response.data.success) {
                router.push("/");
            } else {
                setError(response.data.error || 'Registration failed');
            }

        } catch (err) {
            console.error('Detailed error:', err);

            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.error ||
                    err.response?.data?.message ||
                    err.message ||
                    'Registration failed';
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            {error && (
                <div className="p-4 text-red-500 bg-red-100">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 lg:p-8 space-y-4">
                <div>
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Mosque Name
                    </label>
                    <input
                        {...register("mosqueName")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Input Mosque Name"
                    />
                    {errors.mosqueName && (
                        <p className="text-red-500 text-sm mt-1">{errors.mosqueName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Address
                    </label>
                    <input
                        {...register("street")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Street"
                    />
                    <input
                        {...register("rt")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="RT"
                    />
                    <input
                        {...register("rw")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="RW"
                    />
                    <input
                        {...register("village")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="Village"
                    />
                    <input
                        {...register("district")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="District"
                    />
                    <input
                        {...register("city")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="City"
                    />
                    <input
                        {...register("province")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="Province"
                    />
                    <input
                        {...register("postalCode")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                        placeholder="Postal Code"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Telephone Number
                    </label>
                    <input
                        {...register("phoneNumber")}
                        type="tel"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Input Telephone Number"
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Mosque Administrator
                    </label>
                    <input
                        {...register("mosqueAdmin")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Mosque Administrator Name"
                    />
                    {errors.mosqueAdmin && (
                        <p className="text-red-500 text-sm mt-1">{errors.mosqueAdmin.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Contact Person
                    </label>
                    <input
                        {...register("contactPerson")}
                        type="text"
                        className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Contact Person Number"
                    />
                    {errors.contactPerson && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}