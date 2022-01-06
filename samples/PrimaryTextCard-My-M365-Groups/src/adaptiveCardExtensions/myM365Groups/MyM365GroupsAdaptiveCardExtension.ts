import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GroupsSummaryView } from './groupsSummaryView/GroupsSummaryView';
import { GroupsListingView } from './groupsListingView/GroupsListingView';
import { MyM365GroupsPropertyPane } from './MyM365GroupsPropertyPane';
import M365GroupService from '../../services/M365GroupService';
import { IGroup } from '../../models/IGroup';

export interface IMyM365GroupsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IMyM365GroupsAdaptiveCardExtensionState {
  selectedGroupType: string;
  ownerGroups: IGroup[];
  memberGroups: IGroup[];
}

const CARD_VIEW_REGISTRY_ID: string = 'MyM365Groups_CARD_VIEW';
export const GROUPS_SUMMARY_VIEW_REGISTRY_ID: string = 'MyM365Groups_SUMMARY_VIEW';
export const GROUPS_LISTING_VIEW_REGISTRY_ID: string = 'MyM365Groups_LISTING_VIEW';

export default class MyM365GroupsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyM365GroupsAdaptiveCardExtensionProps,
  IMyM365GroupsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyM365GroupsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      selectedGroupType: "",
      ownerGroups: [],
      memberGroups: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(GROUPS_SUMMARY_VIEW_REGISTRY_ID, () => new GroupsSummaryView());
    this.quickViewNavigator.register(GROUPS_LISTING_VIEW_REGISTRY_ID, () => new GroupsListingView());

    M365GroupService.setup(this.context);

    let ownerGroups: IGroup[] = await M365GroupService.getMyOwnerGroups();
    let memberGroups: IGroup[] = await M365GroupService.getMyMemberGroups();

    this.setState({ ownerGroups, memberGroups });

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
      /* webpackChunkName: 'MyM365Groups-property-pane'*/
      './MyM365GroupsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyM365GroupsPropertyPane();
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
