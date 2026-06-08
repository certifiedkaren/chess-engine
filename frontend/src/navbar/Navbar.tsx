import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <NavLink className={styles.brand} to="/" aria-label="Chess Analyzer">
        <img
          src="/queen-logo.png"
          alt="Chess Analyzer logo"
          className={styles.logo}
        ></img>
        Chess Analyzer
      </NavLink>
      <nav className={styles.links} aria-label="Primary navigation">
        <NavLink className={styles.link} to="/">
          Analyze Game
        </NavLink>
        <NavLink className={styles.link} to="/saved-games">
          Saved Games
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
