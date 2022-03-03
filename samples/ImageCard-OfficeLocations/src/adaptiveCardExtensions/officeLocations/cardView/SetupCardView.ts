import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { IOfficeLocationsAdaptiveCardExtensionProps,IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
  
  export class SetupCardView extends BasePrimaryTextCardView<IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState> {
  
    public get data(): IPrimaryTextCardParameters {
      return {
        primaryText: "Setup Required",
        description: "You must set the data source, maps source and maps API key in the property pane."
      };
    }
  }