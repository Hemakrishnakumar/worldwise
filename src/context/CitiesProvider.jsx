/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(prev, action) {
  switch (action.type) {
    case "setCities":
      return {
        ...prev,
        cities: action.value,
        isLoading: false,
      };

    case "addCity":
      return {
        ...prev,
        cities: [...prev.cities, action.value],
        isLoading: false,
        currentCity: action.value,
      };

    case "deleteCity":
      return {
        ...prev,
        cities: prev.cities.filter((city) => city.id !== action.value),
        isLoading: false,
        currentCity: {},
      };

    case "setCity":
      return {
        ...prev,
        currentCity: action.value,
        isLoading: false,
      };

    case "load":
      return {
        ...prev,
        isLoading: true,
        error: "",
      };

    case "error":
      return {
        ...prev,
        error: "something went wrong",
        isLoading: false,
      };

    default:
      return initialState;
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    getCities();
    async function getCities() {
      dispatch({ type: "load" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "setCities", value: data });
      } catch {
        dispatch({ type: "error" });
      }
    }
  }, []);

  async function addCity(newCity) {
    dispatch({ type: "load" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "addCity", value: data });
    } catch {
      dispatch({ type: "error" });
    }
  }

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "load" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "setCity", value: data });
    } catch {
      dispatch({ type: "error" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "load" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
      dispatch({ type: "deleteCity", value: id });
    } catch {
      dispatch({ type: "error" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  return useContext(CitiesContext);
}

export { CitiesProvider, useCities };
