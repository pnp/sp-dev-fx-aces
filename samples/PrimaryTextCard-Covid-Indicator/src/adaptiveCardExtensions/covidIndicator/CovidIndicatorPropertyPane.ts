import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  IPropertyPaneField,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import * as strings from "CovidIndicatorAdaptiveCardExtensionStrings";
import { PropertyFieldSearch } from "@pnp/spfx-property-controls/lib/PropertyFieldSearch";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { ICovidIndicatorAdaptiveCardExtensionProps } from "./CovidIndicatorAdaptiveCardExtension";
import { HttpClient, IHttpClientOptions, HttpClientResponse } from "@microsoft/sp-http";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { IAPIResults } from "../../models/IAPIResults";
export class CovidIndicatorPropertyPane {
  private context: AdaptiveCardExtensionContext = undefined;
  private properties: ICovidIndicatorAdaptiveCardExtensionProps = undefined;
  private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;
  private _groupsfields: IPropertyPaneField<any>[] = [];
  private _countries: IPropertyPaneDropdownOption[] = [];
  private httpClient: HttpClient;
  constructor(
    context: AdaptiveCardExtensionContext,
    properties: ICovidIndicatorAdaptiveCardExtensionProps,
    onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>
  ) {
    this.context = context;
    this.properties = properties;
    this.context = context;
    this.onPropertyPaneFieldChanged = onPropertyPaneFieldChanged;
  }

  private _onGetErrorMessage = async (value) => {
    if (!value) {
      return "Country is invalid";
    }
    return;
  }

  private _getGroupFields = async () => {
    this._groupsfields = [
      PropertyPaneTextField("title", {
        label: strings.TitleFieldLabel,
      }),
      PropertyPaneTextField("country", {
        label: strings.CountryFieldLabel,
        onGetErrorMessage: this._onGetErrorMessage,
        deferredValidationTime: 1500,
      }),
    ];
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this._getGroupFields();
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: this._groupsfields,
            },
          ],
        },
      ],
    };
  }
}
