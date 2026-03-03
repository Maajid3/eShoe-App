import "../styles/sidebar.css";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";

const CATEGORIES = [
  { value: "SNEAKER", label: "Sneakers" },
  { value: "LEATHER", label: "Leather Shoes" },
];

export default function Sidebar({ closeSidebar, setSelectedCat, selectedCat }) {
  const handleClick = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedCat([...selectedCat, value]);
    } else {
      setSelectedCat(selectedCat.filter((a) => a !== value));
    }
  };

  const clearFilter = () => {
    setSelectedCat([]);
    localStorage.removeItem("product_type");
  };

  return (
    <div className="sidebar-card">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <TuneIcon style={{ fontSize: "1.1rem" }} />
          <h2>Filters</h2>
          {selectedCat.length > 0 && (
            <span className="filter-count">{selectedCat.length}</span>
          )}
        </div>
        <button className="sidebar-close" onClick={closeSidebar}>
          <CloseIcon style={{ fontSize: "1.1rem" }} />
        </button>
      </div>

      <div className="filter-section">
        <h3>Categories</h3>
        <div className="category-list">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className={`category-chip ${selectedCat.includes(cat.value) ? "checked" : ""}`}
            >
              <input
                type="checkbox"
                value={cat.value}
                checked={selectedCat.includes(cat.value)}
                onChange={handleClick}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {selectedCat.length > 0 && (
        <button className="clear-btn" onClick={clearFilter}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
