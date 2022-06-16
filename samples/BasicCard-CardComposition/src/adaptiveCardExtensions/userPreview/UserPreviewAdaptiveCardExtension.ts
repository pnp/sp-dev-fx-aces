import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { UserPreviewPropertyPane } from './UserPreviewPropertyPane';
import { SPFxHttpClient } from '../../dal/http/SPFxHttpClient';
import { BatchGraphClient } from '../../dal/http/BatchGraphClient';
import { ColleaguesQuickView } from './quickView/ColleaguesQuickView';
import { PeopleService } from '../../service/PeopleService';
import { PeopleViewManager } from '../../viewManager/PeopleViewManager';

export interface IUserPreviewAdaptiveCardExtensionProps {
  title: string;
}

export interface IUserPreviewAdaptiveCardExtensionState {

}

const CARD_VIEW_REGISTRY_ID: string = 'UserPreview_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'UserPreview_QUICK_VIEW';
export const QUICK_VIEW_Colleagues_REGISTRY_ID: string = 'UserPreview_QUICK_VIEW_Colleagues';

export default class UserPreviewAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IUserPreviewAdaptiveCardExtensionProps,
  IUserPreviewAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: UserPreviewPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = { 
    };
    let spfxGraphClient = await this.context.aadHttpClientFactory.getClient("https://graph.microsoft.com");
    let graphClient = new BatchGraphClient(new SPFxHttpClient(spfxGraphClient));
    let userResponse = await graphClient.get("/me?$select=displayName,jobTitle");
    let peopleService = new PeopleService(graphClient, this.context.pageContext.user.loginName.toString());
    let viewManager = new PeopleViewManager(peopleService);
    let user = await userResponse.json();
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView(user));
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView(viewManager));
    this.quickViewNavigator.register(QUICK_VIEW_Colleagues_REGISTRY_ID, () => new ColleaguesQuickView(viewManager));

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'UserPreview-property-pane'*/
      './UserPreviewPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.UserPreviewPropertyPane();
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
