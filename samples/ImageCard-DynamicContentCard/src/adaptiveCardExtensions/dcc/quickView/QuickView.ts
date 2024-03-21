import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DccAdaptiveCardExtensionStrings';
import {
  IDccAdaptiveCardExtensionProps,
  IDccAdaptiveCardExtensionState
} from '../DccAdaptiveCardExtension';
import { IListItem } from '../sp.service';

export interface IQuickViewData {
  listItems: IListItem[];
  quickViewTitle: string;
  quickViewText: string;
  quickViewButtonText: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IDccAdaptiveCardExtensionProps,
  IDccAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      listItems: this.state.listItems,
      quickViewTitle: strings.quickViewTitle,
      quickViewText: strings.quickViewText,
      quickViewButtonText: strings.QuickViewButton
      
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
