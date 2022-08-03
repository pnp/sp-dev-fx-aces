import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { IFieldInfo } from "@pnp/sp/fields/types";
import { IPublicHoliday } from "../models/IPublicHoliday";
import { IAvailableLocation, IAvailableLocationItem } from "../models/IAvailableLocation";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { ImageHelper, IImageHelperRequest } from '@microsoft/sp-image-helper';
import * as moment from 'moment';
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
import { IList, IListInfo } from "@pnp/sp/lists";

export class PublicHolidaysService {
    private _sp: SPFI;
    public context: AdaptiveCardExtensionContext;

    public setup(context: AdaptiveCardExtensionContext): void {
        if (!this._sp && typeof context !== "undefined") {
            this._sp = spfi().using(SPFx(context));
            this.context = context;
        }
    }

    public getOfficeLocation(userProfileProperty: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.context.msGraphClientFactory
                .getClient("3")
                .then((client: MSGraphClientV3): void => {
                    client
                        .api(`/me?$select=${userProfileProperty}`)
                        .get((error, response, rawResponse) => {
                            resolve(response[userProfileProperty] as string);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        })
                })
                .catch((error: Error) => {
                    reject(error);
                });
        });
    }

    public updateOfficeLocation(userProfileProperty: string, newLocation: string): Promise<void> {
        const userLocation: any = JSON.parse(`{"${userProfileProperty}" : "${newLocation}"}`);

        return new Promise<void>((resolve, reject) => {
            this.context.msGraphClientFactory
                .getClient("3")
                .then((client: MSGraphClientV3): void => {
                    client
                        .api('/me')
                        .update(userLocation)
                        .catch((error: Error) => {
                            reject(error);
                        })
                })
                .then(() => {
                    resolve();
                })
                .catch((error: Error) => {
                    reject(error);
                })
        });
    }

    public async getUpcomingPublicHolidays(listGUID: string, limitToDate: IDateTimeFieldValue, currentLocation: string, rowCount?: number): Promise<IPublicHoliday[]> {
        let publicHolidays: IPublicHoliday[] = [];
        const currentDateISOFormat: string = new Date(Date.now()).toISOString();

        try {
            const rowLimitQuery: string = rowCount ? `<RowLimit>${rowCount}</RowLimit>` : '';
            const andQuery: string = limitToDate ?
                `<And>
                    <And>
                        <Geq>
                            <FieldRef Name='Date' />
                            <Value IncludeTimeValue='TRUE' Type='DateTime'>${currentDateISOFormat}</Value>
                        </Geq>
                        <Leq>
                            <FieldRef Name='Date' />
                            <Value IncludeTimeValue='TRUE' Type='DateTime'>${new Date(limitToDate.displayValue).toISOString()}</Value>
                        </Leq>
                    </And>
                    <Contains>
                        <FieldRef Name='OfficeLocation' /><Value Type='Choice'>${currentLocation}</Value>
                    </Contains>
                </And>`
                :
                `<And>
                    <Geq>
                        <FieldRef Name='Date' />
                        <Value IncludeTimeValue='TRUE' Type='DateTime'>${currentDateISOFormat}</Value>
                    </Geq>
                    <Contains>
                        <FieldRef Name='OfficeLocation' /><Value Type='Choice'>${currentLocation}</Value>
                    </Contains>
                </And>`;

            publicHolidays = await this._sp.web.lists
                .getById(listGUID)
                .getItemsByCAMLQuery({
                    ViewXml: `<View>
                                <Query>
                                    <ViewFields>
                                        <FieldRef Name="Title" />
                                        <FieldRef Name="OfficeLocation" />
                                        <FieldRef Name="Date" />
                                        <FieldRef Name="Image" />
                                    </ViewFields>
                                    <Where>
                                        ${andQuery}
                                    </Where>
                                    <OrderBy>
                                        <FieldRef Name='Date' Ascending='True' />
                                    </OrderBy>
                                </Query>
                                ${rowLimitQuery}
                            </View>`,
                });

            publicHolidays.forEach((ph: IPublicHoliday) => {
                ph.DateValue = moment(ph.Date).format("dddd, MMM D")
                ph.ImageValue = ph.Image ?
                    ImageHelper.convertToImageUrl(
                        {
                            sourceUrl: JSON.parse(ph.Image).serverRelativeUrl,
                            width: 200
                        } as IImageHelperRequest
                    )
                    : require('../adaptiveCardExtensions/publicHolidays/assets/PublicHoliday.jpg')
            });
        }
        catch (error) {
            return Promise.reject(error);
        }

        return publicHolidays;
    }

    public async getAvailableLocations(listGUID: string): Promise<IAvailableLocation> {
        const availableLocations: IAvailableLocation = { listTitle: "", items: [] };

        try {
            const officeLocationList: IList = await this._sp.web.lists.getById(listGUID);
            const officeLocationListTitle: IListInfo = await officeLocationList.select("Title")();
            const officeLocationField: IFieldInfo = await this._sp.web.lists
                .getById(listGUID).fields.getByTitle('OfficeLocation')();
            const officeLocationsFieldChoices: string[] = await officeLocationField.Choices;

            officeLocationsFieldChoices.forEach(choice => {
                const availableLocationItem: IAvailableLocationItem = {
                    title: choice,
                    value: choice
                };
                availableLocations.items.push(availableLocationItem);
            });

            availableLocations.listTitle = officeLocationListTitle.Title;

            return Promise.resolve(availableLocations);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}

const HolidayService: PublicHolidaysService = new PublicHolidaysService();
export default HolidayService;