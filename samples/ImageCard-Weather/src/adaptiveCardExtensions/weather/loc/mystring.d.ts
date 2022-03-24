declare interface IWeatherAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  ErrorCardPrimaryTextLabel: string;
  ErrorCardDescriptionLabel: string;
  SetupCardPrimaryTextLabel: string;
  SetupCardDescriptionLabel: string;
  AzureMapsKeyLabel: string;
  BingMapsKeyLabel: string;
  LocationLabel: string;
  SearchLocationPlaceholder: string;
  SearchLocationNoBingPlaceholder: string;
  ImageURLLabel: string;
}

declare module 'WeatherAdaptiveCardExtensionStrings' {
  const strings: IWeatherAdaptiveCardExtensionStrings;
  export = strings;
}
