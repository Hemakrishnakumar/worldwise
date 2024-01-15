// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useURLPosition } from "../hooks/useURLPosition";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesProvider";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useURLPosition();
  const [isGeoCodeLoading, setIsGeoCodeLoading] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState("");
  const { addCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCityData() {
      setIsGeoCodeLoading(true);
      setGeoCodingError("");
      try {
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "This doesn't seems to be a city, Click somewhere else!😊"
          );

        setCityName(data.locality || data.city || "");
        setCountry(data.countryName);
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsGeoCodeLoading(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function submitHandler(e) {
    e.preventDefault();
    if (!country || !cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji: "🏳️‍⚧️",
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await addCity(newCity);
    navigate("/app/cities");
  }

  if (isGeoCodeLoading) return <Spinner />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the Map" />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={submitHandler}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(e) => setDate(e)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          type="primary"
          onClick={() => {
            submitHandler;
          }}
        >
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
