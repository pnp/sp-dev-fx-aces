import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ScholarshipPropertyPane } from './ScholarshipPropertyPane';

export interface IScholarshipAdaptiveCardExtensionProps {
  title: string;
}

export interface IScholarshipAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'Scholarship_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Scholarship_QUICK_VIEW';

export default class ScholarshipAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IScholarshipAdaptiveCardExtensionProps,
  IScholarshipAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ScholarshipPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {};
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Scholarship-property-pane'*/
      './ScholarshipPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ScholarshipPropertyPane();
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
