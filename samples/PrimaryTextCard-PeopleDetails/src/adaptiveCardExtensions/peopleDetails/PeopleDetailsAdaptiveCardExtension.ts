import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ReadView } from './quickView/ReadView';
import { CreateView } from './quickView/CreateView';
import { UpdateView } from './quickView/UpdateView';
import { MessageView } from './quickView/MessageView';
import { MediumCardView } from './cardView/MediumCardView';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { DialogueView } from './quickView/DialogueView';
import { ShowAllView } from './quickView/ShowAllView';
import { PeopleDetailsPropertyPane } from './PeopleDetailsPropertyPane';
import { PnPServices } from '../../Services/PnPServices';

export interface IPeopleDetailsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IPeopleDetailsAdaptiveCardExtensionState {
  currentIndex: number;
  peopleData: any[];
  countryData: any[];
  messageBar: {
    text: string;
    success: boolean;
    iconUrl: string;
    color: string;
  };
  context?: any;
  imgPath?: any;
}

export interface IPeopleData {
  title: string;
  email: string;
  jobTitle: string;
  country: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'PeopleDetails_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PeopleDetails_QUICK_VIEW';
export const READ_VIEW_REGISTRY_ID: string = 'PeopleDetails_READ_VIEW';
export const CREATE_VIEW_REGISTRY_ID: string = 'PeopleDetails_CREATE_VIEW';
export const UPDATE_VIEW_REGISTRY_ID: string = 'PeopleDetails_UPDATE_VIEW';
export const MESSAGE_VIEW_REGISTRY_ID: string = 'PeopleDetails_MESSAGE_VIEW';
export const DIALOGUE_VIEW_REGISTRY_ID: string = 'PeopleDetails_Dialogue_VIEW';
export const SHOWALLMEDIUM_VIEW_REGISTRY_ID: string = 'PeopleDetails_Medium_VIEW';

const MEDIUM_VIEW_REGISTRY_ID: string = 'PeopleDetails_MEDIUM_VIEW';

export default class PeopleDetailsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPeopleDetailsAdaptiveCardExtensionProps,
  IPeopleDetailsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PeopleDetailsPropertyPane | undefined;

  public onInit = async () => {
    sp.setup({
      spfxContext: this.context
    });
    let refreshData: any = await PnPServices.refreshData();
    this.state = {
      currentIndex: 0,
      peopleData: refreshData["peopleData"],
      countryData: refreshData["countryData"],
      messageBar: {
        text: "",
        success: true,
        iconUrl: "",
        color: ""
      },
      context: this.context.pageContext,
      imgPath: this.context.pageContext.site.absoluteUrl + '/SiteAssets/'
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(READ_VIEW_REGISTRY_ID, () => new ReadView());
    this.quickViewNavigator.register(CREATE_VIEW_REGISTRY_ID, () => new CreateView());
    this.quickViewNavigator.register(UPDATE_VIEW_REGISTRY_ID, () => new UpdateView());
    this.quickViewNavigator.register(MESSAGE_VIEW_REGISTRY_ID, () => new MessageView());
    this.quickViewNavigator.register(DIALOGUE_VIEW_REGISTRY_ID, () => new DialogueView());

    this.cardNavigator.register(MEDIUM_VIEW_REGISTRY_ID, () => new MediumCardView());
    this.quickViewNavigator.register(SHOWALLMEDIUM_VIEW_REGISTRY_ID, () => new ShowAllView());
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PeopleDetails-property-pane'*/
      './PeopleDetailsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PeopleDetailsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    // return this.cardSize === 'Large' ? CARD_VIEW_REGISTRY_ID : MEDIUM_VIEW_REGISTRY_ID;
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
