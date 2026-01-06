import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";
import RideHistory from "../components/RideHistory.tsx";

type User = {
    name?: string;
    email?: string;
};

type Ride = {
    id: number;
    scooterId: number;
    startTime: string;
    status: string;
    totalCost: number;
};

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"personal" | "rides" | "settings">("personal");
    const [userRides, setUserRides] = useState<Ride[]>([]);
    const [loadingRides, setLoadingRides] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    const fetchRides = async () => {
        setLoadingRides(true);
        try {
            const response = await axiosInstance.get('/rides/history');
            setUserRides(response.data);
        } catch (err) {
            console.error('Failed to load rides:', err);
        } finally {
            setLoadingRides(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600 mb-6">UrbanMove account details</p>

            <div className="flex gap-6 border-b mb-6">
                {["personal", "rides", "settings"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-2 font-medium ${
                            activeTab === tab
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-black rounded-xl shadow p-6">
                {activeTab === "personal" && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg font-medium">{user?.name || "Not set"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg font-medium">{user?.email}</p>
                        </div>
                    </div>
                )}

                {activeTab === "rides" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">My Rides</h2>

                        <button
                            onClick={fetchRides}
                            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded text-sm">
                            Load My Rides
                        </button>

                        {loadingRides && <p className="text-gray-600">Loading...</p>}

                        {!loadingRides && userRides.length === 0 ? (
                            <p className="text-gray-600">No rides yet. Start your first ride!</p>
                        ) : (
                            <RideHistory/>
                        )}
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Account Settings</h2>

                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;