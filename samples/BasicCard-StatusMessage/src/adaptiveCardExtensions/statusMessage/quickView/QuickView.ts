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
      const { id, txtStatusMessage, cmbAvailability } = action.data;
      if (id === "cancel") {
        return this.quickViewNavigator.close();
      } else if (id === "submit") {
        let newStatusMessageText: string = txtStatusMessage;
        let newAvailabilityText: string = cmbAvailability;
        let newActivityText: string = "";
        let presenceData: IPresenceStatus = null;
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
            break;
        }
        presenceData = {
          sessionId: this.state.currentSessionId,
          availability: newAvailabilityText,
          activity: newActivityText,
          expirationDuration: "PT1H"
        }
        if (newStatusMessageText === undefined || newStatusMessageText === null) {
          newStatusMessageText = "";
        }
        try {
          await this.state.presenceService.setCurrentUserStatusMessage(newStatusMessageText);
          await this.state.presenceService.setCurrentUserAvailability(this.state.currentUserId, presenceData);
          return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);
        } catch (err) {
          throw new Error(err);
        }
      } else if (id === "clearAvail") {
        try  {
          await this.state.presenceService.clearPresence(this.state.currentUserId, this.state.currentSessionId);
          return this.quickViewNavigator.push(CONFIRMATION_QUICK_VIEW_REGISTRY_ID);
        } catch(err) {
          throw new Error(err);
        }
      } else {
        return;
      }
    }
  }
}