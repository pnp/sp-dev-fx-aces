import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { TechnicalSupportChatPropertyPane } from './TechnicalSupportChatPropertyPane';

export interface ITechnicalSupportChatAdaptiveCardExtensionProps {
  title: string;
  supportSpecialistEmail: string;
}

export interface ITechnicalSupportChatAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'TechnicalSupportChat_CARD_VIEW';

export default class TechnicalSupportChatAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITechnicalSupportChatAdaptiveCardExtensionProps,
  ITechnicalSupportChatAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: TechnicalSupportChatPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'TechnicalSupportChat-property-pane'*/
      './TechnicalSupportChatPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TechnicalSupportChatPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
