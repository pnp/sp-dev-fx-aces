import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FormsamplePropertyPane } from './FormsamplePropertyPane';
import { cg } from '../../services/cg.service';
import { FormSample } from '../../models/cg.models';

export interface IFormsampleAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IFormsampleAdaptiveCardExtensionState {
  formSample: FormSample;
}

const CARD_VIEW_REGISTRY_ID: string = 'Formsample_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Formsample_QUICK_VIEW';

export default class FormsampleAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFormsampleAdaptiveCardExtensionProps,
  IFormsampleAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 FormsampleAdaptiveCardExtension";
  private _deferredPropertyPane: FormsamplePropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const formSample: FormSample = cg.GetFormSample();

      this.state = {
        formSample: formSample
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err}`, LogLevel.Error);
    }
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Formsample-property-pane'*/
      './FormsamplePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FormsamplePropertyPane();
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
