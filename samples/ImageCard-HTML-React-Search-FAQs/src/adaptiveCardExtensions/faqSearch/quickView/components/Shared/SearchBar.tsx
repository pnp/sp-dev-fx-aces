import * as React from "react";
import { useState } from "react";
import { SearchBox } from "@fluentui/react"; 
import { debounce } from "lodash"; 

interface ISearchBarProps {
  onSearch: (query: string) => void; 
}

const SearchBar: React.FC<ISearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState<string>(""); 

  // Debounce the search function to reduce frequent updates
  const debouncedSearch = React.useCallback(
    debounce((newSearchQuery: string) => {
      onSearch(newSearchQuery);
    }, 500), // 500ms delay before applying the search
    [onSearch]
  );

  // Handle search box input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
    setSearchText(newValue || ""); // Update the local state
    debouncedSearch(newValue || ""); // Pass the search value to the debounced search
  };

  // Handle clearing the search (when the 'X' is clicked)
  const handleSearchClear = () => {
    setSearchText(""); // Reset the local state to clear the input
    debouncedSearch(""); // Immediately clear the search in the parent component
    onSearch(""); // Trigger refetching of all items by passing an empty string
  };

  return (
    <SearchBox
      placeholder="Search..."
      value={searchText} 
      onChange={handleSearchChange} // Handle search change events
      onClear={handleSearchClear}   // Handle when the 'X' button is clicked
      clearButtonProps={{ ariaLabel: "Clear search" }}
    />
  );
};

export default SearchBar;
