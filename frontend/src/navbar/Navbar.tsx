import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <NavLink className={styles.brand} to="/" aria-label="Chess Analyzer">
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
