var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from "react";
import { Dropdown } from "@fluentui/react";
var CategoryDropdown = function (_a) {
    var categories = _a.categories, selectedCategory = _a.selectedCategory, onCategoryChange = _a.onCategoryChange, _b = _a.label, label = _b === void 0 ? "Filter by Category" : _b, _c = _a.placeholder, placeholder = _c === void 0 ? "All Categories" : _c;
    var options = __spreadArray([{ key: "", text: placeholder }], categories, true); // Prepend placeholder option
    return (React.createElement(Dropdown, { label: label, options: options, selectedKey: selectedCategory || "", onChange: onCategoryChange, placeholder: selectedCategory ? undefined : placeholder }));
};
export default React.memo(CategoryDropdown);
//# sourceMappingURL=CategoryDropdown.js.map