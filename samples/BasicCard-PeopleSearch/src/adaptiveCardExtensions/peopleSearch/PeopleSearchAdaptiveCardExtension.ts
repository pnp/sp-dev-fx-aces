import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PeopleSearchPropertyPane } from './PeopleSearchPropertyPane';
import { IUsers } from '../Model/IUsers';
import { GraphAPIService } from '../Service/GraphAPIService';
import { IGraphAPIService } from '../Service/IGraphAPIService';

export interface IPeopleSearchAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  cardText: string;
  cardButtonText: string;
  defaultMessageText: string;
}

export interface IPeopleSearchAdaptiveCardExtensionState {
  users: Array<IUsers>;
}

const CARD_VIEW_REGISTRY_ID: string = 'PeopleSearch_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PeopleSearch_QUICK_VIEW';

export default class PeopleSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PeopleSearchPropertyPane | undefined;
  private graphService: IGraphAPIService;

  public async onInit(): Promise<void> {
    this.graphService = new GraphAPIService(this.context);

    const userArray: Array<IUsers> = await this.graphService.fetchUsers();
    this.state = {
      users: userArray
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PeopleSearch-property-pane'*/
      './PeopleSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PeopleSearchPropertyPane();
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
