import { useEffect, useState } from "react";

interface Scooter {
    id: number;
    name: string;
    status: "available" | "in_use" | "maintenance";
    battery_level: number;
    current_location: string;
}
interface Ride {
    id: number;
    scooterId: number;
    startTime: string;
    endTime: string | null;
    startLocation: string | null;
    endLocation: string | null;
    duration: number;
    totalCost: number;
    status: "active" | "completed";
}

function Rides() {
    const [scooters, setScooters] = useState<Scooter[]>([]);
    const [activeRide, setActiveRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState({
        scooters: true,
        active: false,
        starting: false,
        ending: false
    });
    const [error, setError] = useState("");
    const [selectedScooter, setSelectedScooter] = useState<number | null>(null);

    const token = localStorage.getItem("token");

    const fetchScooters = async () => {
        try {
            setLoading(prev => ({ ...prev, scooters: true }));
            const res = await fetch("/api/scooters/available", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch scooters");
            }

            const data = await res.json();
            setScooters(data);
            setError("");
        } catch (err: any) {
            console.error("Error fetching scooters:", err);
        } finally {
            setLoading(prev => ({ ...prev, scooters: false }));
        }
    };

    const fetchActiveRide = async () => {
        try {
            setLoading(prev => ({ ...prev, active: true }));
            const res = await fetch("/api/rides/active", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 404) {
                setActiveRide(null);
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to fetch active ride");
            }

            const data = await res.json();
            setActiveRide(data);
        } catch (err: any) {
            console.error("Error fetching active ride:", err);
            setActiveRide(null);
        } finally {
            setLoading(prev => ({ ...prev, active: false }));
        }
    };

    const startRide = async () => {
        if (!selectedScooter) {
            alert("Please select a scooter");
            return;
        }

        try {
            setLoading(prev => ({ ...prev, starting: true }));
            const res = await fetch("/api/rides/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    scooterId: selectedScooter
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to start ride");
            }

            alert("Ride started successfully!");
            setActiveRide(data.ride);
            setSelectedScooter(null);
            fetchScooters();
        } catch (err: any) {
            alert(err.message || "Failed to start ride");
        } finally {
            setLoading(prev => ({ ...prev, starting: false }));
        }
    };

    const endRide = async () => {
        if (!activeRide) return;

        try {
            setLoading(prev => ({ ...prev, ending: true }));
            const res = await fetch("/api/rides/end", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    endLocation: "Ilidza",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to end ride");
            }

            alert(`Ride completed! Total cost: €${data.ride.totalCost.toFixed(2)}`);
            setActiveRide(null);
            fetchScooters();
        } catch (err: any) {
            alert(err.message || "Failed to end ride");
        } finally {
            setLoading(prev => ({ ...prev, ending: false }));
        }
    };

    useEffect(() => {
        if (token) {
            fetchScooters();
            fetchActiveRide();
        } else {
            setError("Please login to view rides");
        }
    }, [token]);

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!token) {
        return (
            <div className="p-5 text-center">
                <h1 className="text-2xl font-bold mb-5">Rides</h1>
                <p className="text-red-500 my-5">
                    Please login to view and start rides
                </p>
            </div>
        );
    }

    if (error && !loading.scooters && !loading.active) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Rides</h1>
                <p className="text-red-500">Error: {error}</p>
                <button
                    onClick={fetchScooters}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Rides</h1>

            {loading.active ? (
                <div className="p-5 text-center">
                    <p>Checking for active ride...</p>
                </div>
            ) : activeRide ? (
                <div className="bg-black border border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold text-blue-800">
                            Active Ride
                        </h2>
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            IN PROGRESS
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Scooter</p>
                            <p className="font-semibold">#{activeRide.scooterId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Started</p>
                            <p className="font-semibold">{formatTime(activeRide.startTime)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">From</p>
                            <p className="font-semibold">{activeRide.startLocation || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Date</p>
                            <p className="font-semibold">{formatDate(activeRide.startTime)}</p>
                        </div>
                    </div>

                    <button
                        onClick={endRide}
                        disabled={loading.ending}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                            loading.ending ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {loading.ending ? "Ending..." : "🛑 End Ride"}
                    </button>
                </div>
            ) : (
                <div className="bg-gray border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-5">Start New Ride</h2>

                    {loading.scooters ? (
                        <p>Loading scooters...</p>
                    ) : scooters.length === 0 ? (
                        <p className="text-gray-600">No scooters available at the moment.</p>
                    ) : (
                        <>
                            <select
                                value={selectedScooter || ""}
                                onChange={(e) => setSelectedScooter(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                            >
                                <option className="" value="">Select a scooter</option>
                                {scooters.map(scooter => (
                                    <option className="" key={scooter.id} value={scooter.id}>
                                        {scooter.name || `Scooter #${scooter.id}`} • {scooter.battery_level}% battery • {scooter.current_location}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={startRide}
                                disabled={!selectedScooter || loading.starting}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                                    !selectedScooter || loading.starting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {loading.starting ? "Starting..." : "Start Ride"}
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="bg-black border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        Available Scooters ({scooters.length})
                    </h2>
                    <button
                        onClick={fetchScooters}
                        disabled={loading.scooters}
                        className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                            loading.scooters ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                        {loading.scooters ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {scooters.length === 0 ? (
                    <p className="text-gray-600 text-center py-5">
                        No scooters available at the moment.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scooters.map((scooter) => (
                            <div
                                key={scooter.id}
                                className="border border-gray-300 rounded-lg p-4 bg-black text-white"
                            >
                                <h3 className="text-xl font-bold mb-3">Scooter #{scooter.id}</h3>

                                <p className="font-bold mb-2">
                                    Status:{" "}
                                    <span className={
                                        scooter.status === "available" ? "text-green-400" :
                                            scooter.status === "in_use" ? "text-yellow-400" : "text-red-400"
                                    }>
                                        {scooter.status}
                                    </span>
                                </p>

                                <p className="font-bold mb-2">
                                    Battery: {scooter.battery_level}%
                                </p>

                                <p className="font-bold mb-2">
                                    Location: {scooter.current_location}
                                </p>

                                {scooter.name && (
                                    <p className="font-bold">
                                        Name: {scooter.name}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Rides;