import { useState } from "react";
import { isAuthenticated, logout } from "./lib/auth";
import LoginForm from "../src/components/LoginForm";
import App from "./App";

export default function MainApp() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  if (!loggedIn) {
    return <LoginForm onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            logout();
            setLoggedIn(false);
          }}>
          Kirjaudu ulos
        </button>
      </div>

      <App />
    </>
  );
}
