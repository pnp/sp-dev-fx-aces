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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/batching";
import { ChoiceFieldFormatType, DateTimeFieldFormatType } from "@pnp/sp/fields";
// Class Services
var spService = /** @class */ (function () {
    function spService(context) {
        this.context = context;
        this._sp = spfi().using(SPFx(this.context));
    }
    // Returns active announcement items (StartDate reached, EndDate not passed)
    spService.prototype.getListItems = function (listName) {
        return __awaiter(this, void 0, void 0, function () {
            var today, items2, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sp.web.lists.getByTitle(listName).items
                                .filter("(StartDate lt datetime'" + today.toISOString() + "') and (EndDate eq null  or EndDate ge datetime'" + today.toISOString() + "')")
                                .orderBy("Created", true)()];
                    case 2:
                        items2 = _a.sent();
                        return [2 /*return*/, items2];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    spService.prototype._createListwithColumns = function (listName, colListColumns) {
        return __awaiter(this, void 0, void 0, function () {
            var listExist, _a, batchedSP, executeFields, batchedFields_1, _b, batchedViewSP, executeView, batchedViewFields_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._checkList(listName)];
                    case 1:
                        listExist = _c.sent();
                        if (listExist) {
                            return [2 /*return*/, "List alreay exist"];
                        }
                        return [4 /*yield*/, this._sp.web.lists.add(listName)];
                    case 2:
                        _c.sent();
                        if (!(colListColumns.length > 0)) return [3 /*break*/, 5];
                        _a = this._sp.batched(), batchedSP = _a[0], executeFields = _a[1];
                        batchedFields_1 = batchedSP.web.lists.getByTitle(listName).fields;
                        colListColumns.forEach(function (fieldName) {
                            if (fieldName === "QuickViewAdaptiveCardJSON" || fieldName === "QuickViewAdaptiveCardData") {
                                batchedFields_1.addMultilineText(fieldName, { NumberOfLines: 6, RichText: false, RestrictedMode: false, AppendOnly: false }).catch(function (e) { return console.log(e); });
                            }
                            else if (fieldName === "StartDate" || fieldName === "EndDate") {
                                batchedFields_1.addDateTime(fieldName, { DisplayFormat: DateTimeFieldFormatType.DateTime }).catch(function (e) { return console.log(e); });
                            }
                            else if (fieldName === "OnCardSelectionType") {
                                batchedFields_1.addChoice("OnCardSelectionType", { Choices: ["Noaction", "ExternalLink", "QuickView"], EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false }).catch(function (e) { return console.log(e); });
                            }
                            else {
                                batchedFields_1.addText(fieldName, { MaxLength: 255 }).catch(function (e) { return console.log(e); });
                            }
                        });
                        return [4 /*yield*/, executeFields()];
                    case 3:
                        _c.sent();
                        _b = this._sp.batched(), batchedViewSP = _b[0], executeView = _b[1];
                        batchedViewFields_1 = batchedViewSP.web.lists.getByTitle(listName).defaultView.fields;
                        colListColumns.forEach(function (fieldName) {
                            batchedViewFields_1.add(fieldName).catch(function (e) { return console.log(e); });
                        });
                        return [4 /*yield*/, executeView()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, "List with required columns created."];
                }
            });
        });
    };
    spService.prototype._checkList = function (listName) {
        return __awaiter(this, void 0, void 0, function () {
            var filterList, getList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterList = "Title eq '".concat(listName, "'");
                        return [4 /*yield*/, this._sp.web.lists.filter(filterList)()];
                    case 1:
                        getList = _a.sent();
                        return [2 /*return*/, getList.length > 0];
                }
            });
        });
    };
    return spService;
}());
export default spService;
//# sourceMappingURL=spprovider.js.map