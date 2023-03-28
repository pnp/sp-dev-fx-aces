import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IDailyInsightsAdaptiveCardExtensionProps, IDailyInsightsAdaptiveCardExtensionState } from '../DailyInsightsAdaptiveCardExtension';

export interface IQuickViewData {
  insight: string;
  category:string;
  nextCount:number;
}
const localStorageKey = "DailyInsightsKey";
export class QuickView extends BaseAdaptiveCardView<
  IDailyInsightsAdaptiveCardExtensionProps,
  IDailyInsightsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      insight: this.state.insight,
      category:this.properties.category,
      nextCount: this.state.nextcount
    };
  }

  /* eslint-disable */
  public async onAction(action: any): Promise<void> {
  /* eslint-enable */
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'next') {
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
             this.setState({insight:data.choices[0].text,nextcount:this.state.nextcount +1});
             sessionStorage.setItem(localStorageKey, this.state.insight);
          }
        }
      }
      
    } catch (err) {
      console.log(err);
    }
}

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}