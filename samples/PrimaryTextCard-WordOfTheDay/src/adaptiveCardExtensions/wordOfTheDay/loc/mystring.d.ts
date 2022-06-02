declare interface IWordOfTheDayAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ApiKeyFieldLabel: string;
  TitleFieldLabel: string;
  IconPropertyFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  QuickViewButton: string;
  Definitions: string;
  Examples: string;
  Loading: string;
  ErrorTitle: string;
  ErrorGenericDescription: string;
  ErrorMissingAPIKeyDescription: string;
  UseSampleDataFieldLabel: string;
}

declare module 'WordOfTheDayAdaptiveCardExtensionStrings' {
  const strings: IWordOfTheDayAdaptiveCardExtensionStrings;
  export = strings;
}
