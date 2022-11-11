var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import PublicHolidaysService from '../../../services/PublicHolidaysService';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
var SuccessView = /** @class */ (function (_super) {
    __extends(SuccessView, _super);
    function SuccessView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SuccessView.prototype, "data", {
        get: function () {
            return {
                subTitle: strings.LocationUpdatedSuccessText,
                title: '',
                description: '',
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SuccessView.prototype, "template", {
        get: function () {
            return require('./template/SuccessViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    SuccessView.prototype.onAction = function (action) {
        var _this = this;
        if (action.id === 'close') {
            if (this.state.isLocationUpdated || !this.state.areHolidaysLoaded) {
                PublicHolidaysService.getOfficeLocation(this.state.userProfileProperty)
                    .then(function (currentLocation) {
                    PublicHolidaysService.getUpcomingPublicHolidays(_this.state.listGUID, _this.state.limitToDate, currentLocation, 1)
                        .then(function (holidays) {
                        _this.setState(__assign(__assign({}, _this.state), { isLocationUpdated: false, areHolidaysLoaded: false, officeLocation: currentLocation, upcomingHolidays: holidays }));
                    })
                        .catch(function (error) {
                        console.error('Error: ', error);
                        throw error;
                    });
                    _this.quickViewNavigator.close();
                })
                    .catch(function (error) {
                    console.error('Error: ', error);
                    throw error;
                });
            }
        }
    };
    return SuccessView;
}(BaseAdaptiveCardView));
export { SuccessView };
//# sourceMappingURL=SuccessView.js.map