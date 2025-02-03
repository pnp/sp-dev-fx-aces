var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect, useCallback } from "react";
import { useSPContext } from "./useSPContext";
import { Logger } from "@pnp/logging"; // Import PnP logging
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
var useListItems = function (context, siteUrl, listName, searchQuery, selectedCategory, sortField // Default sort by Title
) {
    if (sortField === void 0) { sortField = "Title"; }
    var _a = useState(null), filteredItems = _a[0], setFilteredItems = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var fetchListItems = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var sp, list, filterQuery, sortOrder, listItems, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    sp = useSPContext(context, siteUrl);
                    list = sp.web.lists.getByTitle(listName);
                    filterQuery = "";
                    if (searchQuery) {
                        filterQuery += "substringof('".concat(searchQuery, "', Title)");
                    }
                    if (selectedCategory) {
                        if (filterQuery)
                            filterQuery += " and ";
                        filterQuery += "Category eq '".concat(selectedCategory, "'");
                    }
                    sortOrder = sortField === "HelpfulCount" ? false : true;
                    return [4 /*yield*/, list.items
                            .filter(filterQuery) // Apply filter
                            .orderBy(sortField, sortOrder) // Apply sorting
                            .top(50)()];
                case 2:
                    listItems = _a.sent();
                    // Update state with fetched items
                    setFilteredItems(listItems);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = "Failed to load items from list: ".concat(listName, ". Error: ").concat(err_1.message);
                    Logger.write(errorMessage, 3 /* LogLevel.Error */);
                    setError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [context, listName, searchQuery, selectedCategory, sortField]);
    useEffect(function () {
        fetchListItems();
    }, [fetchListItems]);
    return { filteredItems: filteredItems, loading: loading, error: error };
};
export default useListItems;
//# sourceMappingURL=useListItems.js.map