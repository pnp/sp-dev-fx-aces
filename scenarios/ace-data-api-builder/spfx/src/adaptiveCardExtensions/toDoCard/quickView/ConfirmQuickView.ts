import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';
import { IToDoCardAdaptiveCardExtensionProps, IToDoCardAdaptiveCardExtensionState } from '../ToDoCardAdaptiveCardExtension';

export interface IConfirmQuickViewData {
  title: string;
  description: string;
  imageUrl: string;
}

export class ConfirmQuickView extends BaseAdaptiveCardView<
IToDoCardAdaptiveCardExtensionProps,
IToDoCardAdaptiveCardExtensionState,
  IConfirmQuickViewData
> {
  public get data(): IConfirmQuickViewData {
    return {
      title: strings.ConfirmTitle,
      description: strings.ConfirmDescription,
      imageUrl: require('../assets/success.png')
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ConfirmQuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id === "close") {
        this.quickViewNavigator.close();
    }
  }
}