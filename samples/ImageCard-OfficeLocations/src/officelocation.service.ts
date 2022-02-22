import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ITermStoreInfo } from "@pnp/sp/taxonomy";
import { taxonomy, ITermSetData, ITermSet, ITermData, ITerm } from "@pnp/sp-taxonomy";
import { Office, OfficeLocationWeather, OfficeTermsCustomProperties } from "./types";
import { Logger, LogLevel } from "@pnp/logging";
import { HttpClient } from "@microsoft/sp-http";
import { isEmpty } from '@microsoft/sp-lodash-subset';


const LOG_SOURCE: string = "🔶 OfficeLocationService";
export const PLACEHOLDER_IMAGE_URL: string = "https://via.placeholder.com/400x240?text=Map%20unavailable";

export async function getOfficesFromTermStore(useSiteCollectionTermStore: boolean, termSetId: string): Promise<Office[]> {
    try {
        let officeTerms: (ITermData & ITerm)[] = [];
        let officesTermset: (ITermSetData & ITermSet) = null;
        if (useSiteCollectionTermStore) {
            let siteCollectionTermStore = taxonomy.getDefaultSiteCollectionTermStore();
            officesTermset = await siteCollectionTermStore.getTermSetById(termSetId).get();
        } else {
            let termStoreInfo: ITermStoreInfo = await sp.termStore();
            officesTermset = await taxonomy.termStores.getById(termStoreInfo.id).getTermSetById(termSetId).get();
        }

        if(isEmpty(officesTermset)) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - error getting termset`, LogLevel.Error);
            return null;
        }

        let termsetCustomProperties: any = officesTermset.CustomProperties;
        if(!termsetCustomProperties.UsedForOfficeLocations) {
            Logger.write(`${LOG_SOURCE} (getOfficesFromTermStore) - termset is not used for office locations`, LogLevel.Warning);
            return null;
        }

        officeTerms =  await officesTermset.terms.get();
        console.debug(`${LOG_SOURCE} (getOfficesFromTermStore) - Data from term store - %o`, officeTerms);

        let offices: Office[] = officeTerms.map(term => {
            let customProperties: OfficeTermsCustomProperties = term.CustomProperties;
            return {
                uniqueId: term.Id,
                name: term.Name,
                address: customProperties.Address,
                latitude: customProperties.Latitude ?? null,
                longitude: customProperties.Longitude ?? null,
                mapImageLink: customProperties.MapImageLink ?? PLACEHOLDER_IMAGE_URL,
                timeZone: customProperties.TimeZone
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

export async function getOfficesFromList(listId: string): Promise<Office[]> {
    try {

        const officeListItems: any[] = await sp.web.lists.getById(listId).items.select("Id", "Title", "Address", "Latitude", "Longitude", "MapImageLink", "TimeZone").get();
        console.debug(`${LOG_SOURCE} (getOfficesFromList) - Data from list - %o`, officeListItems);

        let offices: Office[] = officeListItems.map(item => {
            return {
                uniqueId: item.Id,
                name: item.Title,
                address: item.Address,
                latitude: item.Latitude ?? null,
                longitude: item.Longitude ?? null,
                mapImageLink: item.MapImageLink ?? PLACEHOLDER_IMAGE_URL,
                timeZone: item.TimeZone
            };
        });
        console.debug(`${LOG_SOURCE} (getOfficesFromList) - formatted data - %o`, offices);
        return offices;
    } catch (error) {
        Logger.write(`${LOG_SOURCE} (getOfficesFromList) - ${error}`, LogLevel.Error);
        console.error(error);
        return null;
    }
}

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

export async function getOfficeLocationWeatherFromList(officeName: string, weatherListId: string): Promise<OfficeLocationWeather> {
    try {

        const officeWeatherListItems: any[] = await sp.web.lists.getById(weatherListId).items.select("Title", "Icon", "Temperature", "High", "Low", "WindSpeed").filter("Title eq '" + officeName + "'").get();
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