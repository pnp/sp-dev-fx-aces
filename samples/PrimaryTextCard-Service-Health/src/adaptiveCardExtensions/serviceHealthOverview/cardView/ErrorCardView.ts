import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState } from '../ServiceHealthOverviewAdaptiveCardExtension';
  
  export class ErrorCardView extends BasePrimaryTextCardView<IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState> {
    
    public get data(): IPrimaryTextCardParameters {
        return {
            title: "Uh oh!",
            primaryText: "Error",
            description: this.state.errorMessage,
            iconProperty: "Error"
        };
    }
  }
  