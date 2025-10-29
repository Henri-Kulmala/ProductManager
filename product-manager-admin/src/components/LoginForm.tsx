import { useState } from "react";
import { login } from "../lib/auth";

type Props = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(username, password)) {
      onSuccess();
    } else {
      setError("Virheellinen käyttäjätunnus tai salasana.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card card">
        <img
          src="https://www.xn--blenhella-07a.fi/wp-content/uploads/2025/09/Bolen-Hella-W.svg"
          alt="logo"
            className="login-logo"
        />
        <h2>Kirjaudu hallintapaneeliin</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Käyttäjätunnus</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Syötä käyttäjätunnus"
            />
          </div>

          <div className="form-group">
            <label>Salasana</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Syötä salasana"
            />
          </div>

          {error && <p className="err">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary full">
              Kirjaudu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
