import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { RecentFilesAcePropertyPane } from './RecentFilesAcePropertyPane';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface IRecentFilesAceAdaptiveCardExtensionProps {
  title: string;
}

export interface IRecentFilesAceAdaptiveCardExtensionState {
  recents: MicrosoftGraph.DriveItem[];
  currentFile: MicrosoftGraph.DriveItem;
  currentIndex: number;
  oneDriveUrl: string;
  isLoading: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'RecentFilesAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'RecentFilesAce_QUICK_VIEW';

export default class RecentFilesAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IRecentFilesAceAdaptiveCardExtensionProps,
  IRecentFilesAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: RecentFilesAcePropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      recents: [],
      currentFile: undefined,
      currentIndex: 0,
      oneDriveUrl: "https://onedrive.com/",
      isLoading: true
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    setTimeout(async () => {
      await this.loadRecents();
    }, 500);

    return Promise.resolve();
  }

  private async loadRecents() {
    var graphClient = await this.context.msGraphClientFactory.getClient();
    // Get the recent files
    var recentFilesResponse = await graphClient.api("/me/drive/recent")
      .select("name,lastModifiedDateTime,webUrl")
      .get();
      
    this.setState({
      recents: <MicrosoftGraph.DriveItem[]>recentFilesResponse.value,
      isLoading: false
    });

    // Get the OneDrive root folder
    var drive: MicrosoftGraph.DriveItem = await graphClient.api("/me/drive")
      .select("webUrl")
      .get();

    if(drive && drive.webUrl) {
      this.setState({
        oneDriveUrl: drive.webUrl
      });
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'RecentFilesAce-property-pane'*/
      './RecentFilesAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.RecentFilesAcePropertyPane();
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
