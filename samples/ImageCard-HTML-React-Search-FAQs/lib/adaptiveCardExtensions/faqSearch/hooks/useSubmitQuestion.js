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
import { useState, useCallback } from "react";
import { useSPContext } from "../hooks/useSPContext"; // Assumed you have a context hook for SP
export var useSubmitQuestion = function (context, siteUrl, listName) {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var _c = useState(false), success = _c[0], setSuccess = _c[1];
    var submitQuestion = useCallback(function (_a) {
        var question = _a.question, category = _a.category;
        return __awaiter(void 0, void 0, void 0, function () {
            var sp, list, newItem, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        setSuccess(false);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        sp = useSPContext(context, siteUrl);
                        list = sp.web.lists.getByTitle(listName);
                        newItem = {
                            Title: question,
                            Category: category,
                        };
                        // Add a new item to the SharePoint list
                        return [4 /*yield*/, list.items.add(newItem)];
                    case 2:
                        // Add a new item to the SharePoint list
                        _b.sent();
                        setSuccess(true); // Mark the submission as successful
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        console.error("Error submitting question:", err_1);
                        setError("Failed to submit question.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false); // Stop loading indicator
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [context, siteUrl, listName]);
    // Reset success and error states
    var resetStatus = useCallback(function () {
        setSuccess(false);
        setError(null);
    }, []);
    return { submitQuestion: submitQuestion, loading: loading, error: error, success: success, resetStatus: resetStatus };
};
//# sourceMappingURL=useSubmitQuestion.js.map