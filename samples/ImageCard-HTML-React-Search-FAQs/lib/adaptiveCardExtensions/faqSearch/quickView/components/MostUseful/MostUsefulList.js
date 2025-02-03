import * as React from "react";
import { useState, useCallback } from "react";
import ListItem from "../Shared/ListItem";
import useListItems from "../../../hooks/useListItems";
import CategoryDropdown from "../Shared/CategoryDropdown"; // Import the shared component
var MostUsefulList = function (_a) {
    var context = _a.context, siteUrl = _a.siteUrl, listName = _a.listName, categories = _a.categories, faqFilterLabel = _a.faqFilterLabel;
    var _b = useState(""), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = useListItems(context, siteUrl, listName, "", // No search query here
    selectedCategory, "HelpfulCount" // Sort by helpful count
    ), filteredItems = _c.filteredItems, loading = _c.loading, error = _c.error;
    var onCategoryChange = useCallback(function (event, option) {
        if (option) {
            setSelectedCategory(option.key);
        }
    }, []);
    return (React.createElement("div", null,
        React.createElement("h2", null, "Most Useful Questions"),
        React.createElement(CategoryDropdown, { categories: categories, selectedCategory: selectedCategory, onCategoryChange: onCategoryChange, label: faqFilterLabel }),
        React.createElement("br", null),
        loading && React.createElement("p", null, "Loading..."),
        error && React.createElement("p", null, error),
        filteredItems && filteredItems.length === 0 && (React.createElement("p", null, "No useful questions available.")),
        filteredItems &&
            filteredItems
                .slice(0, 10)
                .map(function (item) { return (React.createElement(ListItem, { key: item.Id, item: item, listName: listName, context: context })); })));
};
export default MostUsefulList;
//# sourceMappingURL=MostUsefulList.js.map