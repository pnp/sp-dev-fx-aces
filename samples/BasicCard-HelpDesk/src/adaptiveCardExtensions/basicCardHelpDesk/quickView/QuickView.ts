import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView, ISubmitActionArguments, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'BasicCardHelpDeskAdaptiveCardExtensionStrings';
import {
  EDIT_VIEW_REGISTRY_ID,
  IBasicCardHelpDeskAdaptiveCardExtensionProps,
  IBasicCardHelpDeskAdaptiveCardExtensionState
} from '../BasicCardHelpDeskAdaptiveCardExtension';
import { HelpDeskTicket } from '../../models/helpdesk.models';

export interface IQuickViewData {
  numberOfTasks: string;
  tickets: HelpDeskTicket[];
  strings: IBasicCardHelpDeskAdaptiveCardExtensionStrings;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IBasicCardHelpDeskAdaptiveCardExtensionProps,
  IBasicCardHelpDeskAdaptiveCardExtensionState,
  IQuickViewData
  > {
  private LOG_SOURCE = "🔶 Help Desk Quick View";
  
  public get data(): IQuickViewData {
    let numberOfTasks: string = strings.CardViewNoTasks;
    if (this.state.tickets.length > 1) {
      numberOfTasks = `${this.state.tickets.length.toString()} ${strings.CardViewTextPlural}`;
    } else {
      numberOfTasks = `${this.state.tickets.length.toString()} ${strings.CardViewTextSingular}`;
    }
    return {
      numberOfTasks: numberOfTasks,
      tickets: this.state.tickets,
      strings: strings,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
  
  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if ((<ISubmitActionArguments>action).type === 'Submit') {
        const submitAction = <ISubmitActionArguments>action;
        const { id, incidentNumber } = submitAction.data;
        if (id === 'selectTicket') {
          this.setState({ currentIncidentNumber: incidentNumber });
          this.quickViewNavigator.push(EDIT_VIEW_REGISTRY_ID);
        }
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (onAction) -- click event not handled. - ${err}`
      );
    }
  }
}
