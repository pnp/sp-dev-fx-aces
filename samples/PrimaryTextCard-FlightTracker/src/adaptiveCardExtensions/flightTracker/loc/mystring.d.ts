declare interface IFlightTrackerAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  SubTitle: string;
  QuickViewButton: string;
  NotVailable: string;
  loading: string;
  ConfigureCard: string;
  ConfigureCardDescription: string;
  Error: string;
  ErrorMessage: string;
  RefreshIntervalFieldLabel: string;
  NoOperatorMessage: string;
  NoFlightInformation: string;
  NoFlightInformationDescription: string;
}

declare module 'FlightTrackerAdaptiveCardExtensionStrings' {
  const strings: IFlightTrackerAdaptiveCardExtensionStrings;
  export = strings;
}
