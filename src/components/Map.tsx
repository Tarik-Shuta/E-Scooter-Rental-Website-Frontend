import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
const scooterLocations = [
    { id: 1, lng: 18.2984, lat: 43.8402, name: "Scooter A" },
    { id: 2, lng: 18.3084, lat: 43.8313, name: "Scooter B" },
    { id: 3, lng: 18.3072, lat: 43.8217, name: "Scooter C" },
];

function Map() {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [18.4131, 43.8563],
            zoom: 12,
        });
        scooterLocations.forEach((scooter) => {
            new mapboxgl.Marker({ color:"#003A6B"})
                .setLngLat([scooter.lng, scooter.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(scooter.name))
                .addTo(map);
        });

        return () => map.remove();
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-[650px] rounded-3xl overflow-hidden"
        />
    );
}

export default Map;
