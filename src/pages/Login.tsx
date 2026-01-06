import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { API_ENDPOINTS } from "../config";

type LoginForm = {
    email: string;
    password: string;
};

function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const triggerAuthChange = () => {
        window.dispatchEvent(new Event('authChange'));
        localStorage.setItem('authUpdate', Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(response);
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                localStorage.setItem("user", JSON.stringify({
                    email: formData.email
                }));
            }

            console.log(data.token);
            console.log("Logged in");
            triggerAuthChange();
            const userRole = data.user?.role || 'user';
            if (userRole === 'admin') {
                navigate("/admindashboard");
            } else {
                navigate("/");
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setError("Cannot connect to backend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg text-white">
                <h1 className="text-2xl text-center mb-6">UrbanMove</h1>

                {error && (
                    <div className="bg-red-900 p-3 rounded mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-3 bg-gray-900 rounded"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-900 rounded"
                    />

                    <button
                        type={"submit"}
                        disabled={loading}
                        className="w-full bg-blue-600 py-3 rounded font-bold disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-400">
                    No account?{" "}
                    <Link to="/signup" className="text-blue-400 underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
