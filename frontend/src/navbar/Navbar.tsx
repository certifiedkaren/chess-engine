import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <a className={styles.brand} href="#analyze" aria-label="Chess Analyzer">
        Chess Analyzer
      </a>
      <nav className={styles.links} aria-label="Primary navigation">
        <a className={styles.link} href="#analyze">
          Analyze Game
        </a>
        <a className={styles.link} href="#saved-games">
          Saved Games
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
