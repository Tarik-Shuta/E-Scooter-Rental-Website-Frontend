import { useEffect, useState } from "react";
import axiosInstance from "../services/api";

interface Ride {
    id: number;
    scooterId: number;
    startTime: string;
    endTime: string | null;
    startLocation: string | null;
    endLocation: string | null;
    duration: number;
    totalCost: string;
    status: "active" | "completed";
}

function RideHistory() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

    const fetchRideHistory = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/rides/history');

            console.log("Rides data received:", response.data);
            setRides(response.data);
            setError("");
        } catch (err: any) {
            console.error("Error fetching ride history:", err);
            setError(err.response?.data?.message || "Error loading ride history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRideHistory();
    }, []);

    const filteredRides = rides.filter(ride => {
        if (filter === "all") return true;
        return ride.status === filter;
    });

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${hours}h ${mins}m`;
    };

    const calculateTotalStats = () => {
        const completedRides = rides.filter(r => r.status === "completed");
        return {
            totalRides: completedRides.length,
            totalCost: completedRides.reduce((sum, ride) => sum + (parseFloat(ride.totalCost) || 0), 0),
            totalDuration: completedRides.reduce((sum, ride) => sum + (ride.duration || 0), 0)
        };
    };

    const stats = calculateTotalStats();

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Ride History</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Ride History</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-800 font-medium mb-4">Error: {error}</p>
                    <button
                        onClick={fetchRideHistory}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Ride History</h1>
            <p className="text-gray-400 mb-8">View all your past and current rides</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center">
                <div className="bg-black border border-blue-100 rounded-xl p-6">
                        <div>

                            <p className="text-sm text-gray-600">Total Rides</p>
                            <p className="text-2xl font-bold">{stats.totalRides}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center pl-15">
                <div className="bg-black border border-green-100 rounded-xl p-6">

                        <div>
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="text-2xl font-bold">€{stats.totalCost.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center pl-14">
                <div className="bg-black border border-purple-100 rounded-xl p-6">

                        <div>
                            <p className="text-sm text-gray-600">Total Ride Time</p>
                            <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === "all"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        All Rides ({rides.length})
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === "completed"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Completed ({rides.filter(r => r.status === "completed").length})
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === "active"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Active ({rides.filter(r => r.status === "active").length})
                    </button>
                </div>

                <button
                    onClick={fetchRideHistory}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {filteredRides.length === 0 ? (
                <div className="bg-gray border border-gray-200 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {filter === "all" ? "No rides yet" : `No ${filter} rides`}
                    </h3>
                    <p className="text-white max-w-md mx-auto">
                        {filter === "all"
                            ? "Start your first ride to see it here!"
                            : `You don't have any ${filter} rides at the moment.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRides.map((ride) => (
                        <div
                            key={ride.id}
                            className="bg-[#242424] border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                <div className="flex items-center mb-4 lg:mb-0">
                                    <div className={`p-3 rounded-lg ${
                                        ride.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        <span className="text-2xl">
                                            {ride.status === "completed" ? "✓" : "🚴"}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Scooter #{ride.scooterId}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">

                                            <span className="text-white ml-4">
                                                {formatDate(ride.startTime)} • {formatTime(ride.startTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                        €{(parseFloat(ride.totalCost) || 0).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-white">
                                        {ride.duration} minutes
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-sm text-white mb-1">Start Location</p>
                                    <p className="font-medium">{ride.startLocation || "Unknown"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white mb-1">End Location</p>
                                    <p className="font-medium">
                                        {ride.endLocation || (ride.status === "active" ? "In progress..." : "Ilidza")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-white mb-1">Duration</p>
                                    <p className="font-medium">{formatDuration(ride.duration)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white mb-1">Ended</p>
                                    <p className="font-medium">
                                        {ride.endTime ? formatTime(ride.endTime) : "Still active"}
                                    </p>
                                </div>
                            </div>

                            {ride.status === "active" && (
                                <div className="mt-4 pt-4 border-t border-yellow-100">
                                    <div className="flex items-center text-yellow-700">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">This ride is currently active</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RideHistory;