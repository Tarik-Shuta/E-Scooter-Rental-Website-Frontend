import React, { useState } from "react";
import { API_ENDPOINTS } from "../config";

type SignupForm = {
    name: string;
    email: string;
    password: string;
};

function Signup() {
    const [formData, setFormData] = useState<SignupForm>({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            setSuccess("Account created successfully!");
            setFormData({ name: "", email: "", password: "" });

        } catch (err: any) {
            setError(err.message || "Cannot connect to backend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl text-center text-white mb-4">UrbanMove</h1>

                {error && (
                    <div className="bg-red-900 text-red-200 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-900 text-green-200 p-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 mb-3 bg-gray-900 text-white rounded"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-3 bg-gray-900 text-white rounded"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        minLength={6}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-900 text-white rounded"
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 py-3 rounded font-bold disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
