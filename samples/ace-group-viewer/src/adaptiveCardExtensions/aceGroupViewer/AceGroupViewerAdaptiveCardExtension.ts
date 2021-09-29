import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceGroupViewerPropertyPane } from './AceGroupViewerPropertyPane';
import { sp } from "@pnp/sp";
import { graph } from '@pnp/graph';
import { PnPService } from '../../service';
import { IMember } from '../../models/IMember';

export interface IAceGroupViewerAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IAceGroupViewerAdaptiveCardExtensionState {
  description: string;
  groupName: string;
  members: IMember[];
  memberCount: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'AceGroupViewer_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceGroupViewer_QUICK_VIEW';

export default class AceGroupViewerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceGroupViewerAdaptiveCardExtensionProps,
  IAceGroupViewerAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceGroupViewerPropertyPane | undefined;
  private PnPService: PnPService = new PnPService();
  private members: IMember[] = [];
  private groupName: string = null;

  public async onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    graph.setup({
      spfxContext: this.context
    });
    await this.PnPService._getGroupName().then(response => {
      this.groupName = response;
    });
    await this.PnPService._init().then(response => {
      console.log(response);
      this.members = response;
    });
    this.state = {
      description: this.properties.description,
      members: this.members,
      memberCount: this.members.length,
      groupName: this.groupName
    };

    console.log(this.state.members)

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

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
      /* webpackChunkName: 'AceGroupViewer-property-pane'*/
      './AceGroupViewerPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceGroupViewerPropertyPane();
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
