import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState } from '../TfLStatusAdaptiveCardExtension';
  
  export class SetupCardView extends BasePrimaryTextCardView<ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState> {
  
    public get data(): IPrimaryTextCardParameters {
      return {
        primaryText: "Setup Required",
        description: "You must set the extension name"
      };
    }
  }