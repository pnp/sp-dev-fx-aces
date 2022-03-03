import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyShiftsAdaptiveCardExtensionStrings';
import { IMyShiftsAdaptiveCardExtensionProps, IMyShiftsAdaptiveCardExtensionState } from '../MyShiftsAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  shifts:[];
}

export class QuickView extends BaseAdaptiveCardView<
  IMyShiftsAdaptiveCardExtensionProps,
  IMyShiftsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description,
      shifts:this.state.shifts
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}