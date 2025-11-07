import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-view">
      <h1>Welcome to CodeCaddy</h1>
      <p>Your personal book collection manager</p>
      <div className="quick-actions">
        <button onClick={() => navigate("/search")} className="btn-primary">
          Search Books
        </button>
        <button
          onClick={() => navigate("/collection")}
          className="btn-secondary"
        >
          View Collection
        </button>
      </div>
    </div>
  );
}

export default HomePage;
