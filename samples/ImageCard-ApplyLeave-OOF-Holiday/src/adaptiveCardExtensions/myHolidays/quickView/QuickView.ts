import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';

import { IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState } from '../MyHolidaysAdaptiveCardExtension';

export interface IQuickViewData {
  myHolidays:any;
}

export class QuickView extends BaseAdaptiveCardView<
  IMyHolidaysAdaptiveCardExtensionProps,
  IMyHolidaysAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {      
      myHolidays:this.state.myHolidays
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  
  
}