import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'StatusMessageAdaptiveCardExtensionStrings';
import { IPresenceStatus } from '../models/IPresenceStatus';
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

    if (action.type === "Submit") {

      const { id, txtStatusMessage, cmbStatusMsgExp, cmbAvailability } = action.data;

      if (id === "cancel") {
        return this.quickViewNavigator.close();

      } else if (id === "submit") {
        let newStatusMessageText: string | undefined = txtStatusMessage;
        let newStatusMessageExpiration: string | undefined = cmbStatusMsgExp;
        let newAvailabilityText: string | undefined = cmbAvailability;
        let newActivityText: string = "";
        let presenceData: IPresenceStatus | undefined = undefined;

        switch (newAvailabilityText) {
          case "Available":
            newActivityText = "Available";
            break;
          case "Busy-Call":
            newAvailabilityText = "Busy";
            newActivityText = "InACall";
            break;
          case "Busy-Conf":
            newAvailabilityText = "Busy";
            newActivityText = "InAConferenceCall";
            break;
          case "Away":
            newActivityText = "Away";
            break;
          case "DoNotDisturb":
            newActivityText = "Presenting";
            break;
          default:
            newAvailabilityText = "Available";
            newActivityText = "Available";
            break;
        }

        if (newStatusMessageText === undefined
          || newStatusMessageText === null
          && newStatusMessageExpiration === undefined
          || newStatusMessageExpiration === null) {
          newStatusMessageText = "";
          newStatusMessageExpiration = "9999-12-30T23:00:00.0000000Z";
        }

        presenceData = {
          sessionId: this.state.currentSessionId,
          availability: newAvailabilityText,
          activity: newActivityText,
          expirationDuration: "PT1H" // Default value is 1 hour
        }

        await this.state.presenceService.setCurrentUserStatusMessage(newStatusMessageText, newStatusMessageExpiration);
        await this.state.presenceService.setCurrentUserAvailability(this.state.currentUserId, presenceData);

        return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);

      } else if (id === "clearAvail") {
        await this.state.presenceService.clearPresence(this.state.currentUserId, this.state.currentSessionId);
        return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);

      } else if (id === "clearStatusMsg") {
        await this.state.presenceService.setCurrentUserStatusMessage("", "never");
        return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);

      } else {
        console.log("Action id " + id + " is not valid.");
        return Promise.reject("Action id " + id + " is not valid.");
      }
    }
  }
}