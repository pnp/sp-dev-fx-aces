import { IPropertyPaneChoiceGroupOption, IPropertyPaneConfiguration, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { DataSource, MapsSource } from '../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps } from './OfficeLocationsAdaptiveCardExtension';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';


export class OfficeLocationsPropertyPane {

  private enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => isNaN(Number(+k))) as K[];
  }

  private getDataSourceOptions(): IPropertyPaneChoiceGroupOption[] {
    const options: IPropertyPaneChoiceGroupOption[] = [];
    for (const value of this.enumKeys(DataSource)) {
      options.push({
        key: DataSource[value],
        text: value
      });
    }
    return options;
  }

  private getMapsSourceOptions(): IPropertyPaneChoiceGroupOption[] {
    const options: IPropertyPaneChoiceGroupOption[] = [];
    for (const value of this.enumKeys(MapsSource)) {
      options.push({
        key: MapsSource[value],
        text: value
      });
    }
    return options;
  }

  public getPropertyPaneConfiguration(
    properties: IOfficeLocationsAdaptiveCardExtensionProps,
    context: any,
    onPropertyPaneFieldChanged: () => void): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "" },
          groups: [
            {
              groupName: "Basic properties",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('mainImage', {
                  label: "Image to show on the card"
                }),
                PropertyPaneTextField('loadingImage', {
                  label: "Loading gif",
                  description: "This gif will be shown on the main card and while loading weather data. If not specified, the default loading gif will be used."
                }),
                PropertyPaneToggle('showQuickViewAsList', {
                  label: 'Show quick view as list',
                  onText: 'Yes',
                  offText: 'No'
                })
              ]
            },
            {
              groupName: "Properties related to the data source",
              groupFields: [
                PropertyPaneChoiceGroup('dataSource', {
                  label: "Data Source",
                  options: this.getDataSourceOptions()
                }),
                PropertyFieldCollectionData("offices", {
                  key: "offices",
                  label: "Offices data",
                  panelHeader: "Offices data",
                  manageBtnLabel: "Manage data of offices",
                  value: properties.offices,
                  fields: [
                    {
                      id: "name",
                      title: "Office name",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "address",
                      title: "Office address",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "latitude",
                      title: "Latitude",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "longitude",
                      title: "Longitude",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "mapImageLink",
                      title: "Map Image Link",
                      defaultValue: "https://via.placeholder.com/400x240?text=Map%20unavailable",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "timeZoneId",
                      title: "Time zone",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "pageUrl",
                      title: "Page URL",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "managerEmailAddress",
                      title: "Manager email address",
                      type: CustomCollectionFieldType.string
                    }
                  ],
                  disabled: properties.dataSource !== DataSource.Local
                }),
                PropertyPaneTextField('officesTermSetId', {
                  label: "ID of the term set containing the offices",
                  disabled: properties.dataSource !== DataSource.Taxonomy
                }),
                PropertyFieldListPicker('list', {
                  label: 'Select the list conatanining data of offices',
                  selectedList: properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: properties.dataSource !== DataSource.List,
                  onPropertyChange: onPropertyPaneFieldChanged,
                  properties: properties,
                  context: context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  listsToExclude: ["Site Assets", "Site Pages", "Style Library", "Form Templates", "Documents", "Events"],
                  key: 'listPickerFieldId'
                }),
                PropertyPaneToggle('showSearch', {
                  label: 'Show search box',
                  onText: 'Yes',
                  offText: 'No',
                  disabled: properties.showQuickViewAsList
                }),
              ]
            },
            {
              groupName: "Properties related to maps",
              groupFields: [
                PropertyPaneToggle('showMapsInQuickView', {
                  label: 'Show maps in quick view',
                  onText: 'Yes',
                  offText: 'No (Show open maps button instead)'
                }),
                PropertyPaneDropdown('mapsSource', {
                  label: "Maps source",
                  options: this.getMapsSourceOptions(),
                  disabled: !properties.showMapsInQuickView
                }),
                PropertyPaneToggle('useMapsAPI', {
                  label: 'Use maps API for showing the map',
                  checked: !properties.showMapsInQuickView ? false : properties.useMapsAPI,
                  disabled: !properties.showMapsInQuickView && !isEmpty(properties.mapsSource),
                  onText: 'Yes',
                  offText: 'No (Use mapImageLink property instead)'
                }),
                PropertyPaneTextField('bingMapsApiKey', {
                  label: "Bing maps API Key",
                  disabled: !properties.showMapsInQuickView || !properties.useMapsAPI || properties.mapsSource !== MapsSource.Bing,
                  description: properties.bingMapsApiKey === "AobmrKIjQInHa8zf5IjtCu3zVgIZFewRhY9M8NUzpYfvMdO2RKDO2eKI6uRFrP6b" ? "This is the key used by Microsoft for maps functionality. You can use a different one if needed." : ""
                }),
                PropertyPaneTextField('googleMapsApiKey', {
                  label: "Google maps API Key",
                  disabled: !properties.showMapsInQuickView || !properties.useMapsAPI || properties.mapsSource !== MapsSource.Google
                })
              ]
            },
            {
              groupName: "Properties related to weather and time",
              groupFields: [
                PropertyPaneToggle('showTime', {
                  label: 'Show local time',
                  onText: 'Yes',
                  offText: 'No'
                }),
                PropertyPaneToggle('showTimeUsingTemporal', {
                  label: 'Use Temporal API',
                  onText: 'Yes',
                  offText: 'No (use luxon)',
                  disabled: !properties.showTime
                }),
                PropertyPaneToggle('showWeather', {
                  label: 'Show local weather',
                  onText: 'Yes',
                  offText: 'No'
                }),
                PropertyPaneToggle('getWeatherFromList', {
                  label: 'Get weather from list',
                  disabled: !properties.showWeather,
                  onText: 'Yes',
                  offText: 'No (Use Open weather API instead)'
                }),
                PropertyFieldListPicker('weatherList', {
                  label: 'Select the list conatanining data of weather',
                  selectedList: properties.weatherList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: !properties.showWeather || !properties.getWeatherFromList,
                  onPropertyChange: onPropertyPaneFieldChanged,
                  properties: properties,
                  context: context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  listsToExclude: ["Site Assets", "Site Pages", "Style Library", "Form Templates", "Documents", "Events"],
                  key: 'weatherListId'
                }),
                PropertyPaneTextField('openWeatherMapApiKey', {
                  label: "Open weather map API Key",
                  disabled: !properties.showWeather || properties.getWeatherFromList
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
