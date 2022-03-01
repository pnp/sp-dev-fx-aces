import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments, IActionErrorArguments, DeviceContext } from '@microsoft/sp-adaptive-card-extension-base';
import { ITextInput } from 'adaptivecards/lib/schema';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { Icons, MapsSource, Office, OfficeLocationMap } from '../../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { isEmpty, findIndex } from '@microsoft/sp-lodash-subset';
import { getOfficeLocationWeatherFromAPI, getOfficeLocationWeatherFromList, PLACEHOLDER_IMAGE_URL } from '../../../officelocation.service';
import { DateTime } from 'luxon';
import { CLEAR_ICON, COPY_ICON, NEXT_ICON, PREVIOUS_ICON, SEARCH_ICON } from '../../../icons';


export interface IQuickViewData {
  title: string;
  minHeight: string;
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
    searchIcon: require('../assets/search.png'),
    previousIcon: require('../assets/previous.png'),
    nextIcon: require('../assets/next.png'),
    clearIcon: require('../assets/clear.png'),
    copyIcon: require('../assets/copy.png'),
    addressIcon: require('../assets/address.png')
  };
  private loadingImage: string = require('../assets/loading.gif');

  private getOfficeLocationMapDetails(office: Office): OfficeLocationMap {

    const { showMapsInQuickView, mapsSource, useMapsAPI, bingMapsApiKey, googleMapsApiKey } = this.properties;

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

    if (!showMapsInQuickView) {
      return officeLocationMap;
    }

    switch (mapsSource) {
      case MapsSource.Bing:
        if (useMapsAPI) {
          officeLocationMap.imageUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${office.latitude}%2C${office.longitude}/15?mapSize=400,240&format=png&pushpin=${office.latitude},${office.longitude};46;&key=${bingMapsApiKey}`;
        }
        break;
      case MapsSource.Google:
        if (useMapsAPI) {
          officeLocationMap.imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${office.latitude},${office.longitude}&zoom=15&size=400x240&maptype=roadmap&markers=color:red%7C${office.latitude},${office.longitude}&key=${googleMapsApiKey}`;
        }
        officeLocationMap.directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`;
        break;
      default:
        break;
    }
    return officeLocationMap;
  }

  private getOfficeLocalTime(officeTimeZone: string): string {

    const officeLocalDateTime = DateTime.local().setZone(officeTimeZone);
   
    if (!officeLocalDateTime.isValid) {
      return "";
    }

    const officeTime: string = `🕙 ${officeLocalDateTime.toLocaleString(DateTime.TIME_SIMPLE)}`;
    const offset: number = officeLocalDateTime.offset;

    if (offset === 0) {
      return `${officeTime} - Same time zone as you`;
    }

    const offsetHours: number = Math.abs(offset / 60 ^ 0);
    const offsetMinutes: number = Math.abs(offset % 60);
    const offsetHoursString: string = offsetHours > 0 ? `${offsetHours}h` : '';
    const offsetMinutesString: string = offsetMinutes > 0 ? `${offsetMinutes}m` : '';
    let offsetSuffix: string = `${offsetHoursString} ${offsetMinutesString} ${offset > 0 ? 'ahead of' : 'behind'} you`;
    return `${officeTime} - ${offsetSuffix}`;
  }

  public get title(): string {
    return this.properties.showQuickViewAsList ? "Office details" : this.properties.title;
  }

  public get data(): IQuickViewData {

    const { offices, searchText, filteredOffices } = this.state;
    const {
      title, showQuickViewAsList, showSearch, showMapsInQuickView, showTime,
      showWeather, getWeatherFromList, weatherList, openWeatherMapApiKey, loadingImage, fuse
    } = this.properties;


    let dataToReturn: IQuickViewData = {
      title,
      minHeight: showMapsInQuickView ? showWeather ? '578px' : '468px' : 'auto',
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

      //Get the office in the state using the correct index 
      //(when in search, filtered offices will have a different index than the original offices) 
      const filteredOffice: Partial<Office> = filteredOffices[this.state.currentOfficeIndex];
      const filteredOfficeIndex = !isEmpty(searchText) ? findIndex(offices, (o: Office) => o.uniqueId === filteredOffice.uniqueId) : this.state.currentOfficeIndex;
      const office: Office = offices[filteredOfficeIndex];
      
      if (office) {

        const { gotMap, gotWeather } = office;

        //check if office already has the map data
        //if not, get it using the static image URLs
        if (!gotMap) {
          office.locationMap = this.getOfficeLocationMapDetails(office);
          office.gotMap = true;

          //update the fuse collection since the data in the state "offices" has changed.
          //This is because when fuse searches the data it should use the updated data
          //if not it uses the initial data (onInit - line 167) in which gotMap will be false for the office.
          //Can do this before returing IQuickViewData, but that happens every time irrespective of whether the offices in the state was updated
          fuse.setCollection(offices);
        }


        if (showTime && !isEmpty(office.timeZone)) {
          office.time = this.getOfficeLocalTime(office.timeZone);

          //although the data in the state "offices" has changed,
          //there is no need to update the fuse collection because we are getting the time every time for each office when rendering
        }

        //check if office already has the weather data
        //if not, get it from the API or from the list

        if (showWeather && !gotWeather) {
          setTimeout(async () => {
            office.weather = getWeatherFromList
              ? await getOfficeLocationWeatherFromList(office.name, weatherList)
              : await getOfficeLocationWeatherFromAPI(this.context.httpClient, openWeatherMapApiKey, office.latitude, office.longitude);

            //set the flag to true so we don't get the weather again
            office.gotWeather = true;

            //update the fuse collection since the data in the state "offices" has changed.
            //This is because when fuse searches the data it should use the updated data
            //if not it uses the initial data (onInit - line 166) in which gotWeather will be false for the office.
            //Can do this before returing IQuickViewData, but that happens every time irrespective of whether the offices in the state was updated
            fuse.setCollection(offices);

            //re-render as the offices data in the state has been updated after the asyncronous operation
            this.setState();

          }, 500);
        }

        dataToReturn = {
          ...dataToReturn,
          office,
          showSearch: showQuickViewAsList ? false : showSearch && offices.length > 1,
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

  private getOfficesWithLimitedProps(): Partial<Office>[] {
    return this.state.offices.map(office => ({ uniqueId: office.uniqueId, address: office.address }));
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

        case 'search':
          let searchTextEntered = isEmpty(searchText) ? "" : searchText;
          this.setState({
            searchText: searchTextEntered,
            currentOfficeIndex: 0,
            filteredOffices:
              isEmpty(searchText) ?
                this.getOfficesWithLimitedProps() :
                this.properties.fuse.search(searchText)?.map(o => ({ uniqueId: o.item.uniqueId, address: o.item.address }))
          });
          break;

        case 'clear':
          this.setState({
            searchText: "",
            currentOfficeIndex: 0,
            filteredOffices: this.getOfficesWithLimitedProps()
          });
          break;

        case 'copy':
          navigator.clipboard.writeText(filteredOffices[currentOfficeIndex].address);
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