import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OneDriveCarouselPropertyPane } from './OneDriveCarouselPropertyPane';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { MSGraphClient } from '@microsoft/sp-http';
import gu from './GraphUtility';

export interface IOneDriveCarouselAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  selectedDriveId: string;
  timerSeconds: number;
  randomizeImage: boolean;
  hideButtons: boolean;
}

export interface IOneDriveCarouselAdaptiveCardExtensionState {
  description: string;
  rootDriveId: string;
  drivesResults: IPropertyPaneDropdownOption[];
  itemIndex: number;
  targetFolder: MicrosoftGraph.DriveItem;
  error: object;
  isLoading: boolean;
  folderHasImages: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'OneDriveCarousel_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'OneDriveCarousel_QUICK_VIEW';

export default class OneDriveCarouselAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IOneDriveCarouselAdaptiveCardExtensionProps,
  IOneDriveCarouselAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: OneDriveCarouselPropertyPane | undefined;
  private updateImageTimer;
  private graphClient: MSGraphClient;

  public onInit(): Promise<void> {
    this.state = {
      description: this.properties.description,
      rootDriveId: undefined,
      drivesResults: undefined,
      itemIndex: 0,
      targetFolder: undefined,
      error: undefined,
      isLoading: true,
      folderHasImages: false
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    setTimeout(async () => {
      this.graphClient = await this.context.msGraphClientFactory.getClient();      
      // Get the first drive as root and load the children for the dropdown control
      
      this.graphClient
      .api(`/${gu.path_me}/${gu.path_drives}`)
      .select(`${gu.prop_id},${gu.prop_name}`)
      .get((error, drives) => {
        if (error) {
          this.setError(error);
          return;
        }

        this.setState({
          rootDriveId: (drives && drives.value && drives.value.length > 0) ? drives.value[0].id : undefined
        });
        
        if(this.state.rootDriveId) {
          this.loadDrives();

          if (this.properties.selectedDriveId) {
            this.loadTargetDriveItems();

            if (this.properties.timerSeconds) {
              this.updateImageTimer = setInterval(this.updateImageIndex, (this.properties.timerSeconds * 1000));
            }
          }
        }
        else {
          this.setState({
            isLoading: false
          });
        }
      });
    }, 500);

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
      /* webpackChunkName: 'OneDriveCarousel-property-pane'*/
      './OneDriveCarouselPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.OneDriveCarouselPropertyPane();
        }
      );
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (oldValue == newValue) {
      return;
    }

    if (propertyPath == "selectedDriveId") {
      this.loadTargetDriveItems();
    }
    else if (propertyPath == "timerSeconds") {
      clearInterval(this.updateImageTimer);
      this.updateImageTimer = setInterval(this.updateImageIndex, (this.properties.timerSeconds * 1000));
    }
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.state.drivesResults);
  }

  private loadDrives = async (): Promise<void> => {
    await this.graphClient.api(`/${gu.path_me}/${gu.path_drives}/${this.state.rootDriveId}/${gu.path_root}/${gu.path_children}`)
          .select(`${gu.prop_id},${gu.prop_name}`)
          .get((error, drives) => {
            if (error) {
              this.setError(error);
              return;
            }

            this.setState({
              drivesResults: drives.value.map((v: MicrosoftGraph.Drive, i: number) : IPropertyPaneDropdownOption => { return { key: v.id, text: v.name } as IPropertyPaneDropdownOption; })
            });
          });
  }

  private loadTargetDriveItems = () => {
    this.setState({
      isLoading: true
    });
    this.graphClient.api(`/${gu.path_me}/${gu.path_drives}/${this.state.rootDriveId}/${gu.path_items}/${this.properties.selectedDriveId}`)
      .expand(gu.path_children)
      .get((error, targetFolder: MicrosoftGraph.DriveItem) => {          
        if (error) {
          this.setError(error);
          return;
        }

        if(targetFolder && targetFolder.children) {
          // Remove the non image children
          targetFolder.children = targetFolder.children.filter(c => c.image);
        }

        this.setState({
          targetFolder: targetFolder,
          folderHasImages: targetFolder.children && targetFolder.children.length > 0,
          isLoading: false
        });
      });
  }

  private updateImageIndex = () => {
    if(this.state.targetFolder && 
      this.state.targetFolder.children && 
      this.state.targetFolder.children.length > 0) {
        var i = this.state.itemIndex;

        if(this.properties.randomizeImage == true) {
          i = this.randomIndex(0, this.state.targetFolder.children.length - 1);
        }
        else {
          i++;
          if(i >= this.state.targetFolder.children.length) {
            i = 0;
          }
        }

        this.setState({
          itemIndex: i
        });
    }
  }

  private randomIndex(min, max) { 
    let result = Math.floor(Math.random() * (max - min + 1) + min);

    // Avoid displaying the same image again
    if(result == this.state.itemIndex) {
      return this.randomIndex(min, max);
    }

    return result;
  }

  private setError = (error: object) => {
    this.setState({
      error: error,
      isLoading: false
    });

    console.log(error);
  }
}
