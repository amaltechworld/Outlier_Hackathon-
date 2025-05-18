"use Client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
// import { useEffect } from "react";

// Fix default marker icon issue in Leaflet (important)
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
    ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src ?? markerIcon,
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  shadowUrl: markerShadow.src ?? markerShadow,
});

interface TripMapProps {
    location: LatLngExpression; // [latitude, longitude]
}

const TripMap = ({location}: TripMapProps) => {
  return (
      <MapContainer
          center={location}
          zoom={13}
          scrollWheelZoom={false}
          className="h-96 min-w-[350px] z-0 rounded-xl shadow-2xl"
      >
          <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
              <Popup>Selected Destination</Popup>
          </Marker>
      </MapContainer>
  );
}

export default TripMap