import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FollowDocumentAcEsPropertyPane } from './FollowDocumentAcEsPropertyPane';
import { FollowDocument } from './models/followDocument';
import FollowDocumentsService from './Service/FollowDocumentsService';

import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';

export interface IFollowDocumentAcEsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  MockupData: boolean;
  view: string;
  URL: string;
}

export interface IFollowDocumentAcEsAdaptiveCardExtensionState {
  followDocuments: FollowDocument[];
  ID: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'FollowDocumentAcEs_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FollowDocumentAcEs_QUICK_VIEW';

export default class FollowDocumentAcEsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFollowDocumentAcEsAdaptiveCardExtensionProps,
  IFollowDocumentAcEsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FollowDocumentAcEsPropertyPane | undefined;

  public onInit(): Promise<void> {
    let followDocuments: FollowDocument[] = [];
    const followDocumentsService: FollowDocumentsService = new FollowDocumentsService();
    return followDocumentsService.getFollowDocuments(followDocuments,this.context).then((Items: FollowDocument[]) => {
      Items = Items.sort((a, b) => {
        return b.followedDateTime.getTime() - a.followedDateTime.getTime();
      });
      if (this.properties.MockupData == true) {
        followDocuments = require("../mocks/QuickViewTemplate.json");
      } else {
        if (this.properties.view === "Slider" || this.properties.view === undefined) {
          followDocuments = Items;
        } else {
          followDocuments = Items;
        }
      }

      this.state = {
        ID: 1,
        followDocuments: followDocuments,
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

      return Promise.resolve();
    });

  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FollowDocumentAcEs-property-pane'*/
      './FollowDocumentAcEsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FollowDocumentAcEsPropertyPane();
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