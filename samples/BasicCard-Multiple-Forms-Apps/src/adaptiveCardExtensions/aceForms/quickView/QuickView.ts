import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IAceFormsAdaptiveCardExtensionProps, IAceFormsAdaptiveCardExtensionState } from '../AceFormsAdaptiveCardExtension';
import { ListItem } from '../models/models';

export interface IQuickViewData {
  items: ListItem[];
  buttonText: string;
  allItemsURL: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAceFormsAdaptiveCardExtensionProps,
  IAceFormsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      items: this.state.listItems,
      buttonText: '',
      allItemsURL: ''
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') { return ;}
  }
}

export class QuickViewWithButton extends BaseAdaptiveCardView<
  IAceFormsAdaptiveCardExtensionProps,
  IAceFormsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      items: this.state.listItems,
      buttonText: this.properties.buttonText,
      allItemsURL: this.properties.allItemsURL,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplateWithButton.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') {return ;} 
  }
}