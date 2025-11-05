
import { useEffect, useState } from "react";
import { login, logout, getUser } from "./lib/auth";
import { supabase } from "./lib/supabase";
import App from "./App";

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) onSuccess();
    else setErr("Virheellinen sähköposti tai salasana");
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Syötä sähköpostiosoite"
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

          {err && <p style={{ color: "crimson" }}>{err}</p>}

          <div className="form-actions">
            <button type="submit" disabled={busy}className="btn-primary full">
              {busy ? "Kirjaudutaan…" : "Kirjaudu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MainApp() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

   
    getUser().then((u) => {
      if (!mounted) return;
      setLoggedIn(!!u);
      setLoading(false);
    });

   
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Ladataan…</div>;
  if (!loggedIn) return <LoginForm onSuccess={() => setLoggedIn(true)} />;

  return (
    <>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          className="btn-secondary"
          onClick={async () => {
            await logout();
            setLoggedIn(false);
          }}>
          Kirjaudu ulos
        </button>
      </div>
      <App />
    </>
  );
}
