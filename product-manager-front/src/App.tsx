import ProductList from "./components/ProductList";

import "../src/assets/styles.css";

export default function App() {
  return (
    <>
      <main className="container">
        <img
          src="https://www.xn--blenhella-07a.fi/wp-content/uploads/2025/09/Asset-41.svg"
          alt="Bölen Hellan logo"
          className="logo"
        />
        <h1 style={{ textAlign: "center" }}>Bölen Hellan Tuotteet</h1>
        <ProductList />
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Bölen Herkku Oy. Kaikki oikeudet pidätetään.</p>
        <a href="https://www.xn--blenhella-07a.fi/" target="_blank" rel="noopener noreferrer">
          bölenhella.fi
        </a>
      </footer>
    </>
  );
}
