"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../component/footer";
import Navbar from "../component/Navbar";
import axios from "axios";

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
        contactPerson: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validateForm = () => {
        const newErrors = {};

        if (!formData.mosqueName.trim()) {
            newErrors.mosqueName = "Mosque name is required";
        }

        const phoneRegex = /^[0-9]{10,13}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number (10-13 digits)";
        }

        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.village.trim()) newErrors.village = "Village is required";
        if (!formData.district.trim()) newErrors.district = "District is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.province.trim()) newErrors.province = "Province is required";

        const postalRegex = /^[0-9]{5}$/;
        if (!postalRegex.test(formData.postalCode)) {
            newErrors.postalCode = "Please enter a valid 5-digit postal code";
        }

        if (!formData.mosqueAdmin.trim()) {
            newErrors.mosqueAdmin = "Administrator name is required";
        }

        const contactRegex = /^[0-9]{10,13}$/;
        if (!contactRegex.test(formData.contactPerson)) {
            newErrors.contactPerson = "Please enter a valid contact number (10-13 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
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
            const response = await axios.post(
                "https://ec2-13-239-232-246.ap-southeast-2.compute.amazonaws.com/api/auth/registerMosque",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (response.status !== 200) {
                throw new Error(data.error || "Registration failed");
            }

            if (data.success) {
                router.push("/");
            }
        } catch (err) {
            setSubmitError(err.message || "An unexpected error occurred");
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
        <>
            <Navbar />
            <div className="bg-gray-100 flex justify-center items-center flex-1 flex-col pt-10 pb-10">
                <h1 className="text-[10vw] font-bold text-green-600 mb-[3%] md:text-[5vw] lg:text-4xl">
                    Eqariah
                </h1>
                <div className="pt-10 bg-white p-12 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-[7vw] font-bold mb-[4%] text-center md:text-[3vw] lg:text-2xl pb-5">Mosque Register</h2>
                    {submitError && (
                        <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField
                            name="mosqueName"
                            placeholder="Mosque Name"
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

                        <div className="text-gray-600 text-xs mt-4">
                            <p>
                                Mosque who use our service may have uploaded mosque contact information to Eqariah. {" "}
                                <a href="#" className="text-blue-500 underline">Learn more.</a>
                            </p>
                            <p className="mt-2">
                                By clicking Sign Up, you agree to our {" "}
                                <a href="#" className="text-blue-500 underline">Terms</a>, {" "}
                                <a href="#" className="text-blue-500 underline">Privacy Policy</a> and {" "}
                                <a href="#" className="text-blue-500 underline">Cookies Policy</a>.
                            </p>
                            <p className="mt-1">You may receive Email from us.</p>
                        </div>

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
            </div>
            <Footer />
        </>
    );
}
