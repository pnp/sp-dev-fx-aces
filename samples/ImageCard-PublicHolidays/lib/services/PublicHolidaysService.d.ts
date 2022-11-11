import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { IPublicHoliday } from "../models/IPublicHoliday";
import { IAvailableLocation } from "../models/IAvailableLocation";
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
export declare class PublicHolidaysService {
    private _sp;
    context: AdaptiveCardExtensionContext;
    setup(context: AdaptiveCardExtensionContext): void;
    getOfficeLocation(userProfileProperty: string): Promise<string>;
    updateOfficeLocation(userProfileProperty: string, newLocation: string): Promise<void>;
    getUpcomingPublicHolidays(listGUID: string, limitToDate: IDateTimeFieldValue, currentLocation: string, rowCount?: number): Promise<IPublicHoliday[]>;
    getAvailableLocations(listGUID: string): Promise<IAvailableLocation>;
}
declare const HolidayService: PublicHolidaysService;
export default HolidayService;
//# sourceMappingURL=PublicHolidaysService.d.ts.map