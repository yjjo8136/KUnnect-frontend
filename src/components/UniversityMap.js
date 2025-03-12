import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// ✅ `useEffect`를 활용하여 지도가 변경된 위치로 이동하도록 수정
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

const UniversityMap = ({ universities, center, zoom }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: "500px", width: "100%" }}>
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {universities.map((univ) => (
                <Marker key={univ.univId} position={[univ.latitude, univ.longitude]} icon={defaultIcon}>
                    <Popup>
                        <strong>{univ.univName}</strong><br />
                        {univ.country}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default UniversityMap;
