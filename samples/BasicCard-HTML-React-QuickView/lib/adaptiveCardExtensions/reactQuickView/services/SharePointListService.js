import { __awaiter, __generator } from "tslib";
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
var SharePointListService = /** @class */ (function () {
    function SharePointListService(context) {
        if (!context) {
            throw new Error('SharePointListService requires a valid SPFx context.');
        }
        this._sp = spfi().using(SPFx(context));
    }
    SharePointListService.prototype.getListItems = function (listName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._sp.web.lists.getByTitle(listName).items.select('Id', 'Title')()];
            });
        });
    };
    return SharePointListService;
}());
export { SharePointListService };
//# sourceMappingURL=SharePointListService.js.map