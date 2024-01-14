/* eslint-disable react/prop-types */
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesProvider";
import { useGeolocation } from "../hooks/GeoLocation";
import Button from "./Button";

const Map = () => {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([0.5, 80.6]);
  const [searchParams] = useSearchParams();
  const {
    getPosition,
    isLoading: isGeoLocationLoading,
    position: geoLocation,
  } = useGeolocation();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocation.lat) setMapPosition([geoLocation.lat, geoLocation.lng]);
  }, [geoLocation]);

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isGeoLocationLoading ? "Loading..." : "Get Your Position"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
        <ChangePosition pos={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

function ChangePosition({ pos }) {
  const map = useMap();
  map.setView(pos);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
