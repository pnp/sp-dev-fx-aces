"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var QuickView_module_scss_1 = tslib_1.__importDefault(require("../QuickView.module.scss"));
var SharePointListService_1 = require("../../services/SharePointListService");
var QuickViewComponent = function (_a) {
    var context = _a.context, _b = _a.listName, listName = _b === void 0 ? '' : _b;
    var _c = React.useState([]), listItems = _c[0], setListItems = _c[1];
    var _d = React.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = React.useState(null), error = _e[0], setError = _e[1];
    React.useEffect(function () {
        var fetchListItems = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var service, items, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Guard against an undefined SharePoint context (prevents the destructure/undefined error on load)
                        if (!context) {
                            setError('SharePoint context is not available.');
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        // Guard against an undefined or empty list name
                        if (!listName || !listName.trim()) {
                            setError('The list name should be configured in the property pane.');
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        setError(null);
                        setLoading(true);
                        service = new SharePointListService_1.SharePointListService(context);
                        return [4 /*yield*/, service.getListItems(listName)];
                    case 2:
                        items = _a.sent();
                        setListItems(items);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        console.error('Error fetching list items:', err_1);
                        setError('An error occurred while fetching the list items. Please try again later.');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchListItems().catch(function (err) {
            console.error('Unexpected error fetching list items:', err);
            setError('An unexpected error occurred while loading the list items.');
            setLoading(false);
        });
    }, [context, listName]);
    return (React.createElement("div", { className: QuickView_module_scss_1.default.container },
        React.createElement("h2", null, "React-Based QuickView: Displaying List Items"),
        React.createElement("p", null,
            "List Name: ",
            listName),
        loading ? (React.createElement("p", null, "Loading items...")) : error ? (React.createElement("p", null, error)) : (React.createElement("ul", null, listItems.length > 0 ? (listItems.map(function (item) { return (React.createElement("li", { key: item.Id },
            React.createElement("p", null, item.Title))); })) : (React.createElement("p", null, "No items found in the list."))))));
};
exports.default = QuickViewComponent;
//# sourceMappingURL=QuickViewComponent.js.map