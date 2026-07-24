"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePointListService = void 0;
var tslib_1 = require("tslib");
var sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
var SharePointListService = /** @class */ (function () {
    function SharePointListService(context) {
        if (!context) {
            throw new Error('SharePointListService requires a valid SPFx context.');
        }
        this._sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context));
    }
    SharePointListService.prototype.getListItems = function (listName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._sp.web.lists.getByTitle(listName).items.select('Id', 'Title')()];
            });
        });
    };
    return SharePointListService;
}());
exports.SharePointListService = SharePointListService;
//# sourceMappingURL=SharePointListService.js.map