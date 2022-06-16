import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneLabel } from '@microsoft/sp-property-pane';
import { PropertyFieldSearch } from '@pnp/spfx-property-controls/lib/PropertyFieldSearch';
import { PropertyFieldPassword } from '@pnp/spfx-property-controls/lib/PropertyFieldPassword';
import * as strings from 'WeatherAdaptiveCardExtensionStrings';
import { WeatherService } from '../../services/WeatherService';
import { IWeatherAdaptiveCardExtensionProps } from './WeatherAdaptiveCardExtension';

export class WeatherPropertyPane {
  private properties: IWeatherAdaptiveCardExtensionProps = undefined;
  private context: AdaptiveCardExtensionContext = undefined;
  private weatherService: WeatherService;
  private locationOptions: IPropertyPaneDropdownOption[] = [
    {
      key: 'Select location',
      text: 'Select location',
      index: 0
    }
  ];
  constructor(
    properties: IWeatherAdaptiveCardExtensionProps,
    context: AdaptiveCardExtensionContext,
    weatherService: WeatherService
  ) {
    this.context = context;
    this.properties = properties;
    this.weatherService = weatherService;
  }

  private async _onSearch(locationKeyword: string) {
    this.locationOptions = [
      {
        key: `Select location`,
        text: `Select ${locationKeyword} location`
      }
    ];
    const locationResult = await this.weatherService.GetLocationsResponse(locationKeyword, this.properties.bingMapsKey);
    if (locationResult && locationResult.resources) {
      locationResult.resources.map((x, i) => {
        const locationName = x.name;
        const locationDetails = locationName + ';' + x.point.coordinates[0] + ';' + x.point.coordinates[1];
        this.locationOptions.push({
          key: locationDetails,
          text: locationName,
          index: i
        });
      });
    }
    this.context.propertyPane.refresh();
    this.properties.selectedLocation = this.locationOptions[0].key.toString();
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('imageUrl', {
                  label: strings.ImageURLLabel
                }),
                PropertyFieldPassword("azureMapsKey", {
                  key: "azureMapsKey",
                  label: strings.AzureMapsKeyLabel,
                  value: this.properties.azureMapsKey
                }),
                PropertyFieldPassword("bingMapsKey", {
                  key: "bingMapsKey",
                  label: strings.BingMapsKeyLabel,
                  value: this.properties.bingMapsKey
                }),
                PropertyPaneLabel('locationLabel', {
                  text: strings.LocationLabel
                }),
                PropertyFieldSearch("searchValue", {
                  key: "search",
                  placeholder: this.properties.bingMapsKey ? strings.SearchLocationPlaceholder : strings.SearchLocationNoBingPlaceholder,
                  value: this.properties.searchValue,
                  onSearch: (locationKeyword) => this._onSearch(locationKeyword),
                  styles: { root: { margin: 10 } }
                }),
                PropertyPaneDropdown('selectedLocation', {
                  label: '',
                  selectedKey: this.properties.selectedLocation,
                  options: this.locationOptions,
                  disabled: this.properties.searchValue && this.properties.bingMapsKey ? false : true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
