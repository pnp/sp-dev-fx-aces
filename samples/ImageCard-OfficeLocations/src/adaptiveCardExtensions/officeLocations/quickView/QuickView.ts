import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments, IActionErrorArguments, DeviceContext } from '@microsoft/sp-adaptive-card-extension-base';
import { ITextInput } from 'adaptivecards/lib/schema';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { Icons, MapsSource, Office, OfficeLocationMap } from '../../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { isEmpty, findIndex } from '@microsoft/sp-lodash-subset';
import { getOfficeLocationWeatherFromAPI, getOfficeLocationWeatherFromList, PLACEHOLDER_IMAGE_URL } from '../../../officelocation.service';
import { CLEAR_ICON, NEXT_ICON, PREVIOUS_ICON, SEARCH_ICON, TIME_ICON } from '../../../icons';


export interface IQuickViewData {
  title: string;
  icons: Icons;
  office: Office;
  showSearch: boolean;
  showClearSearch: boolean;
  searchText: string;
  showOffices: boolean;
  showNavigationButtons: boolean;
  showTime: boolean;
  showWeather: boolean;
  loadingImage: string;
  showMapsInQuickView: boolean;
  showOpenMapsButton: boolean;
}


export class QuickView extends BaseAdaptiveCardView<
  IOfficeLocationsAdaptiveCardExtensionProps,
  IOfficeLocationsAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  private ICONS: Icons = {
    searchIcon: SEARCH_ICON,
    previousIcon: PREVIOUS_ICON,
    nextIcon: NEXT_ICON,
    clearIcon: CLEAR_ICON,
    timeIcon: TIME_ICON
  };
  private loadingImage: string = require('../assets/loading.gif');

  private getOfficeLocationMapDetails(office: Office): OfficeLocationMap {
    let officeLocationMap: OfficeLocationMap = {
      imageUrl: isEmpty(office.mapImageLink) ? PLACEHOLDER_IMAGE_URL : office.mapImageLink,
      imageAlt: `${office.name} Office Location`,
      directionUrl: '#'
    };

    if (isEmpty(office.latitude) || isEmpty(office.longitude)) {
      return officeLocationMap;
    }

    //Show directions with Bing maps to maintain consistency with the "Open in Maps" button as that button shows the Bing maps app by default
    officeLocationMap.directionUrl = `https://www.bing.com/maps?rtp=~pos.${office.latitude}_${office.longitude}&rtop=0~1~0&lvl=15&toWww=1`;

    if (!this.properties.showMapsInQuickView) {
      return officeLocationMap;
    }

    switch (this.properties.mapsSource) {
      case MapsSource.Bing:
        if (this.properties.useMapsAPI) {
          officeLocationMap.imageUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${office.latitude}%2C${office.longitude}/15?mapSize=400,240&format=png&pushpin=${office.latitude},${office.longitude};46;&key=${this.properties.bingMapsApiKey}`;
        }
        break;
      case MapsSource.Google:
        if (this.properties.useMapsAPI) {
          officeLocationMap.imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${office.latitude},${office.longitude}&zoom=15&size=400x240&maptype=roadmap&markers=color:red%7C${office.latitude},${office.longitude}&key=${this.properties.googleMapsApiKey}`;
        }
        officeLocationMap.directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`;
        break;
      default:
        break;
    }
    return officeLocationMap;
  }

  public get title(): string {
    return this.properties.showQuickViewAsList ? "Office details" : this.properties.title;
  }

  public get data(): IQuickViewData {

    const { offices, searchText, filteredOffices } = this.state;
    const { title, showQuickViewAsList, showSearch, showMapsInQuickView, showTime, showWeather, loadingImage, fuse } = this.properties;

    let dataToReturn: IQuickViewData = {
      title,
      office: null,
      icons: this.ICONS,
      showSearch,
      showClearSearch: !isEmpty(searchText),
      searchText,
      showOffices: false,
      showNavigationButtons: false,
      showTime,
      showWeather,
      loadingImage: isEmpty(loadingImage) ? this.loadingImage : loadingImage,
      showMapsInQuickView: false,
      showOpenMapsButton: false
    };

    try {

      const office: Office = filteredOffices[this.state.currentOfficeIndex];

      if (office) {

        const { gotMap, gotWeather } = office;

        if (!gotMap) {
          office.locationMap = this.getOfficeLocationMapDetails(office);
          office.gotMap = true;
        }

        office.time = showTime && !isEmpty(office.timeZone) ? `🕙 ${new Date().toLocaleString('en-GB', { timeZone: office.timeZone, hour12: true, hour: '2-digit', minute: '2-digit', weekday: 'short' })}` : '';

        //check if office already has the weather data
        //if not, get it from the API or from the list
        
        if (this.properties.showWeather && !gotWeather) {
          setTimeout(async () => {
            office.weather = this.properties.getWeatherFromList
              ? await getOfficeLocationWeatherFromList(office.name, this.properties.weatherList)
              : await getOfficeLocationWeatherFromAPI(this.context.httpClient, this.properties.openWeatherMapApiKey, office.latitude, office.longitude);

            //set the flag to true so we don't get the weather again
            office.gotWeather = true;

            //Update the office in the state using the correct index 
            //(filtered offices will have a different index than the original offices) 
            const requiredIndex = findIndex(this.state.offices, (o: Office) => o.uniqueId === office.uniqueId);
            offices[requiredIndex] = office;
            this.setState({ offices });

            //update the fuse collection
            fuse.setCollection(this.state.offices);
          }, 500);
        }

        dataToReturn = {
          ...dataToReturn,
          office,
          showSearch: showQuickViewAsList ? false : this.context.deviceContext === 'Mobile' ? false : showSearch && offices.length > 1, //Don't show search on mobile as there is an issue with getting data - https://github.com/SharePoint/sp-dev-docs/issues/7671
          showOffices: filteredOffices.length > 0,
          showNavigationButtons: showQuickViewAsList ? false : filteredOffices.length > 1,
          showTime: showTime && !isEmpty(office.time),
          showMapsInQuickView: showMapsInQuickView && !isEmpty(office.locationMap),
          showOpenMapsButton: this.context.deviceContext === 'WebView' && !showMapsInQuickView && !isEmpty(office.latitude) && !isEmpty(office.longitude)
        };
      }
    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${error}`, LogLevel.Error);
    }

    return dataToReturn;
  }


  public async onAction(action: IActionArguments): Promise<void> {

    const { offices, filteredOffices, currentOfficeIndex } = this.state;

    let totalNumberOfOffices: number = filteredOffices.length;

    if ((<ISubmitActionArguments>action).type === 'Submit') {
      const submitAction = <ISubmitActionArguments>action;
      const { id, searchText } = submitAction.data;

      switch (id) {
        case 'previous':
          let prevOfficeIndex: number = currentOfficeIndex - 1;
          prevOfficeIndex = (prevOfficeIndex < 0) ? (totalNumberOfOffices - 1) : prevOfficeIndex;
          this.setState({ currentOfficeIndex: prevOfficeIndex });
          break;

        case 'next':
          let nextOfficeIndex: number = currentOfficeIndex + 1;
          nextOfficeIndex = (nextOfficeIndex < totalNumberOfOffices) ? nextOfficeIndex : 0;
          this.setState({ currentOfficeIndex: nextOfficeIndex });
          break;

        case 'Search':
          let searchTextEntered = isEmpty(searchText) ? "" : searchText;
          this.setState({
            searchText: searchTextEntered,
            currentOfficeIndex: 0,
            filteredOffices: isEmpty(searchText) ? offices : this.properties.fuse.search(searchText)?.map(o => o.item)
          });
          break;

        case 'Clear':
          this.setState({
            searchText: "",
            currentOfficeIndex: 0,
            filteredOffices: offices
          });
          break;

        default:
          break;
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}