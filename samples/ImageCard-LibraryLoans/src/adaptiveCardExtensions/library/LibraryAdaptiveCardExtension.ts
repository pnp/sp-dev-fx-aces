import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { LibraryPropertyPane } from './LibraryPropertyPane';

export interface ILibraryAdaptiveCardExtensionProps {
  title: string;
}

export interface ILibraryAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'Library_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Library_QUICK_VIEW';

export default class LibraryAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ILibraryAdaptiveCardExtensionProps,
  ILibraryAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: LibraryPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {};
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Library-property-pane'*/
      './LibraryPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.LibraryPropertyPane();
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
