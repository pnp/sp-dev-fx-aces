import {
  BaseAdaptiveCardExtension,
} from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { IFiles } from '../../models';
import { Services } from '../../services/services';
import { CardView } from './cardView/CardView';
import { MyRecentFilesPropertyPane } from './MyRecentFilesPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface IMyRecentFilesAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;

}
export interface IMyRecentFilesAdaptiveCardExtensionState {
  files: IFiles[];
}

const CARD_VIEW_REGISTRY_ID: string = 'MyRecentFiles_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyRecentFiles_QUICK_VIEW';

export default  class MyRecentFilesAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyRecentFilesAdaptiveCardExtensionProps,
  IMyRecentFilesAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyRecentFilesPropertyPane | undefined;
  private _services: Services;
  public  async onInit(): Promise<void> {

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this._services = new Services(this.context);
    await this._services.init();
    const files:IFiles[] = await this._services.getFiles()  ;
    this.state = { files: files };
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyRecentFiles-property-pane'*/
      './MyRecentFilesPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyRecentFilesPropertyPane();
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
