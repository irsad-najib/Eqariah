"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterMosque() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        mosqueName: "",
        street: "",
        rt: "",
        rw: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postalCode: "",
        phoneNumber: "",
        mosqueAdmin: "",
        contactPerson: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validateForm = () => {
        const newErrors = {};

        // Mosque Name validation
        if (!formData.mosqueName.trim()) {
            newErrors.mosqueName = "Mosque name is required";
        }

        // Phone Number validation
        const phoneRegex = /^[0-9]{10,13}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number (10-13 digits)";
        }

        // Address validation
        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.village.trim()) newErrors.village = "Village is required";
        if (!formData.district.trim()) newErrors.district = "District is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.province.trim()) newErrors.province = "Province is required";

        // Postal Code validation
        const postalRegex = /^[0-9]{5}$/;
        if (!postalRegex.test(formData.postalCode)) {
            newErrors.postalCode = "Please enter a valid 5-digit postal code";
        }

        // Admin validation
        if (!formData.mosqueAdmin.trim()) {
            newErrors.mosqueAdmin = "Administrator name is required";
        }

        // Contact Person validation
        const contactRegex = /^[0-9]{10,13}$/;
        if (!contactRegex.test(formData.contactPerson)) {
            newErrors.contactPerson = "Please enter a valid contact number (10-13 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/auth/registerMosque', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (data.success) {
                router.push("/");
            }
        } catch (err) {
            setSubmitError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ name, type = "text", placeholder, label }) => (
        <div>
            <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-[2%] px-[3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={placeholder}
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            {submitError && (
                <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 space-y-4">
                <InputField
                    name="mosqueName"
                    placeholder="Input Mosque Name"
                    label="Mosque Name"
                />

                <div className="space-y-2">
                    <label className="block text-gray-700 text-responsive font-bold mb-[1%] lg:mb-1">
                        Address
                    </label>
                    <InputField name="street" placeholder="Street" />
                    <div className="grid grid-cols-2 gap-2">
                        <InputField name="rt" placeholder="RT" />
                        <InputField name="rw" placeholder="RW" />
                    </div>
                    <InputField name="village" placeholder="Village" />
                    <InputField name="district" placeholder="District" />
                    <InputField name="city" placeholder="City" />
                    <InputField name="province" placeholder="Province" />
                    <InputField name="postalCode" placeholder="Postal Code" />
                </div>

                <InputField
                    name="phoneNumber"
                    type="tel"
                    placeholder="Input Telephone Number"
                    label="Telephone Number"
                />

                <InputField
                    name="mosqueAdmin"
                    placeholder="Mosque Administrator Name"
                    label="Mosque Administrator"
                />

                <InputField
                    name="contactPerson"
                    type="tel"
                    placeholder="Contact Person Number"
                    label="Contact Person"
                />

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <span className="animate-pulse">Sending...</span>
                            </span>
                        ) : (
                            'Send'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
