import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState } from '../TfLStatusAdaptiveCardExtension';
  
  export class ErrorCardView extends BasePrimaryTextCardView<ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState> {
    
    public get data(): IPrimaryTextCardParameters {
        return {
            title: "Uh oh!",
            primaryText: "Error",
            description: this.state.errorMessage,
            iconProperty: "Error"
        };
    }
  }
  