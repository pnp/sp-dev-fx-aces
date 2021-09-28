declare interface ITasklistAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel: string;
  IconPropertyFieldLabel: string;
  Title: string;
  SubTitle: string;
  Description: string;
  PrimaryText: string;
  QuickViewButton: string;
  AssignedToLabel: string;
  DueDateLabel: string;
  TaskTitleLabel: string;
}

declare module 'TasklistAdaptiveCardExtensionStrings' {
  const strings: ITasklistAdaptiveCardExtensionStrings;
  export = strings;
}
