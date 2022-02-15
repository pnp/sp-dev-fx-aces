export type Office = {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    mapImageLink: string;
    timeZone: string;
    locationMap?: OfficeLocationMap;
    gotMap?: boolean;
    weather?: OfficeLocationWeather;
    gotWeather?: boolean;
    time?: string;
};

export type OfficeTermsCustomProperties = {
    Address: string;
    Latitude: string;
    Longitude: string;
    MapImageLink: string;
    TimeZone: string;
};

export enum MapsSource {
    Bing = 'Bing',
    Google = 'Google'
}

export enum DataSource {
    Local = 'Local',
    Taxonomy = 'Taxonomy',
    List = 'List'
}

export type OfficeLocationWeather = {
    icon: string;
    temperature: string;
    high: string;
    low: string;
    windSpeed: string;
};

export type OfficeLocationMap = {
    imageUrl: string;
    imageAlt: string;
    directionUrl: string;
    directionVisible: boolean;
};