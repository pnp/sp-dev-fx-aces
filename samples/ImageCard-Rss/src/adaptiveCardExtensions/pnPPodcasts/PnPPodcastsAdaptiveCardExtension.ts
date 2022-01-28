import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PnPPodcastsPropertyPane } from './PnPPodcastsPropertyPane';
import { PnPPodcasts, ItemEntity, Channel } from './models/PnPPodcasts';
import PnPPodcastsService from './Service/PnPPodcastsService';

export interface IPnPPodcastsAdaptiveCardExtensionProps {
    title: string;
    description: string;
    iconProperty: string;
    logo: string;
    URL: string;
}

export interface IPnPPodcastsAdaptiveCardExtensionState {
    Items: ItemEntity[];
    channel: Channel;
    SearchText?: string;
    ID: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'PnPPodcasts_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PnPPodcasts_QUICK_VIEW';

export default class PnPPodcastsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
    IPnPPodcastsAdaptiveCardExtensionProps,
    IPnPPodcastsAdaptiveCardExtensionState
> {
    private _deferredPropertyPane: PnPPodcastsPropertyPane | undefined;

    public onInit(): Promise<void> {
        let _podcastsContent: PnPPodcasts;
        const podcastsService: PnPPodcastsService = new PnPPodcastsService();
        return podcastsService.getRSSContent(_podcastsContent, this.context.httpClient).then((ouputPodcastsContent: PnPPodcasts) => {
            this.state = {
                ID: 1,
                SearchText: "",
                Items: ouputPodcastsContent.channel.item,
                channel: ouputPodcastsContent.channel,
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
            /* webpackChunkName: 'PnPPodcasts-property-pane'*/
            './PnPPodcastsPropertyPane'
        )
            .then(
                (component) => {
                    this._deferredPropertyPane = new component.PnPPodcastsPropertyPane();
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
