import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ISearchResult } from '../../../model/ISearchResult';
import utils from '../../../utils/utils';
import { ISearchAdaptiveCardExtensionProps, ISearchAdaptiveCardExtensionState } from '../SearchAdaptiveCardExtension';

export interface ISearchResultsQuickViewData {
    searchItems: {
        fileIcon: string;
        title: string;
        fileLocation: string;
        lastModifiedDateString: string;
        url: string;
    }[];
}
export const SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID: string = 'SEARCH_RESULTS_QUICK_VIEW';
export class SearchResultsQuickView extends BaseAdaptiveCardView<
    ISearchAdaptiveCardExtensionProps,
    ISearchAdaptiveCardExtensionState,
    ISearchResultsQuickViewData
> {
    public get data(): ISearchResultsQuickViewData {
        return {
            searchItems: this.state.searchItems.map(this.mapToCardData)
        };
    }

    public mapToCardData(searchItem: ISearchResult) {
        return {
            fileIcon: utils.GetFileImageUrl(searchItem.fields.url),
            title: searchItem.fields.title,
            fileLocation: searchItem.fields.siteTitle,
            lastModifiedDateString: new Date(searchItem.lastModifiedDateTime).toLocaleDateString(),
            url: searchItem.fields.url
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/SearchResultsTemplate.json');
    }

}