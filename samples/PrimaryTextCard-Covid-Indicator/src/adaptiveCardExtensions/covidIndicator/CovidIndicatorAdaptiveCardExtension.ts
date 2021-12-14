import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseAdaptiveCardExtension, CardSize } from "@microsoft/sp-adaptive-card-extension-base";
import { CardView } from "../../cards/cardView/CardView";
import { QuickView } from "../../cards/quickView/QuickView";
import { CovidIndicatorPropertyPane } from "./CovidIndicatorPropertyPane";
import { IAPIResults } from "../../models/IAPIResults";
import { HttpClient, IHttpClientOptions, HttpClientResponse } from "@microsoft/sp-http";
import { isEmpty, find } from "@microsoft/sp-lodash-subset";
import { utils } from "../../util";

export interface ICovidIndicatorAdaptiveCardExtensionProps {
  title: string;
  country: string;
  countryInfo: IAPIResults[];
}

export interface ICovidIndicatorAdaptiveCardExtensionState {
  countryInfo: IAPIResults[];
  flag: string;
}

const CARD_VIEW_REGISTRY_ID: string = "CovidIndicator_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "CovidIndicator_QUICK_VIEW";

export default class CovidIndicatorAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICovidIndicatorAdaptiveCardExtensionProps,
  ICovidIndicatorAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CovidIndicatorPropertyPane | undefined;
  private flag: string = "";
  private timerId: number =0;
  private getFlag = utils().getFlag;
  public onInit(): Promise<void> {
    if (this.properties && this.properties?.countryInfo) {
      const countryData = this.properties?.countryInfo[0];
      this.flag = this.getFlag(countryData, "small");
      this.state = {
        countryInfo: this.properties.countryInfo,
        flag: this.flag,
      };
      this.setDataPooling(this.properties.country);
    } else {
      this.state = {
        countryInfo: undefined,
        flag: this.flag,
      };
    }


    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  private setDataPooling =   (newCountry:string) => {
    if (this.timerId || !newCountry ){
      console.log('clearpooling');
      clearInterval(this.timerId);
    }
    this.timerId  = setInterval( async ()=>{
        console.log('run', new Date());
          await this.getData(newCountry);
      },900000);
  }

  public get title(): string {
    return this.properties.title;
  }

  public get countryInfo(): IAPIResults[] {
    return this.properties.countryInfo;
  }

  public get country(): string {
    return this.properties.country;
  }

  public get cardSize(): CardSize {
    return "Medium";
  }

  protected get iconProperty(): string {
    return require("../../adaptiveCardExtensions/covidIndicator/assets/coronavirus.png");
  }

  private getData = async (value) => {
    const getURL = `https://covid-193.p.rapidapi.com/statistics?country=${value}`;
    const requestHeaders: Headers = new Headers();
    requestHeaders.append("x-rapidapi-host", "covid-193.p.rapidapi.com");
    requestHeaders.append("x-rapidapi-key", "a96bf6dd14mshaba3c61477da062p1a89f2jsn5190b7082e8e");
    const httpClientOptions: IHttpClientOptions = {
      headers: requestHeaders,
    };
    const response: HttpClientResponse = await this.context.httpClient.get(
      getURL,
      HttpClient.configurations.v1,
      httpClientOptions
    );
    const data = await response.json();

    if (isEmpty(data.response)) {
      this.properties.country = "";
      this.setState({ countryInfo: [], flag: "" });
    }else{
      this.properties.countryInfo = data.response;
      const countryData = this.properties.countryInfo[0];
      this.flag = this.getFlag(countryData, "small");
      this.setState({ countryInfo: data.response, flag: this.flag });
    }
  }

  protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if (propertyPath == "country" && oldValue !== newValue) {
      if (newValue) {

        await this.getData(newValue);
        this.setDataPooling(newValue);
      }
    }
    this.context.propertyPane.refresh();
    this.renderCard();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'CovidIndicator-property-pane'*/
      "./CovidIndicatorPropertyPane"
    ).then((component) => {
      this._deferredPropertyPane = new component.CovidIndicatorPropertyPane(
        this.context,
        this.properties,
        this.onPropertyPaneFieldChanged
      );
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
