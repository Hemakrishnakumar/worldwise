/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
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
import { useURLPosition } from "../hooks/useURLPosition";

const Map = () => {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([0.5, 80.6]);
  const [lat, lng] = useURLPosition();
  const {
    getPosition,
    isLoading: isGeoLocationLoading,
    position: geoLocation,
  } = useGeolocation();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocation.lat) setMapPosition([geoLocation.lat, geoLocation.lng]);
  }, [geoLocation]);

  return (
    <div className={styles.mapContainer}>
      {geoLocation.lat == mapPosition[0] || (
        <Button type="position" onClick={getPosition}>
          {isGeoLocationLoading ? "Loading..." : "Get Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={12}
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
