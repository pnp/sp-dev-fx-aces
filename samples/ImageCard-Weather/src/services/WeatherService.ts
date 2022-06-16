import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class WeatherService {
    private context: AdaptiveCardExtensionContext;
    private weatherApiUrl: string;
    private bingApiUrl: string;

    constructor(_context: AdaptiveCardExtensionContext) {
        this.context = _context;
        this.weatherApiUrl = 'https://atlas.microsoft.com/weather';
        this.bingApiUrl = 'https://dev.virtualearth.net/REST/v1';
    }

    /**
     * Get current weather for a location using Azure Maps
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param azureMapsKey Azure Maps Authentication Key
     * @returns Weather Conditions Result
     */
    public async GetWeatherResponse(latitude: string, longitude: string, azureMapsKey: string): Promise<any> {
        try {
            const weatherResultResponse = await this.context.httpClient.get(
                `${this.weatherApiUrl}/currentConditions/json?api-version=1.&query=${latitude},${longitude}&subscription-key=${azureMapsKey}`,
                null);
            const weatherResultJson = await weatherResultResponse.json();
            console.log('weatherResult', weatherResultJson);
            if (weatherResultJson.error) {
                throw undefined;
            }
            return weatherResultJson.results[0];
        } catch (error) {
            throw undefined;
        }
    }

    /**
     * Gets Air Quality of a location using Azure Maps
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param azureMapsKey Azure Maps Authentication Key
     * @returns Air Quality Result
     */
    public async GetAirQuality(latitude: string, longitude: string, azureMapsKey: string): Promise<any> {
        try {
            const airQualityResponse = await this.context.httpClient.get(
                `${this.weatherApiUrl}/airQuality/current/json?api-version=1.1&query=${latitude},${longitude}&subscription-key=${azureMapsKey}`,
                null);
            const airQualityResponseJson = await airQualityResponse.json();
            console.log('airQuality', airQualityResponseJson);
            if (airQualityResponseJson.error) {
                throw undefined;
            }
            return airQualityResponseJson.results[0];
        } catch (error) {
            throw undefined;
        }
    }

    /**
     * Gets Daily Indices of a location using Azure Maps
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param indexGroupId Index Group Id to specify a subset of indices
     * @param azureMapsKey Azure Maps Authentication Key
     * @returns Daily Indices Result
     */
    public async GetDailyIndices(latitude: string, longitude: string, indexGroupId: number, azureMapsKey: string): Promise<any> {
        try {
            const dailyIndicesResponse = await this.context.httpClient.get(
                `${this.weatherApiUrl}/indices/daily/json?api-version=1.1&query=${latitude},${longitude}&indexGroupId=${indexGroupId}&subscription-key=${azureMapsKey}`,
                null);
            const dailyIndicesResponseJson = await dailyIndicesResponse.json();
            console.log('dailyIndices', dailyIndicesResponseJson);
            if (dailyIndicesResponseJson.error) {
                throw undefined;
            }
            return dailyIndicesResponseJson.results;
        } catch (error) {
            throw undefined;
        }
    }

    /**
     * 
     * @param locationName 
     * @param bingMapsKey 
     * @returns 
     */
    public async GetLocationsResponse(locationName: string, bingMapsKey: string): Promise<any> {
        try {
            const locationResultResponse = await this.context.httpClient.get(
                `${this.bingApiUrl}/Locations/${locationName}?maxResults=5&key=${bingMapsKey}`,
                null);
            const locationResultJson = await locationResultResponse.json();
            console.log('locationResultJson', locationResultJson);
            if (locationResultJson.error) {
                throw undefined;
            }
            return locationResultJson.resourceSets[0];
        } catch (error) {
            throw undefined;
        }
    }
}