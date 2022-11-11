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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import { ChoiceFieldFormatType } from "@pnp/sp/fields";
// Class Services
var spService = /** @class */ (function () {
    function spService(context) {
        this.context = context;
        sp.setup({
            spfxContext: this.context
        });
        // Init
        this.onInit();
    }
    // OnInit Function
    spService.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
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
                        return [4 /*yield*/, sp.web.lists.getByTitle(listName).items
                                .filter("(StartDate lt datetime'" + today.toISOString() + "') and (EndDate eq null  or EndDate ge datetime'" + today.toISOString() + "')")
                                .orderBy("Created", true)()];
                    case 2:
                        items2 = _a.sent();
                        console.log(items2);
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
            var listExist, listAddResult, list, newList_1, view_1, batch_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._checkList(listName)];
                    case 1:
                        listExist = _a.sent();
                        console.log("List exist: ", listExist);
                        if (!!listExist) return [3 /*break*/, 6];
                        return [4 /*yield*/, sp.web.lists.add(listName)];
                    case 2:
                        listAddResult = _a.sent();
                        return [4 /*yield*/, listAddResult.list.get()];
                    case 3:
                        list = _a.sent();
                        return [4 /*yield*/, sp.web.lists.getByTitle(listName)];
                    case 4:
                        newList_1 = _a.sent();
                        return [4 /*yield*/, newList_1.defaultView];
                    case 5:
                        view_1 = _a.sent();
                        //checking columns are added to the collection or not
                        if (colListColumns.length > 0) {
                            batch_1 = sp.web.createBatch();
                            colListColumns.forEach(function (fieldName) {
                                if (fieldName == "QuickViewAdaptiveCardJSON" || fieldName == "QuickViewAdaptiveCardData") {
                                    newList_1.fields.inBatch(batch_1).addMultilineText(fieldName, 6, false, false, false);
                                }
                                else if (fieldName == "StartDate" || fieldName == "EndDate") {
                                    newList_1.fields.inBatch(batch_1).addDateTime(fieldName, 6);
                                }
                                else if (fieldName == "OnCardSelectionType") {
                                    newList_1.fields.inBatch(batch_1).addChoice("OnCardSelectionType", ["Noaction", "ExternalLink", "QuickView"], ChoiceFieldFormatType.Dropdown, false);
                                }
                                else {
                                    newList_1.fields.inBatch(batch_1).addText(fieldName, 255);
                                }
                            });
                            colListColumns.forEach(function (fieldName) {
                                view_1.fields.inBatch(batch_1).add(fieldName);
                            });
                            batch_1.execute().then(function (_result) {
                                console.log('List with columns created.');
                            }).catch(function (error) {
                                console.log(error);
                            });
                            return [2 /*return*/, "List with required columns created."];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, "List alreay exist"];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    spService.prototype._checkList = function (listName) {
        return __awaiter(this, void 0, void 0, function () {
            var filterList, boolResult, getList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterList = "Title eq '" + listName + "'";
                        boolResult = false;
                        return [4 /*yield*/, sp.web.lists.filter(filterList).get()];
                    case 1:
                        getList = _a.sent();
                        if (getList.length > 0) {
                            return [2 /*return*/, boolResult = true];
                        }
                        else {
                            return [2 /*return*/, boolResult];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return spService;
}());
export default spService;
//# sourceMappingURL=spprovider.js.map