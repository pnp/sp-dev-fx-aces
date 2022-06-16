import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';
import { IFollowDocumentAcEsAdaptiveCardExtensionProps, IFollowDocumentAcEsAdaptiveCardExtensionState } from '../FollowDocumentAcEsAdaptiveCardExtension';
import { FollowDocument } from '../models/followDocument';
import Graph from "../Service/GraphService";
import FollowDocumentsService from "../Service/FollowDocumentsService";

export interface IQuickViewData {
  SearchfollowDocuments?: FollowDocument | FollowDocument[];
  searchText?: string;
  ID?: number;
  Total?: number;
}

export class QuickView extends BaseAdaptiveCardView<
  IFollowDocumentAcEsAdaptiveCardExtensionProps,
  IFollowDocumentAcEsAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 Follow Documents";
  public get data(): IQuickViewData {
    if (this.properties.view === "Slider" || this.properties.view === undefined) {
      let filter: FollowDocument[] = [];
      if (this.state.SearchText !== "") {
        filter = this.state.followDocuments.filter(item => {
          return item.Title.toLowerCase().indexOf(this.state.SearchText.toLowerCase()) > -1;
        });
      } else {
        filter = this.state.followDocuments;
      }

      return {
        ID: this.state.ID,
        Total: filter.length === 0 ? 1 : filter.length,
        searchText: this.state.SearchText,
        SearchfollowDocuments: filter.length === 0 ? this.state.followDocuments[this.state.ID - 1] : filter[this.state.ID - 1],
      };
    } else {
      let filter: FollowDocument[] = [];
      if (this.state.SearchText !== "") {
        filter = this.state.followDocuments.filter(item => {
          return item.Title.toLowerCase().indexOf(this.state.SearchText.toLowerCase()) > -1;
        });
      } else {
        filter = this.state.followDocuments;
      }
      return {
        searchText: this.state.SearchText,
        SearchfollowDocuments: filter,
      };
    }

  }

  public get template(): ISPFxAdaptiveCard {
    return (this.properties.view === "Slider" || this.properties.view === undefined ? require('./template/SliderTemplate.json') : require('./template/ListTemplate.json'));
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, SearchText, DriveID, ItemID } = action.data;
        if (id === 'previous') {
          let idx = this.state.ID;

          idx--;
          if (idx < 1) {
            idx = 1;
          }

          this.setState({ ID: idx });
        } else if (id === 'next') {
          let idx = this.state.ID;
          let totalfollowDocument: number = 0;
          if (this.state.SearchText !== "") {
            totalfollowDocument = this.state.followDocuments.filter(item => {
              return item.Title.toLowerCase().indexOf(this.state.SearchText.toLowerCase()) > -1;
            }).length;
          } else {
            totalfollowDocument = this.state.followDocuments.length;
          }
          idx++;
          if (idx > (totalfollowDocument == undefined ? 1 : totalfollowDocument)) {
            idx = (totalfollowDocument == undefined ? 1 : totalfollowDocument);
          }
          this.setState({
            ID: idx,
            SearchText: action.data.SearchText === undefined || action.data.SearchText === "{{SearchText.value}}" ? "" : action.data.SearchText,
          });
        }
        if (id === 'unfollow') {
          const graphService: Graph = new Graph();
          const initialized = await graphService.initialize(this.context.serviceScope);
          if (initialized) {
            const graphData: any = await graphService.postGraphContent(`https://graph.microsoft.com/v1.0/drives/${DriveID}/items/${ItemID}/unfollow`, "");
            if (graphData === undefined) {
              let data = [];
              this.state.followDocuments.forEach(element => {
                if (element.ItemId !== ItemID) {
                  data.push(element);
                }
              });
              this.setState({
                followDocuments: data,
                ID: 1,
                SearchText: action.data.SearchText === undefined || action.data.SearchText === "{{SearchText.value}}" ? "" : action.data.SearchText,
              });
            }
          }
        }
        if (id === 'refresh') {
          let followDocuments: FollowDocument[] = [];
          const followDocumentsService: FollowDocumentsService = new FollowDocumentsService();
          followDocumentsService.getFollowDocuments(followDocuments, this.context).then((Items: FollowDocument[]) => {
            Items = Items.sort((a, b) => {
              return b.followedDateTime.getTime() - a.followedDateTime.getTime();
            });
            followDocuments = Items;
            this.setState({
              followDocuments: followDocuments,
              ID: 1,
            });
          });
        }
        if (id === 'Search') {
          let searchText = action.data.SearchText === undefined ? "" : action.data.SearchText;
          this.setState({
            SearchText: searchText,
            ID: 1,
          });
        }
      }
    } catch (err) {
      console.error(this.LOG_SOURCE, err);
    }
  }
}