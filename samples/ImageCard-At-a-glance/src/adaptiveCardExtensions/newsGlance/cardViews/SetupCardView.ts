import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
  } from '@microsoft/sp-adaptive-card-extension-base';
  import {
    INewsGlanceAdaptiveCardExtensionProps,
    INewsGlanceAdaptiveCardExtensionState,
  } from '../NewsGlanceAdaptiveCardExtension';
  
  export class SetupCardView extends BasePrimaryTextCardView<INewsGlanceAdaptiveCardExtensionProps, INewsGlanceAdaptiveCardExtensionState> {
  
    public get data(): IPrimaryTextCardParameters {
      return {
        primaryText: "Setup Required",
        description: "You must set the ID to get the details of the article"
      };
    }
  }