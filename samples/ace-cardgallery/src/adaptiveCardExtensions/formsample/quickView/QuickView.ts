import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import { IFormsampleAdaptiveCardExtensionProps, IFormsampleAdaptiveCardExtensionState } from '../FormsampleAdaptiveCardExtension';

export interface IQuickViewData {
  formSample;
}

export class QuickView extends BaseAdaptiveCardView<
  IFormsampleAdaptiveCardExtensionProps,
  IFormsampleAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    return {
      formSample: this.state.formSample
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'submit') {
          //This is where we could call a function in the service layer to
          //save the data.
          this.quickViewNavigator.close();
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }

  }
}