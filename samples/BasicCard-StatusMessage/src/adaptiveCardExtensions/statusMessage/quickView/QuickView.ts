import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'StatusMessageAdaptiveCardExtensionStrings';
import { CONFIRMATION_QUICK_VIEW_REGISTRY_ID, IStatusMessageAdaptiveCardExtensionProps, IStatusMessageAdaptiveCardExtensionState } from '../StatusMessageAdaptiveCardExtension';

export interface IQuickViewData {
}

export class QuickView extends BaseAdaptiveCardView<
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
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === 'Submit') {
      const { id } = action.data;
      if (id === 'cancel') {
        return this.quickViewNavigator.close();
      } else if (id === 'submit') {
        let newStatusMessageText: string = action.data.txtStatusMessage;
        if (newStatusMessageText === undefined || newStatusMessageText === null) {
          newStatusMessageText = "";
        }
        try {
          await this.state.statusMessageService.setCurrentUserStatusMessage(newStatusMessageText);
          return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);
        } catch (err) {
          console.log(err);
        }
      } else {
        return;
      }
    }
  }
}