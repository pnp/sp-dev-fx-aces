import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import { extendFactory, dateAdd } from "@pnp/core";
import { Caching, ICachingProps } from "@pnp/queryable";
import { TermStore, ITermStore, ITaxonomyProperty, ITermInfo, ITermSetInfo } from "@pnp/sp/taxonomy";
import { Web, IWeb } from "@pnp/sp/webs";
import "@pnp/sp/taxonomy";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Office, OfficeLocationWeather } from "./types";
import { Logger, LogLevel } from "@pnp/logging";
import { HttpClient } from "@microsoft/sp-http";
import { find, isEmpty } from '@microsoft/sp-lodash-subset';


const LOG_SOURCE: string = "🔶 OfficeLocationService";
const CACHE_KEY_PREFIX: string = "OfficeLocations_";
export const PLACEHOLDER_IMAGE_URL: string = "https://via.placeholder.com/400x240?text=Map%20unavailable";
let _sp: SPFI = null;

const cachingProps: ICachingProps = {
    store: "local",
    expireFunc: () => dateAdd(new Date(), "day", 1)
}

export function getSP(context?: AdaptiveCardExtensionContext): SPFI {

    if (_sp === null && typeof context !== "undefined") {
        _sp = spfi().using(SPFx(context));
    }

    return _sp;
}

declare module "@pnp/sp/taxonomy" {
    interface ITermStore {
        validateTermSet: (this: ITermStore, termSetId: string, termSetCustomPropertyKey: string, termSetCustomPropertyValue: string) => Promise<boolean>;
        getOfficeTerms: (this: ITermStore, termSetId: string) => Promise<Office[]>;
    }
}

declare module "@pnp/sp/webs" {
    interface IWeb {
        getOfficeItems: (this: IWeb, listId: string) => Promise<Office[]>;
        getOfficeLocationWeather: (this: IWeb, officeName: string, weatherListId: string) => Promise<OfficeLocationWeather>;
    }
}

extendFactory(TermStore, {

    validateTermSet: async function (this: ITermStore, termSetId: string, termSetCustomPropertyKey: string, termSetCustomPropertyValue: string): Promise<boolean> {
        let officesTermset: ITermSetInfo = null;

        officesTermset = await this.sets.getById(termSetId)
            .select("id", "properties")
            .using(Caching({ ...cachingProps, keyFactory: () => `${CACHE_KEY_PREFIX}termset` }))();

        if (isEmpty(officesTermset)) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - error getting termset`, LogLevel.Error);
            return false;
        }

        let termsetCustomProperties: ITaxonomyProperty[] = officesTermset.properties;
        let usedForOfficeLocationsProperty: ITaxonomyProperty = find(termsetCustomProperties, (p: ITaxonomyProperty) => p.key === termSetCustomPropertyKey);

        if (isEmpty(usedForOfficeLocationsProperty)) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - termset does not have the property UsedForOfficeLocations`, LogLevel.Warning);
            return false;
        }

        if (usedForOfficeLocationsProperty.value !== termSetCustomPropertyValue) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - termset's prroperty UsedForOfficeLocations is not set to true`, LogLevel.Warning);
            return false;
        }

        return true;
    },

    getOfficeTerms: async function (this: ITermStore, termSetId: string): Promise<Office[]> {
        try {
            let officeTerms: ITermInfo[] = [];

            officeTerms = await this.sets.getById(termSetId).terms
                .select("id", "labels", "properties")
                .using(Caching({ ...cachingProps, keyFactory: () => `${CACHE_KEY_PREFIX}terms` }))();
            console.debug(`${LOG_SOURCE} (getOfficesFromTermStore) - Data from term store - %o`, officeTerms);

            let offices: Office[] = officeTerms.map(term => {

                const termProperties: ITaxonomyProperty[] = term.properties;

                return {
                    uniqueId: term.id,
                    name: term.labels[0].name,
                    address: find(termProperties, (p: ITaxonomyProperty) => p.key === "Address")?.value ?? null,
                    latitude: find(termProperties, (p: ITaxonomyProperty) => p.key === "Latitude")?.value ?? null,
                    longitude: find(termProperties, (p: ITaxonomyProperty) => p.key === "Longitude")?.value ?? null,
                    mapImageLink: find(termProperties, (p: ITaxonomyProperty) => p.key === "MapImageLink")?.value ?? PLACEHOLDER_IMAGE_URL,
                    timeZone: find(termProperties, (p: ITaxonomyProperty) => p.key === "TimeZone")?.value ?? null,
                    pageUrl: find(termProperties, (p: ITaxonomyProperty) => p.key === "PageUrl")?.value ?? null,
                    managerEmailAddress: find(termProperties, (p: ITaxonomyProperty) => p.key === "ManagerEmailAddress")?.value ?? null
                };
            });

            console.debug(`${LOG_SOURCE} (getOfficesFromTermStore) - formatted data - %o`, offices);
            return offices;
        } catch (error) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - ${error}`, LogLevel.Error);
            console.error(error);
            return null;
        }
    }
});

extendFactory(Web, {

    getOfficeItems: async function (this: IWeb, listId: string): Promise<Office[]> {
        try {

            const selectFields: string = "Id,Title,Address,Latitude,Longitude,MapImageLink,TimeZone,PageUrl,ManagerEmailAddress";
            const officeListItems: any[] = await this.lists.getById(listId).items
                .select(selectFields)
                .using(Caching({ ...cachingProps, keyFactory: () => `${CACHE_KEY_PREFIX}listitems` }))();
            console.debug(`${LOG_SOURCE} (getOfficesFromList) - Data from list - %o`, officeListItems);

            let offices: Office[] = officeListItems.map(item => {
                return {
                    uniqueId: item.Id,
                    name: item.Title,
                    address: item.Address ?? null,
                    latitude: item.Latitude ?? null,
                    longitude: item.Longitude ?? null,
                    mapImageLink: item.MapImageLink ?? PLACEHOLDER_IMAGE_URL,
                    timeZone: item.TimeZone ?? null,
                    pageUrl: item.PageUrl ?? null,
                    managerEmailAddress: item.ManagerEmailAddress ?? null,
                };
            });
            console.debug(`${LOG_SOURCE} (getOfficesFromList) - formatted data - %o`, offices);
            return offices;
        } catch (error) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromList) - ${error}`, LogLevel.Error);
            console.error(error);
            return null;
        }
    },

    getOfficeLocationWeather: async function (this: IWeb, officeName: string, weatherListId: string): Promise<OfficeLocationWeather> {
        try {

            const officeWeatherListItems: any[] = await this.lists.getById(weatherListId)
                .items.select("Title", "Icon", "Temperature", "High", "Low", "WindSpeed")
                .filter("Title eq '" + officeName + "'")();
            console.debug(`${LOG_SOURCE} (getOfficeLocationWeatherFromList) - Data from list - %o`, officeWeatherListItems);

            if (officeWeatherListItems.length === 0) {
                Logger.write(`${LOG_SOURCE} (getOfficeLocationWeatherFromList) - Office weather data not found`, LogLevel.Warning);
                return null;
            }

            return {
                icon: officeWeatherListItems[0].Icon,
                temperature: parseFloat(officeWeatherListItems[0].Temperature).toFixed(1),
                high: parseFloat(officeWeatherListItems[0].High).toFixed(0),
                low: parseFloat(officeWeatherListItems[0].Low).toFixed(0),
                windSpeed: `${parseFloat(officeWeatherListItems[0].WindSpeed).toFixed(0)} km/h`
            };
        } catch (error) {
            Logger.write(`${LOG_SOURCE} (getOfficeLocationWeatherFromList) - ${error}`, LogLevel.Error);
            console.error(error);
            return null;
        }
    }

});


export async function getOfficeLocationWeatherFromAPI(httpClient: any, openWeatherMapApiKey: string, latitude: string, longitude: string): Promise<OfficeLocationWeather> {
    try {

        if (isEmpty(latitude) || isEmpty(longitude)) {
            Logger.write(`${LOG_SOURCE} (getOfficeLocationWeatherFromAPI) - co-ordinates are empty`, LogLevel.Warning);
            return null;
        }

        const weatherData = await httpClient.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`, HttpClient.configurations.v1);
        const weather: any = await weatherData.json();
        console.debug(`${LOG_SOURCE} (getOfficeLocationWeatherFromAPI) - Weather data - %o`, weather);

        return {
            icon: `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
            temperature: `${weather.main.temp.toFixed(0)}`,
            high: `${weather.main.temp_max.toFixed(1)}`,
            low: `${weather.main.temp_min.toFixed(1)}`,
            windSpeed: `${Math.round(weather.wind.speed * 3.6)} km/h`
        };
    } catch (error) {
        Logger.write(`${LOG_SOURCE} (getOfficeLocationWeatherFromAPI) - ${error}`, LogLevel.Error);
        console.error(error);
        return null;
    }
}