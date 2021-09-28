import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView, SetupCardView, ErrorCardView } from './cardViews/index';
import { NewsGlancePropertyPane } from './NewsGlancePropertyPane';
import { Article, GlanceCard } from './types';
import { SPHttpClient } from '@microsoft/sp-http';
import { getSP } from '../../pnpjs';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { format, parseISO } from 'date-fns';

export interface INewsGlanceAdaptiveCardExtensionProps {
  iconProperty: string;
  id: number;
  numberOfSentences: number;
  showStaticContent: boolean;
  firstContent: string;
  secondContent: string;
  thirdContent: string;
}

export interface INewsGlanceAdaptiveCardExtensionState {
  glanceCardIndex: number;
  glanceCards: GlanceCard[];
  numberOfGlanceCards: number;
  articleLink: string;
  errorMessage: string;
  cardViewToRender: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'NewsGlance_CARD_VIEW';
const SETUP_CARD_VIEW_REGISTRY_ID: string = 'NewsGlance_SETUP_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'NewsGlance_ERROR_CARD_VIEW';

export default class NewsGlanceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  INewsGlanceAdaptiveCardExtensionProps,
  INewsGlanceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: NewsGlancePropertyPane | undefined;

  public async onInit(): Promise<void> {

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(SETUP_CARD_VIEW_REGISTRY_ID, () => new SetupCardView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());


    this.state = {
      glanceCardIndex: -1,
      glanceCards: [],
      numberOfGlanceCards: 0,
      articleLink: "#",
      errorMessage: "",
      cardViewToRender: CARD_VIEW_REGISTRY_ID
    };

    this.loadDetails();
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'NewsGlance-property-pane'*/
      './NewsGlancePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.NewsGlancePropertyPane();
        }
      );
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

    /* if (
      (
        propertyPath === "id" ||
        propertyPath === "showStaticContent" ||
        propertyPath === "firstContent" ||
        propertyPath === "secondContent" ||
        propertyPath === "thirdContent") && oldValue !== newValue) {
      this.loadDetails();
    } */

    if (oldValue !== newValue) {
      this.loadDetails();
    }

  }

  protected renderCard(): string | undefined {
    return this.state.cardViewToRender;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.properties);
  }

  private async getArticle(): Promise<Article> {
    try {
      const spHttpClient: SPHttpClient = this.context.spHttpClient;
      const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;

      const response = await spHttpClient.get(
        `${currentWebUrl}/_api/web/lists/getbytitle('Site Pages')/items(${this.properties.id})?$select=Title,BannerImageUrl,FileRef,CanvasContent1,Modified`,
        SPHttpClient.configurations.v1);

      const articleDetails = await response.json();

      if(articleDetails.error) {
        console.error(articleDetails.error);
        return null;
      }

      return {
        content: articleDetails.CanvasContent1,
        imageUrl: articleDetails.BannerImageUrl.Url,
        link: articleDetails.FileRef,
        title: `${articleDetails.Title} (${format(parseISO(articleDetails.Modified), "do MMM yyyy")})`
      };
    } catch (error) {
      console.error(error);
      return null;
    }

  }

  private async loadDetails(): Promise<void> {

    if (isEmpty(this.properties.id)) {
      this.setState({
        cardViewToRender: SETUP_CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);
      return;
    }

    setTimeout(async () => {

      // Using PnP JS
      // const sp = getSP(this.context);
      // const article = await sp.web.getArticle(this.properties.id);

      const article = await this.getArticle();

      if (article === null) {
        this.setState({
          cardViewToRender: ERROR_CARD_VIEW_REGISTRY_ID,
          errorMessage: "Please check if the ID is correct"
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      let glanceCards: GlanceCard[] = [];

      let commonGlanceCard: GlanceCard = {
        imageUrl: article.imageUrl,
        title: "At a glance",
        primaryText: ""
      };

      glanceCards.push({ ...commonGlanceCard, primaryText: article.title });

      let numberOfGlanceCards: number = 3;
      let numberOfSentences: number = this.properties.numberOfSentences ? this.properties.numberOfSentences : 3;

      if (this.properties.showStaticContent) {

        glanceCards.push({ ...commonGlanceCard, primaryText: this.properties.firstContent });
        glanceCards.push({ ...commonGlanceCard, primaryText: this.properties.secondContent });
        glanceCards.push({ ...commonGlanceCard, primaryText: this.properties.thirdContent });

      } else {

        //remove html tags
        let articleContent = article.content.replace(/(<([^>]+)>)/gi, "");

        //remove any GUIDs
        articleContent = articleContent.replace(/(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/g, "");
        
        const articleContentSentences = articleContent.match(/([^ \r\n][^!?\.\r\n]+[\w!?\.]+)/g);

        numberOfGlanceCards = articleContentSentences.length > numberOfSentences ? numberOfSentences : articleContentSentences.length;

        articleContentSentences.slice(0, numberOfSentences).map(s => {
          glanceCards.push({ ...commonGlanceCard, primaryText: s });
        });
      }

      this.setState({
        glanceCardIndex: 0,
        glanceCards,
        numberOfGlanceCards,
        articleLink: article.link,
        cardViewToRender: CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);

    }, 300);
  }
}
