import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/QuickViewTemplate.json';
import {
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState
} from '../SharePointRestAdaptiveCardExtension';
import { IListItem } from '../sp.service';

export interface IQuickViewData extends IListItem {
  previousEnabled: boolean;
  nextEnabled: boolean;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      previousEnabled: this.state.currentIndex !== 0,
      nextEnabled: this.state.currentIndex !== (this.state.listItems.length - 1),
      ...(this.state.listItems[this.state.currentIndex])
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') { return ;}

    const currentIndex = this.state.currentIndex;
    this.setState({ currentIndex: currentIndex + Number(action.id) });
  }
}
