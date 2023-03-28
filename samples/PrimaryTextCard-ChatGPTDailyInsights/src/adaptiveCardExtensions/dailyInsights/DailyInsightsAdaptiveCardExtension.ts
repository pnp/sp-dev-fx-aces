import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DailyInsightsPropertyPane } from './DailyInsightsPropertyPane';

export interface IDailyInsightsAdaptiveCardExtensionProps {
  cardtitle: string;
  primarytext:string;
  primarydesc:string;
  apiKey:string;
  maxToken:string;
  category:string;
  model:string;
}

export interface IDailyInsightsAdaptiveCardExtensionState {
  insight:string;
  error:boolean;
  nextcount:number;
}

const CARD_VIEW_REGISTRY_ID: string = 'DailyInsights_CARD_VIEW';
const localStorageKey = "DailyInsightsKey";
export const QUICK_VIEW_REGISTRY_ID: string = 'DailyInsights_QUICK_VIEW';

export default class DailyInsightsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDailyInsightsAdaptiveCardExtensionProps,
  IDailyInsightsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DailyInsightsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { insight:"", error:false,nextcount:0};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    /* eslint-disable */
    this.loadData().then();
    /* eslint-enable */
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'DailyInsights-property-pane'*/
      './DailyInsightsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DailyInsightsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged() :void{
    sessionStorage.removeItem(localStorageKey);
  }

   private async loadData() :Promise<void> {
    if((this.properties.apiKey === undefined || this.properties.apiKey.length === 0)) {
      this.setState({insight:"Missing Configuration, please check with admin"});
      return;
    }
    
    if(this.properties.category) {

      const datafromStorage = sessionStorage.getItem(localStorageKey);
      if(datafromStorage){
        this.setState({insight:datafromStorage});
        return;
      }

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":
          "Bearer " + this.properties.apiKey
        },
        body: JSON.stringify({
          model: this.properties.model,
          prompt: this.properties.category, 
          temperature: 0.6,
          "max_tokens": parseInt(this.properties.maxToken), 
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      else{
         this.setState({insight:data.choices[0].text});
         sessionStorage.setItem(localStorageKey, this.state.insight);
      }
      
    }
    else{
      this.setState({insight:"Missing Configuration, please check with admin"});
    }
    
  }
}
