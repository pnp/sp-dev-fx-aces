import * as React from "react";
import { useState } from "react";
import { SearchBox } from "@fluentui/react";
import { debounce } from "lodash";
var SearchBar = function (_a) {
    var onSearch = _a.onSearch;
    var _b = useState(""), searchText = _b[0], setSearchText = _b[1];
    // Debounce the search function to reduce frequent updates
    var debouncedSearch = React.useCallback(debounce(function (newSearchQuery) {
        onSearch(newSearchQuery);
    }, 500), // 500ms delay before applying the search
    [onSearch]);
    // Handle search box input changes
    var handleSearchChange = function (event, newValue) {
        setSearchText(newValue || ""); // Update the local state
        debouncedSearch(newValue || ""); // Pass the search value to the debounced search
    };
    // Handle clearing the search (when the 'X' is clicked)
    var handleSearchClear = function () {
        setSearchText(""); // Reset the local state to clear the input
        debouncedSearch(""); // Immediately clear the search in the parent component
        onSearch(""); // Trigger refetching of all items by passing an empty string
    };
    return (React.createElement(SearchBox, { placeholder: "Search...", value: searchText, onChange: handleSearchChange, onClear: handleSearchClear, clearButtonProps: { ariaLabel: "Clear search" } }));
};
export default SearchBar;
//# sourceMappingURL=SearchBar.js.map