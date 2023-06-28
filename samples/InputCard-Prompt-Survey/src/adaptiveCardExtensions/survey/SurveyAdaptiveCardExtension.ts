import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { ThankYouCardView } from './cardView/ThankYouCardView';
import { SurveyPropertyPane } from './SurveyPropertyPane';

export interface ISurveyAdaptiveCardExtensionProps {
  title: string;
  question: string;
  thankYouText: string;
}

export interface ISurveyAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'Survey_CARD_VIEW';
export const THANK_YOU_CARD_VIEW_REGISTRY_ID: string = 'Thank_You_CARD_VIEW';

export default class SurveyAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISurveyAdaptiveCardExtensionProps,
  ISurveyAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SurveyPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card views to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(THANK_YOU_CARD_VIEW_REGISTRY_ID, () => new ThankYouCardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Survey-property-pane'*/
      './SurveyPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SurveyPropertyPane();
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
