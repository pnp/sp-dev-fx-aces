import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, RenderType } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ConfirmationQuickView } from './quickView/ConfirmationQuickView'
import { StatusMessagePropertyPane } from './StatusMessagePropertyPane';
import { IStatusMessageService } from './services/IStatusMessageService';
import { StatusMessageService } from './services/StatusMessageService';
import { IStatusMessage } from './models/IStatusMessage';
import * as strings from 'StatusMessageAdaptiveCardExtensionStrings';

export interface IStatusMessageAdaptiveCardExtensionProps {
  title: string;
}

export interface IStatusMessageAdaptiveCardExtensionState {
  currentStatusMessage: string;
  statusMessageService: IStatusMessageService;
}

const CARD_VIEW_REGISTRY_ID: string = 'StatusMessage_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'StatusMessage_QUICK_VIEW';
export const CONFIRMATION_QUICK_VIEW_REGISTRY_ID: string = 'StatusMessage_CONFIRMATION_QUICK_VIEW';

export default class StatusMessageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IStatusMessageAdaptiveCardExtensionProps,
  IStatusMessageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: StatusMessagePropertyPane | undefined;
  private _statusMessageService: IStatusMessageService;

  public async onInit(): Promise<void> {
    this.state = {
      currentStatusMessage: "",
      statusMessageService: null
    };

    this._statusMessageService = this.context.serviceScope.consume(StatusMessageService.ServiceKey);

    this.setState({
      statusMessageService: this._statusMessageService
    });

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(CONFIRMATION_QUICK_VIEW_REGISTRY_ID, () => new ConfirmationQuickView());

    return this._getCurrentUserStatusMessage();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'StatusMessage-property-pane'*/
      './StatusMessagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.StatusMessagePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected async onRenderTypeChanged(oldRenderType: RenderType): Promise<void> {
    if (oldRenderType === 'QuickView') {
      return this._getCurrentUserStatusMessage();
    }
  }

  private async _getCurrentUserStatusMessage(): Promise<void> {
    let statusMsg: IStatusMessage;
    let messageText: string;

    try {
      statusMsg = await this._statusMessageService.getCurrentUserStatusMessage();
    } catch (err) {
      console.log(err);
    }

    if (statusMsg.statusMessage.message.content.length <= 0) {
      messageText = strings.NoStatusMessageText;
    } else {
      messageText = statusMsg.statusMessage.message.content.trim();
    }

    this.setState({
      currentStatusMessage: messageText,
    });
  }
}
