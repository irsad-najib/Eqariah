"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "../component/footer";
import Navbar from "../component/Navbar";
import axios from "axios";

export default function RegisterMosque() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [submitError, setSubmitError] = React.useState("");

    const formRef = React.useRef(null);
    const [errors, setErrors] = React.useState({});

    const validateFormData = (formData) => {
        const newErrors = {};
        const phoneRegex = /^[0-9]{10,13}$/;
        const postalRegex = /^[0-9]{5}$/;

        if (!formData.get("mosqueName")) newErrors.mosqueName = "Mosque name is required";
        if (!formData.get("street")) newErrors.street = "Street is required";
        if (!formData.get("village")) newErrors.village = "Village is required";
        if (!formData.get("district")) newErrors.district = "District is required";
        if (!formData.get("city")) newErrors.city = "City is required";
        if (!formData.get("province")) newErrors.province = "Province is required";

        if (!phoneRegex.test(formData.get("phoneNumber"))) {
            newErrors.phoneNumber = "Please enter a valid phone number (10-13 digits)";
        }

        if (!postalRegex.test(formData.get("postalCode"))) {
            newErrors.postalCode = "Please enter a valid 5-digit postal code";
        }

        if (!formData.get("mosqueAdmin")) {
            newErrors.mosqueAdmin = "Administrator name is required";
        }

        if (!phoneRegex.test(formData.get("contactPerson"))) {
            newErrors.contactPerson = "Please enter a valid contact number (10-13 digits)";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setErrors({});

        const formData = new FormData(formRef.current);
        const newErrors = validateFormData(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formDataObject = Object.fromEntries(formData.entries());

        setLoading(true);
        try {
            const response = await axios.post(
                "https://8a1b-36-78-38-21.ngrok-free.app/api/auth/registerMosque",
                formDataObject,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                router.push("/");
            } else {
                throw new Error("Failed to register mosque");
            }
        } catch (err) {
            setSubmitError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ name, type = "text", placeholder, label, defaultValue = "" }) => (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                        <div className="max-w-md mx-auto">
                            <div className="divide-y divide-gray-200">
                                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                    <h2 className="text-2xl font-bold mb-8 text-center text-green-600">
                                        Register Mosque
                                    </h2>

                                    {submitError && (
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                            <p className="text-red-700">{submitError}</p>
                                        </div>
                                    )}

                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                        <InputField
                                            name="mosqueName"
                                            placeholder="Mosque Name"
                                            label="Mosque Name"
                                        />

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg">Address</h3>
                                            <InputField
                                                name="street"
                                                placeholder="Street Address"
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField
                                                    name="rt"
                                                    placeholder="RT"
                                                />
                                                <InputField
                                                    name="rw"
                                                    placeholder="RW"
                                                />
                                            </div>

                                            <InputField
                                                name="village"
                                                placeholder="Village/Kelurahan"
                                            />
                                            <InputField
                                                name="district"
                                                placeholder="District/Kecamatan"
                                            />
                                            <InputField
                                                name="city"
                                                placeholder="City"
                                            />
                                            <InputField
                                                name="province"
                                                placeholder="Province"
                                            />
                                            <InputField
                                                name="postalCode"
                                                placeholder="Postal Code"
                                            />
                                        </div>

                                        <InputField
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="Phone Number"
                                            label="Phone Number"
                                        />

                                        <InputField
                                            name="mosqueAdmin"
                                            placeholder="Administrator Name"
                                            label="Mosque Administrator"
                                        />

                                        <InputField
                                            name="contactPerson"
                                            type="tel"
                                            placeholder="Contact Person"
                                            label="Contact Person"
                                        />

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {loading ? "Processing..." : "Register Mosque"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}