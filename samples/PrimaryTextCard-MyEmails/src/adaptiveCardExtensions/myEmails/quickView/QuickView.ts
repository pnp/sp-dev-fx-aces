import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyEmailsAdaptiveCardExtensionStrings';
import { IMyEmailsAdaptiveCardExtensionProps, IMyEmailsAdaptiveCardExtensionState } from '../MyEmailsAdaptiveCardExtension';

export interface IQuickViewData {
  message: any;

}

export class QuickView extends BaseAdaptiveCardView<
  IMyEmailsAdaptiveCardExtensionProps,
  IMyEmailsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      message: this.state.currentEmail
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}