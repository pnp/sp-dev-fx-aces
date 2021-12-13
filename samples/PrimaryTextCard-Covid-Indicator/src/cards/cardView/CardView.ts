import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
} from "@microsoft/sp-adaptive-card-extension-base";
import * as strings from "CovidIndicatorAdaptiveCardExtensionStrings";
import {
  ICovidIndicatorAdaptiveCardExtensionProps,
  ICovidIndicatorAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from "../../adaptiveCardExtensions/covidIndicator/CovidIndicatorAdaptiveCardExtension";


import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
const CARDDATA_TEMPLATE = `
|               |             |
| ------------- | ----------- |
| ![Minion]({0}) |**{4}**|

| Active:      |    **{1}**    |
| ------------:| ------------: |
|**New:**      |    **{2}**    |
 ###### {3}
`;

//const coutriesCodes: any = require("../../../data/countries.json");
export class CardView extends BasePrimaryTextCardView<
  ICovidIndicatorAdaptiveCardExtensionProps,
  ICovidIndicatorAdaptiveCardExtensionState
> {

  /*   public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  } */

  public get data(): IPrimaryTextCardParameters {
    const { countryInfo, flag } = this.state;


    let cardData =  CARDDATA_TEMPLATE;
    if (countryInfo &&  countryInfo.length > 0 ){
      const { cases, time, country } = countryInfo![0];


       cardData =  cardData.replace("{0}",flag );
       cardData =  cardData.replace("{1}", cases?.active?.toLocaleString() ?? 'N/A');
       cardData =  cardData.replace("{2}", Number(cases?.new)?.toLocaleString() ?? 'N/A');
        cardData =  cardData.replace("{3}", format(parseISO(time), "PPp"));
       cardData =  cardData.replace("{4}", country.toUpperCase());
    }

    return {
      primaryText: (!this.properties.country || !this.properties.countryInfo) ?  "Select Contry" : "",
      description: ( !this.properties.country || !this.properties.countryInfo) ? "Country not defined" :  cardData,
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
