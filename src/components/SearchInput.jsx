import { useState, useEffect, useRef } from "react";
import useDebounce from "../hooks/useDebounce";
import SearchIcon from "@mui/icons-material/Search";
import "../styles/search-input.css";

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onSearch?.(debounced);
  }, [debounced]);

  

  return (
    <div className="search-input-wrapper">
      <SearchIcon className="search-icon" />
      <input
        type="search"
        placeholder="Search Shoes...."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
