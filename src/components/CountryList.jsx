import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesProvider";

const CountryList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities?.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countries = cities.reduce(
    (arr, city) =>
      arr.map((el) => el.country).includes(city.country)
        ? arr
        : [...arr, { country: city.country, emoji: city.emoji }],
    []
  );

  return (
    <ul className={styles.countryList}>
      {countries?.map((country, id) => (
        <CountryItem key={id} country={country} />
      ))}
    </ul>
  );
};

export default CountryList;
