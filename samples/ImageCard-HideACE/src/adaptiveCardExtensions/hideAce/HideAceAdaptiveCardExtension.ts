import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HideAcePropertyPane } from './HideAcePropertyPane';
import { Logger, LogLevel } from "@pnp/logging";

export interface IHideAceAdaptiveCardExtensionProps {
  title: string;
  cookieLength: string;
  iconProperty: string;
}

export interface IHideAceAdaptiveCardExtensionState {
  showRegister: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'HideAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HideAce_QUICK_VIEW';

export default class HideAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHideAceAdaptiveCardExtensionProps,
  IHideAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HideAcePropertyPane | undefined;
  private LOG_SOURCE: string = "🔶 Hide ACE ";

  public onInit(): Promise<void> {
    try {
      this._iconProperty = this.properties.iconProperty;
      //Ensure that the ACE is visible by default
      this.isVisible = true;
      //Get the value from local storage
      const registrationDate: string = localStorage.getItem('registrationDate');
      //If the value is in localstorage
      if (registrationDate && registrationDate != "") {
        let expiration: Date = new Date(registrationDate);
        expiration.setMinutes(expiration.getMinutes() + parseInt(this.properties.cookieLength));
        const now: Date = new Date();
        //If the local storage date has not passed yet hide the card
        if (expiration.getTime() > now.getTime()) {
          this.isVisible = false;
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }





    this.state = {
      showRegister: false
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HideAce-property-pane'*/
      './HideAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HideAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
