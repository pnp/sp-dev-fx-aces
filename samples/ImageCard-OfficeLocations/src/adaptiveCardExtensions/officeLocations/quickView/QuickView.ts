import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { Icons, MapsSource, Office, OfficeLocationMap } from '../../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { getOfficeLocationWeatherFromAPI, getOfficeLocationWeatherFromList, PLACEHOLDER_IMAGE_URL } from '../../../officelocation.service';
import { CLEAR_ICON, NEXT_ICON, PREVIOUS_ICON, SEARCH_ICON } from '../../../icons';


export interface IQuickViewData {
  title: string;
  icons: Icons;
  office: Office;
  showSearch: boolean;
  searchText: string;
  showOffices: boolean;
  showNoResults: boolean;
  showWeather: boolean;
  showMaps: boolean;
}


export class QuickView extends BaseAdaptiveCardView<
  IOfficeLocationsAdaptiveCardExtensionProps,
  IOfficeLocationsAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";

  private getOfficeLocationMapDetails(office: Office): OfficeLocationMap {
    let officeLocationMap: OfficeLocationMap = {
      imageUrl: isEmpty(office.mapImageLink) ? PLACEHOLDER_IMAGE_URL : office.mapImageLink,
      imageAlt: `${office.name} Office Location`,
      directionUrl: '#',
      directionVisible: false
    };

    if (!this.properties.showMaps) {
      return officeLocationMap;
    }

    if (isEmpty(office.latitude) || isEmpty(office.longitude)) {
      return officeLocationMap;
    }

    switch (this.properties.mapsSource) {
      case MapsSource.Bing:
        if (this.properties.useMapsAPI) {
          officeLocationMap.imageUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${office.latitude}%2C${office.longitude}/15?mapSize=400,300&format=png&pushpin=${office.latitude},${office.longitude};46;&key=${this.properties.bingMapsApiKey}`;
        }
        officeLocationMap.directionUrl = `https://www.bing.com/maps?rtp=~pos.${office.latitude}_${office.longitude}&rtop=0~1~0&lvl=15&toWww=1`;
        officeLocationMap.directionVisible = true;
        break;
      case MapsSource.Google:
        if (this.properties.useMapsAPI) {
          officeLocationMap.imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${office.latitude},${office.longitude}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7C${office.latitude},${office.longitude}&key=${this.properties.googleMapsApiKey}`;
        }
        officeLocationMap.directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`;
        officeLocationMap.directionVisible = true;
        break;
      default:
        break;
    }
    return officeLocationMap;
  }

  public get data(): IQuickViewData {

    const { title, showSearch, showMaps, showTime, showWeather } = this.properties;

    let icons: Icons = {
      searchIcon: SEARCH_ICON,
      previousIcon: PREVIOUS_ICON,
      nextIcon: NEXT_ICON,
      clearIcon: CLEAR_ICON
    };

    let dataToReturn: IQuickViewData = {
      title,
      office: null,
      icons,
      showSearch,
      searchText: this.state.searchText,
      showOffices: false,
      showNoResults: true,
      showWeather: false,
      showMaps: false
    };

    try {
      const { offices, searchText } = this.state;
      let filteredOffices: Office[] = isEmpty(searchText) ? offices : offices.filter(o => o.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      const office: Office = filteredOffices[this.state.currentOfficeIndex];
      if (office) {

        if (this.properties.showMaps && !office.gotMap) {
          office.locationMap = this.getOfficeLocationMapDetails(office);
          office.gotMap = true;
        }

        if (this.properties.showWeather && !office.gotWeather) {
          setTimeout(async () => {
            office.weather = this.properties.getWeatherFromList
              ? await getOfficeLocationWeatherFromList(office.name, this.properties.weatherList)
              : await getOfficeLocationWeatherFromAPI(this.context.httpClient, this.properties.openWeatherMapApiKey, office.latitude, office.longitude);
            office.gotWeather = true;
            this.setState({ offices });
          }, 0);
        }

        office.time = this.properties.showTime && !isEmpty(office.timeZone) ? `(${new Date().toLocaleString('en-GB', { timeZone: office.timeZone, hour: '2-digit', minute: '2-digit' })})` : '';

        dataToReturn = {
          title,
          office,
          icons,
          showSearch,
          searchText,
          showOffices: filteredOffices.length > 0,
          showNoResults: filteredOffices.length === 0,
          showWeather: showWeather && !isEmpty(office.weather),
          showMaps: showMaps && !isEmpty(office.locationMap)
        };
      }
    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${error}`, LogLevel.Error);
    }
    return dataToReturn;
  }

  public async onAction(action: IActionArguments): Promise<void> {

    const { offices, searchText } = this.state;
    let totalNumberOfOffices: number = offices.length;

    if (action.type === 'Submit') {
      const { id } = action.data;

      if (!isEmpty(searchText) && (id === 'previous' || id === 'next')) {
        let filteredOffices: Office[] = offices.filter(o => o.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
        totalNumberOfOffices = filteredOffices.length;
      }

      if (id === 'previous') {
        let newOfficeIndex: number = this.state.currentOfficeIndex - 1;
        newOfficeIndex = (newOfficeIndex < 0) ? (totalNumberOfOffices - 1) : newOfficeIndex;
        this.setState({ currentOfficeIndex: newOfficeIndex });
      } else if (id === 'next') {
        let newOfficeIndex: number = this.state.currentOfficeIndex + 1;
        newOfficeIndex = (newOfficeIndex < totalNumberOfOffices) ? newOfficeIndex : 0;
        this.setState({ currentOfficeIndex: newOfficeIndex });
      } else if (id === 'Search') {
        let searchText = isEmpty(action.data.searchText) ? "" : action.data.searchText;
        this.setState({
          searchText,
          currentOfficeIndex: 0,
        });
      } else if (id === 'ClearSearch') {
        this.setState({
          searchText: "",
          currentOfficeIndex: 0,
        });
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}