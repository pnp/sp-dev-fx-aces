import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
//import * as strings from 'DccAdaptiveCardExtensionStrings';
import {
  IDccAdaptiveCardExtensionProps,
  IDccAdaptiveCardExtensionState
} from '../DccAdaptiveCardExtension';
import { IListItem } from '../sp.service';

export interface IQuickViewData {
  listItems: IListItem[];
  quickViewTitle: string;
  quickViewSubTitle: string;
  quickViewText: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IDccAdaptiveCardExtensionProps,
  IDccAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      listItems: this.state.listItems,
      quickViewTitle:"Quick View Title",
      quickViewSubTitle:"Quick View Subtitle", 
      quickViewText:"Quick View Text"
      
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
