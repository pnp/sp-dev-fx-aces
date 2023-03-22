declare interface IToDoCardAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  ApiUrlFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  LoadingMessage: string;
  ConfigureMessage: string;
  ErrorTitle: string;
  ConfirmTitle: string;
  ConfirmDescription: string;
  TaskTitlePlaceholder: string;
  ListToDoQuickViewButton: string;
  AddToDoQuickViewButton: string;
}

declare module 'ToDoCardAdaptiveCardExtensionStrings' {
  const strings: IToDoCardAdaptiveCardExtensionStrings;
  export = strings;
}
