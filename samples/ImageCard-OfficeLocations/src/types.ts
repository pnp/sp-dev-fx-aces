export type Office = {
    uniqueId: string | number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    mapImageLink: string;
    timeZoneId: string;
    pageUrl: string;
    managerEmailAddress?: string;
    chatWithManagerLink?: string;
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
    PageUrl: string;
    ManagerEmailAddress: string;
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
};

export type Icons = {
    searchIcon: string;
    previousIcon: string;
    nextIcon: string;
    clearIcon: string;
    copyIcon: string;
    addressIcon: string;
};