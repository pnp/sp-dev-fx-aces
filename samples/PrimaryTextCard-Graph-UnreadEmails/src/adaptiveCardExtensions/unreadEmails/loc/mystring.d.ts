declare interface IUnreadEmailsAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  IconPropertyFieldLabel: string;
  ButtonTitle: string;
  ButtonTarget: string;
  Loading: IPrimaryTextCardParameters;
  NoUnread: IPrimaryTextCardParameters;
  Unread: IPrimaryTextCardParameters;
  LargeUnread: IPrimaryTextCardParameters;
}

declare module 'UnreadEmailsAdaptiveCardExtensionStrings' {
  const strings: IUnreadEmailsAdaptiveCardExtensionStrings;
  export = strings;
}
 