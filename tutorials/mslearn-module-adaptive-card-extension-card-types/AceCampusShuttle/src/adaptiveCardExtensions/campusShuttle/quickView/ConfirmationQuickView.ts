import {
  IActionArguments,
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView
} from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/ConfirmationCard.json';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
} from '../CampusShuttleAdaptiveCardExtension';

import {
  deleteListItem,
  STATUS_AVAILABLE
} from '../sp.service';

export interface IConfirmationQuickViewData {
  title: string;
  description: string;
}

export class ConfirmationQuickView extends BaseAdaptiveCardQuickView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  IConfirmationQuickViewData
> {
  constructor(private confirmType: 'cancel' | 'complete') {
    super();
  }

  public get data(): IConfirmationQuickViewData {
    return {
      title: `${this.confirmType.substring(0,1).toUpperCase()}${this.confirmType.substring(1,this.confirmType.length)} Trip`,
      description: `Are you sure you want to ${this.confirmType} the trip?`
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit' && action.id === 'confirm') {
      (async () => {
        // delete list item
        await deleteListItem(this.context, this.properties.listId, Number(this.state.currentTrip.Id));
      })().catch(console.error);

      // update state to initial value
      this.setState({
        currentTrip: {
          Title: this.context.pageContext.user.loginName,
          Status: STATUS_AVAILABLE
        }
      });

      // close
      this.quickViewNavigator.close();
    }
  }
}
