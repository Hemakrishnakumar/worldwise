/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";

const FAKE_USER = {
  name: "Krish",
  email: "krish@gmail.com",
  password: "krish555",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("isLoggedIn")),
  isAuthenticated:
    JSON.parse(localStorage.getItem("isLoggedIn")) === null ? false : true,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.value,
        isAuthenticated: true,
      };
    case "logout":
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      throw new Error("Unknown Action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", value: FAKE_USER });
      localStorage.setItem("isLoggedIn", JSON.stringify(FAKE_USER));
      return true;
    } else return false;
  }

  function logout() {
    dispatch({ type: "logout" });
    localStorage.removeItem("isLoggedIn");
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Use Context is being used outside of the Provider");
  return context;
}

export { useAuthContext, AuthProvider };
