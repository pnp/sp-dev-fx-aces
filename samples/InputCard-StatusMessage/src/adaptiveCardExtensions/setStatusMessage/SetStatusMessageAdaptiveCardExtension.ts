import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { ValidationCardView } from './cardView/ValidationCardView';
import { SetStatusMessagePropertyPane } from './SetStatusMessagePropertyPane';
import { GraphService, IGraphService } from '../GraphService';

export interface ISetStatusMessageAdaptiveCardExtensionProps {
  title: string;
  validationText: string;
}

export interface ISetStatusMessageAdaptiveCardExtensionState {
  currentStatusMessage: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'SetStatusMessage_CARD_VIEW';
export const VALIDATION_CARD_VIEW_REGISTRY_ID: string = 'Validation_CARD_VIEW';

export default class SetStatusMessageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISetStatusMessageAdaptiveCardExtensionProps,
  ISetStatusMessageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SetStatusMessagePropertyPane;

  public async onInit(): Promise<void> {
    this.state = {
      currentStatusMessage: ""
     };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(VALIDATION_CARD_VIEW_REGISTRY_ID, () => new ValidationCardView());

    await this.getStatus();

    return Promise.resolve();
  }

  private async getStatus(): Promise<void> {
    const service: IGraphService = new GraphService(this.context);
    const message = await service._getStatusMessage();
    this.setState({
      currentStatusMessage: message
    });

  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SetStatusMessage-property-pane'*/
      './SetStatusMessagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SetStatusMessagePropertyPane();
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
