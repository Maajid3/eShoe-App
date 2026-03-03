import SearchIcon from "@mui/icons-material/Search";
import SearchInput from "./SearchInput";
import "../styles/search-bar.css";

export default function SearchBar({ onSearch, setShowSearchBar }) {
  return (
    <>
      <div className="search-bar-ui">
        <SearchInput onSearch={onSearch} />
      </div>

      <button
        className="search-show-btn"
        onClick={() => setShowSearchBar((prev) => !prev)}
        aria-label="Search"
      >
        <SearchIcon style={{ fontSize: "1.2rem" }} />
      </button>
    </>
  );
}