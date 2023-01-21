import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'StatusMessageAdaptiveCardExtensionStrings';
import { IStatusMessageAdaptiveCardExtensionProps, IStatusMessageAdaptiveCardExtensionState } from '../StatusMessageAdaptiveCardExtension';

export interface IQuickViewData {
}

export class ConfirmationQuickView extends BaseAdaptiveCardView<
  IStatusMessageAdaptiveCardExtensionProps,
  IStatusMessageAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
    };
  }

  public get title(): string {
    return strings.SetStatusMessageTitle;
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ConfirmationQuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === "Submit") {
      const { id } = action.data;
      if (id === "back") {
        return this.quickViewNavigator.pop();
      } else if (id === "close") {
        return this.quickViewNavigator.close();
      } else {
        return;
      }
    }
  }
}