import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceImageViewerPropertyPane } from './AceImageViewerPropertyPane';
import { isEmpty } from '@microsoft/sp-lodash-subset'
import {
  searchImages,
  INasaImage
} from './nasa.service';

export interface IAceImageViewerAdaptiveCardExtensionProps {
  title: string;
  searchQuery: string;
}

export interface IAceImageViewerAdaptiveCardExtensionState {
  currentIndex: number;
  images: INasaImage[];
}

const CARD_VIEW_REGISTRY_ID: string = 'AceImageViewer_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceImageViewer_QUICK_VIEW';

export default class AceImageViewerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceImageViewerPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      currentIndex: 0,
      images: []
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    if (!isEmpty(this.properties.searchQuery)) {
      this.setState({
        images: await searchImages(this.context, this.properties.searchQuery)
      });
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceImageViewer-property-pane'*/
      './AceImageViewerPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceImageViewerPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration() ?? super.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): void {
    if (propertyPath === 'searchQuery' && newValue !== oldValue) {
      (async () => {
        this.setState({
          currentIndex: 0,
          images: await searchImages(this.context, newValue)
        });
      })().catch(console.error);
    }
  }
}
