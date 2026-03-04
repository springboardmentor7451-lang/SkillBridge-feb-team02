import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.nav}>
      <h2>ServeSync</h2>
      <Link to="/">Dashboard</Link>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  }
};

export default Navbar;