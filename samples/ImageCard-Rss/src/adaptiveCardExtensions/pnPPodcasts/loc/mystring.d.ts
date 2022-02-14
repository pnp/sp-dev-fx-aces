declare interface IPnPPodcastsAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel: string;
  IconPropertyFieldLabel: string;
  RightIconPropertyFieldLabel: string;
  Title: string;
  SubTitle: string;
  Description: string;
  PrimaryText: string;
  QuickViewButton: string;
  URL:string,
}

declare module 'PnPPodcastsAdaptiveCardExtensionStrings' {
  const strings: IPnPPodcastsAdaptiveCardExtensionStrings;
  export = strings;
}
