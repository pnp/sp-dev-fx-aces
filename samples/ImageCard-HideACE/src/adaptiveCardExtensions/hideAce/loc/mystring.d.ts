declare interface IHideAceAdaptiveCardExtensionStrings {
  TitleFieldLabel: string;
  CookieLengthFieldLabel: string;

  PrimaryText: string;

  QuickViewButton: string;
  RegisterButtonText: string;
  SubmitButtonText: string;
  CancelButtonText: string;

  EventTitle: string;
  EventIntroText: string;
  RegistrationFormHeading: string;
  FirstNameLabel: string;
  LastNameLabel: string;
  CompanyNameLabel: string;
  PhoneLabel: string;
  FirstNameError: string;
  LastNameError: string;
  CompanyNameError: string;
  PhoneError: string;

  PropertyPaneDescription: string;
  Title: string;
  SubTitle: string;
  Description: string;

}

declare module 'HideAceAdaptiveCardExtensionStrings' {
  const strings: IHideAceAdaptiveCardExtensionStrings;
  export = strings;
}
