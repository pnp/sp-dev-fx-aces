import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DynamicAceAdaptiveCardExtensionStrings';
import { IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState } from '../DynamicAceAdaptiveCardExtension';
import { CardSelectionType } from '../models/IListItem';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IDynamicAceAdaptiveCardExtensionProps,
  IDynamicAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    if(this.state.currentitem.OnCardSelectionType == CardSelectionType.QuickView)
    {
      return JSON.parse(this.state.currentitem.QuickViewAdaptiveCardData);
    }
    
  }

  public get template(): ISPFxAdaptiveCard {

    if(this.state.currentitem.OnCardSelectionType == CardSelectionType.QuickView)
    {
      return JSON.parse(this.state.currentitem.QuickViewAdaptiveCardJSON);
        //return require('./template/QuickViewTemplate.json');
    }
  }
}