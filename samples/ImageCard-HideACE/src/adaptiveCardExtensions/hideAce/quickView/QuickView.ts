import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HideAceAdaptiveCardExtensionStrings';
import { Logger, LogLevel } from "@pnp/logging";
import { IHideAceAdaptiveCardExtensionProps, IHideAceAdaptiveCardExtensionState } from '../HideAceAdaptiveCardExtension';

export interface IQuickViewData {
  strings: IHideAceAdaptiveCardExtensionStrings;
  showRegister: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IHideAceAdaptiveCardExtensionProps,
  IHideAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 Hide ACE Quick View";

  public get data(): IQuickViewData {
    return {
      showRegister: this.state.showRegister,
      strings: strings
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: ISubmitActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        //show the registration form
        if (id === 'register') {
          this.setState({ showRegister: !this.state.showRegister });
          this.quickViewNavigator.pop(true);
        }
        //Submit the form
        else if (id === 'submit') {
          const lastRegistrationDate: Date = new Date();
          //Set the value in localstorage
          localStorage.setItem("registrationDate", lastRegistrationDate.toISOString());
          //Close the quick view
          this.quickViewNavigator.close();
          //hide the registration form
          this.setState({ showRegister: false });
          //Set the ACE visibility to false
          this.setVisibility(false);
        }
        //close the quick view
        else if (id === 'cancel') {
          this.setState({ showRegister: false });
          this.quickViewNavigator.pop(true);
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}