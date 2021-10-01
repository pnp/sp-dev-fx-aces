declare interface IWeatherAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  Title: string;
  DescriptionFieldLabel: string;
  Description: string;
}

declare module 'WeatherAdaptiveCardExtensionStrings' {
  const strings: IWeatherAdaptiveCardExtensionStrings;
  export = strings;
}
