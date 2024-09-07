import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { FilesByContentTypePropertyPane } from './FilesByContentTypePropertyPane';
import { QuickView } from './quickView/QuickView';
import { FileService, IFileService } from '../FileService';
import { GraphFiles, PieFileData } from '../types';

export interface IFilesByContentTypeAdaptiveCardExtensionProps {
  title: string;
  siteAddress: string;
  listTitle: string;
  filesNumberByCtP: PieFileData[]
}

export interface IFilesByContentTypeAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'FilesByContentType_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FilesByContentType_QUICK_VIEW';


export default class FilesByContentTypeAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFilesByContentTypeAdaptiveCardExtensionProps,
  IFilesByContentTypeAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FilesByContentTypePropertyPane;

  public async onInit(): Promise<void> {
    this.state = {};
    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    await this.retrieveFiles();
    return Promise.resolve();
  }

  private async retrieveFiles(): Promise<void> {
    let filesData: PieFileData[] = [];
    const service: IFileService = new FileService(this.context);
    const allFiles: GraphFiles = await service._getFiles(this.properties.siteAddress, this.properties.listTitle);
    const ctNames: string[] = allFiles.value.map((file) => file.contentType.name);
    let uniqueNames = [...new Set(ctNames)];
    uniqueNames.forEach(ctName => {
      let currentCtCount = allFiles.value.filter(file => file.contentType.name === ctName);
      filesData.push({ name: ctName, total: currentCtCount.length });
    })
    this.properties.filesNumberByCtP = filesData;
  }


  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FilesByContentType-property-pane'*/
      './FilesByContentTypePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FilesByContentTypePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {
    if (newValue !== oldValue) {
      this.renderCard();
    }
  }
}
