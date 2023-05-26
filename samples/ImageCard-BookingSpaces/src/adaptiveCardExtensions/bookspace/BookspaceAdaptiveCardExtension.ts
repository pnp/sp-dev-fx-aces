import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { BookspacePropertyPane } from './BookspacePropertyPane';

export interface IBookspaceAdaptiveCardExtensionProps {
  title: string;
}

export interface IBookspaceAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'Bookspace_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Bookspace_QUICK_VIEW';

export default class BookspaceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IBookspaceAdaptiveCardExtensionProps,
  IBookspaceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: BookspacePropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Bookspace-property-pane'*/
      './BookspacePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.BookspacePropertyPane();
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
