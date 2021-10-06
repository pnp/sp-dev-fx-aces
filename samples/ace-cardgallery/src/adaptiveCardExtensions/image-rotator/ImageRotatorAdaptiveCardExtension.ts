import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, IImage } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ImageRotatorPropertyPane } from './ImageRotatorPropertyPane';
import { cg } from '../../services/cg.service';
import { Image } from "../../models/cg.models";

export interface IImageRotatorAdaptiveCardExtensionProps {
  homeSite: string;
  title: string;
  description: string;
}

export interface IImageRotatorAdaptiveCardExtensionState {
  currentImageId: number;
  images: Image[];
}

const CARD_VIEW_REGISTRY_ID: string = 'ImageRotator_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ImageRotator_QUICK_VIEW';

export default class ImageRotatorAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IImageRotatorAdaptiveCardExtensionProps,
  IImageRotatorAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 ImageRotatorAdaptiveCardExtension";

  private _deferredPropertyPane: ImageRotatorPropertyPane | undefined;


  public onInit(): Promise<void> {
    try {

      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const images: Image[] = cg.GetImages();
      const firstImageId = Math.floor((Math.random() * images.length - 1) + 1);

      this.state = {
        currentImageId: firstImageId,
        images: images
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${err}`, LogLevel.Error);
    }

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ImageRotator-property-pane'*/
      './ImageRotatorPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ImageRotatorPropertyPane();
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
