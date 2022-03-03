import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { IOfficeLocationsAdaptiveCardExtensionProps,IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
  
  export class ErrorCardView extends BasePrimaryTextCardView<IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState> {
  
    public get data(): IPrimaryTextCardParameters {
      return {
        title: "Uh oh!",
        primaryText: "Error",
        description: this.state.errorMessage,
        iconProperty: "Error"
      };
    }
  }