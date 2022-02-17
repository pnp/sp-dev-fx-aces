import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PnPPodcastsAdaptiveCardExtensionStrings';
import { IPnPPodcastsAdaptiveCardExtensionProps, IPnPPodcastsAdaptiveCardExtensionState } from '../PnPPodcastsAdaptiveCardExtension';
import { ItemEntity } from './../models/PnPPodcasts';

export interface IQuickViewData {
  SearchText?: string;
  Items: ItemEntity;
  TotalEpisodes: number;
  searchText?: string;
  ID?: number;

}

export class QuickView extends BaseAdaptiveCardView<
  IPnPPodcastsAdaptiveCardExtensionProps,
  IPnPPodcastsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    let filter: ItemEntity[] = [];
    if (this.state.SearchText !== "") {
      filter = this.state.Items.filter(item => {
        return item.description.toLowerCase().indexOf(this.state.SearchText.toLowerCase()) > -1;
      });
    } else {
      filter = this.state.Items;
    }

    return {
      ID: this.state.ID,
      TotalEpisodes: filter.length === 0 ? 1 : filter.length,
      searchText: this.state.SearchText,
      Items: filter.length === 0 ? this.state.Items[this.state.ID - 1] : filter[this.state.ID - 1],
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'previous') {
          let idx = this.state.ID;

          idx--;
          if (idx < 1) {
            idx = 1;
          }

          this.setState({ ID: idx });
        } else if (id === 'next') {
          let idx = this.state.ID;
          let totalItems: number = 0;
          if (this.state.SearchText !== "") {
            totalItems = this.state.Items.filter(item => {
              return item.description.toLowerCase().indexOf(this.state.SearchText.toLowerCase()) > -1;
            }).length;
            
          } else {
            totalItems = this.state.Items.length;
          }
          idx++;
          if (idx > (totalItems == undefined ? 1 : totalItems)) {
            idx = (totalItems == undefined ? 1 : totalItems);
          }
          this.setState({
            ID: (idx == 0 ? 1 : idx),
            SearchText: action.data.SearchText === undefined || action.data.SearchText === "{{SearchText.value}}" ? "" : action.data.SearchText,
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
      console.error(err.message);
    }
  }
}