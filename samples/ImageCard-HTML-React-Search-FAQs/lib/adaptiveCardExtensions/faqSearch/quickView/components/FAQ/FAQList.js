import * as React from "react";
import { useState, useCallback } from "react";
import CategoryDropdown from "../Shared/CategoryDropdown"; // Shared component
import SearchBar from "../Shared/SearchBar";
import useListItems from "../../../hooks/useListItems";
import ListItem from "../Shared/ListItem";
var FAQList = function (_a) {
    var context = _a.context, siteUrl = _a.siteUrl, listName = _a.listName, categories = _a.categories, faqFilterLabel = _a.faqFilterLabel;
    var _b = useState(""), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = useState(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = useListItems(context, siteUrl, listName, searchQuery, selectedCategory), filteredItems = _d.filteredItems, loading = _d.loading, error = _d.error;
    var onCategoryChange = useCallback(function (event, option) {
        if (option) {
            setSelectedCategory(option.key);
        }
    }, []);
    var handleSearch = function (query) {
        setSearchQuery(query);
    };
    return (React.createElement("div", null,
        React.createElement("h2", null, "Frequently Asked Questions"),
        React.createElement("div", { style: { width: "100%" } },
            React.createElement(SearchBar, { onSearch: handleSearch })),
        React.createElement(CategoryDropdown, { categories: categories, selectedCategory: selectedCategory, onCategoryChange: onCategoryChange, label: faqFilterLabel }),
        React.createElement("br", null),
        loading && React.createElement("p", null, "Loading..."),
        error && React.createElement("p", null, error),
        filteredItems && filteredItems.length === 0 && React.createElement("p", null, "No FAQs available."),
        filteredItems &&
            filteredItems.map(function (item) { return (React.createElement(ListItem, { key: item.Id, item: item, listName: listName, context: context })); })));
};
export default FAQList;
//# sourceMappingURL=FAQList.js.map