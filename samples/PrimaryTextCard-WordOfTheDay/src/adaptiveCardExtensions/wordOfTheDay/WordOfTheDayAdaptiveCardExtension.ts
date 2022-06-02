import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { WordOfTheDayPropertyPane } from './WordOfTheDayPropertyPane';
import { HttpClient } from '@microsoft/sp-http';
import { WordOfTheDay } from './model/WordOfTheDay';
import WordOfTheDaySampleData from './model/WordOfTheDaySample';


export interface IWordOfTheDayAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  apiKey: string;
  useSampleData: boolean;
}

export interface IWordOfTheDayAdaptiveCardExtensionState {
  wordOfTheDay: WordOfTheDay;
  isError: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'WordOfTheDay_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'WordOfTheDay_QUICK_VIEW';

const WORDNIK_API_URL = "https://api.wordnik.com/v4/words.json/";
const WORD_OF_THE_DAY = "wordOfTheDay";
const API_KEY = "api_key";

export default class WordOfTheDayAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IWordOfTheDayAdaptiveCardExtensionProps,
  IWordOfTheDayAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: WordOfTheDayPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      wordOfTheDay: undefined,
      isError: false
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    setTimeout(async () => {
      await this.loadWordOfTheDay();
    }, 500);

    return Promise.resolve();
  }

  private async loadWordOfTheDay() {
    if((this.properties.useSampleData == undefined || this.properties.useSampleData == false) && (this.properties.apiKey == undefined || this.properties.apiKey.length == 0)) {
      this.setState({
        wordOfTheDay: undefined,
        isError: true
      });
      return;
    }

    if((this.properties.useSampleData == undefined || this.properties.useSampleData == false) && (this.properties.apiKey && this.properties.apiKey.length > 0)) {
      var response = await this.context.httpClient.get(`${WORDNIK_API_URL}${WORD_OF_THE_DAY}?${API_KEY}=${this.properties.apiKey}`, HttpClient.configurations.v1);
      var wordOfTheDay: any = undefined;

      if(response.ok) {
        wordOfTheDay = await response.json();
      }
      
      if(!wordOfTheDay) {
        this.setState({
          wordOfTheDay: undefined,
          isError: true
        });

        return;
      }

      this.setState({
        wordOfTheDay: wordOfTheDay
      });
    }
    else if(this.properties.useSampleData == true){
      this.setState({
        wordOfTheDay: WordOfTheDaySampleData.WordOfTheDaySample()
      });
    }
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return 'PlainText';
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'WordOfTheDay-property-pane'*/
      './WordOfTheDayPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.WordOfTheDayPropertyPane();
        }
      );
  }

   protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (oldValue == newValue) {
      return;
    }

    if (propertyPath == "useSampleData" || propertyPath == "apiKey") {
      this.loadWordOfTheDay();
    }
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
