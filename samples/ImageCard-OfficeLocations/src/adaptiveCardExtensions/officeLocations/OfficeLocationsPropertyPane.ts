import { IPropertyPaneChoiceGroupOption, IPropertyPaneConfiguration, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { DataSource, MapsSource } from '../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps } from './OfficeLocationsAdaptiveCardExtension';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { BaseComponentContext } from '@microsoft/sp-component-base';

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
                      defaultValue: "https://via.placeholder.com/400x300?text=Map%20unavailable",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "timeZone",
                      title: "Time zone",
                      type: CustomCollectionFieldType.string
                    }
                  ],
                  disabled: properties.dataSource !== DataSource.Local
                }),
                PropertyPaneToggle('useSiteCollectionTermStore', {
                  label: 'Use site collection term store',
                  disabled: properties.dataSource !== DataSource.Taxonomy,
                  onText: 'Yes',
                  offText: 'No (Use global term store instead)'
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
                  offText: 'No'
                }),
              ]
            },
            {
              groupName: "Properties related to maps",
              groupFields: [
                PropertyPaneToggle('showMapsInQuickView', {
                  label: 'Show maps in quick view',
                  onText: 'Yes',
                  offText: 'No'
                }),
                PropertyPaneDropdown('mapsSource', {
                  label: "Maps source",
                  options: this.getMapsSourceOptions(),
                  disabled: !properties.showMapsInQuickView
                }),
                PropertyPaneToggle('useMapsAPI', {
                  label: 'Use maps API for showing the map',
                  checked: !properties.showMapsInQuickView ? false : properties.useMapsAPI,
                  disabled: !properties.showMapsInQuickView,
                  onText: 'Yes',
                  offText: 'No (Use mapImageLink property instead)'
                }),
                PropertyPaneTextField('bingMapsApiKey', {
                  label: "Bing maps API Key",
                  disabled: !properties.useMapsAPI || properties.mapsSource !== MapsSource.Bing
                }),
                PropertyPaneTextField('googleMapsApiKey', {
                  label: "Google maps API Key",
                  disabled: !properties.useMapsAPI || properties.mapsSource !== MapsSource.Google
                })
              ]
            },
            {
              groupName: "Properties related to weather and time",
              groupFields: [
                PropertyPaneToggle('showTime', {
                  label: 'Show time',
                  onText: 'Yes',
                  offText: 'No'
                }),
                PropertyPaneToggle('showWeather', {
                  label: 'Show weather',
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
