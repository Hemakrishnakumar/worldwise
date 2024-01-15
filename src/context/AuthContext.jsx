/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Krish",
  email: "krish@gmail.com",
  password: "krish555",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
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
      return initialState;
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
      return true;
    } else return false;
  }

  function logout() {
    dispatch({ type: "logout" });
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
