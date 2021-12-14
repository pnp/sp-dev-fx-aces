declare interface ICovidIndicatorAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  CountryFieldLabel: string;
  TitleFieldLabel: string;
  IconPropertyFieldLabel: string;
  Title: string;
  SubTitle: string;
  Description: string;
  PrimaryText: string;
  QuickViewButton: string;
  SelecteCountryMessage:string;
  CountryNotDefined:string;
}

declare module 'CovidIndicatorAdaptiveCardExtensionStrings' {
  const strings: ICovidIndicatorAdaptiveCardExtensionStrings;
  export = strings;
}
