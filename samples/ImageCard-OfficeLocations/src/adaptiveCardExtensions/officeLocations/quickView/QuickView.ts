import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Icons, MapsSource, Office, OfficeLocationMap } from '../../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { isEmpty, findIndex } from '@microsoft/sp-lodash-subset';
import { getOfficeLocationWeatherFromAPI, getSP, PLACEHOLDER_IMAGE_URL } from '../../../officelocation.service';

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
    const { name, mapImageLink, latitude, longitude } = office;

    let officeLocationMap: OfficeLocationMap = {
      imageUrl: isEmpty(mapImageLink) ? PLACEHOLDER_IMAGE_URL : mapImageLink,
      imageAlt: `${name} Office Location`,
      directionUrl: '#'
    };

    if (isEmpty(latitude) || isEmpty(longitude)) {
      return officeLocationMap;
    }

    //Show directions with Bing maps to maintain consistency with the "Open in Maps" button as that button shows the Bing maps app by default
    officeLocationMap.directionUrl = `https://www.bing.com/maps?rtp=~pos.${latitude}_${longitude}&rtop=0~1~0&lvl=15&toWww=1`;

    if (!showMapsInQuickView) {
      return officeLocationMap;
    }

    switch (mapsSource) {
      case MapsSource.Bing:
        if (useMapsAPI) {
          officeLocationMap.imageUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${latitude}%2C${longitude}/15?mapSize=400,240&format=png&pushpin=${latitude},${longitude};46;&key=${bingMapsApiKey}`;
        }
        break;
      case MapsSource.Google:
        if (useMapsAPI) {
          officeLocationMap.imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x240&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${googleMapsApiKey}`;
        }
        officeLocationMap.directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        break;
      default:
        break;
    }
    return officeLocationMap;
  }

  //* Polling functionality as done in https://github.com/pnp/spfx-reference-scenarios/blob/main/samples/ace-chat/chat-spfx/src/adaptiveCardExtensions/teamsChat/messages.ts#L136
  private getTime(officeTimeZone: string, callback: (time: string) => void, pollingInterval = 60000): () => void {

    let timeout: number;
    const seconds = (new Date()).getSeconds();
    const getOfficeLocalTime = async () => {
      
      //Calculate the time to wait before the next poll
      pollingInterval = this.properties.pollingTimeForFirstTime ? 60000 - (seconds * 1000) : 60000;
      console.log("pollingInterval", pollingInterval);

      if (this.properties.pollingTimeForFirstTime) {
        this.properties.pollingTimeForFirstTime = false;
      }
      
      const time = await this.getOfficeLocalTime(officeTimeZone);
      callback(time);
      timeout = setTimeout(getOfficeLocalTime, pollingInterval);
    };
    getOfficeLocalTime();

    //* This will be assigned to cancelPollingForTime
    return () => clearTimeout(timeout);
  }

  private async getOfficeLocalTime(officeTimeZone: string): Promise<string> {

    const luxon = await import(
      /* webpackChunkName: 'luxon' */
      'luxon'
    );
    const { DateTime } = luxon;

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

  private getOfficesWithLimitedProps(): Partial<Office>[] {
    return this.state.offices.map(office => ({ uniqueId: office.uniqueId, address: office.address }));
  }

  public get title(): string {
    return this.properties.showQuickViewAsList ? "Office details" : this.properties.title;
  }

  public get data(): IQuickViewData {

    const { offices, searchText, filteredOffices, currentOfficeIndex } = this.state;
    const {
      title, showQuickViewAsList, showSearch, showMapsInQuickView, showTime,
      showWeather, getWeatherFromList, weatherList, openWeatherMapApiKey, loadingImage, fuse,
      pollingForTimeStarted
    } = this.properties;


    let dataToReturn: IQuickViewData = {
      title,
      minHeight: showMapsInQuickView ? showWeather ? '570px' : '460px' : 'auto',
      office: null,
      icons: this.ICONS,
      showSearch: showQuickViewAsList ? false : showSearch && offices.length > 1,
      showClearSearch: !isEmpty(searchText),
      searchText,
      showOffices: filteredOffices.length > 0,
      showNavigationButtons: filteredOffices.length > 1,
      showTime,
      showWeather,
      loadingImage: isEmpty(loadingImage) ? this.loadingImage : loadingImage,
      showMapsInQuickView: false,
      showOpenMapsButton: false
    };

    try {

      //Get the office in the state using the correct index 
      //(when in search, filtered offices will have a different index than the original offices) 
      const filteredOffice: Partial<Office> = filteredOffices[currentOfficeIndex];
      const filteredOfficeIndex = !isEmpty(searchText) ? findIndex(offices, (o: Office) => o.uniqueId === filteredOffice.uniqueId) : currentOfficeIndex;
      const office: Office = offices[filteredOfficeIndex];

      if (office) {

        const { name, timeZone, gotMap, gotWeather, latitude, longitude } = office;

        //* check if office already has the map data
        //* if not, get it using the static image URLs
        if (!gotMap) {
          office.locationMap = this.getOfficeLocationMapDetails(office);
          office.gotMap = true;

          //update the fuse collection since the data in the state "offices" has changed.
          //This is because when fuse searches the data it should use the updated data
          //if not it uses the initial data (onInit - line 171) in which gotMap will be false for the office.
          //Can do this before returing IQuickViewData, but that happens every time irrespective of whether the offices in the state was updated
          if (showSearch) {
            fuse.setCollection(offices);
          }
        }


        if (showTime && !isEmpty(timeZone)) {
          
          if (!pollingForTimeStarted) {
            this.properties.pollingForTimeStarted = true;
            this.properties.cancelPollingForTime = this.getTime(
              timeZone,
              (time: string) => {
                office.time = time;
                console.log("time", time);
                this.setState();
              }
            );

          }
        }

        //* check if office already has the weather data
        //* if not, get it from the API or from the list

        if (showWeather && !gotWeather) {
          setTimeout(async () => {

            if (getWeatherFromList) {
              const sp = getSP(this.context);
              office.weather = await sp.web.getOfficeLocationWeather(name, weatherList);
            } else {
              office.weather = await getOfficeLocationWeatherFromAPI(this.context.httpClient, openWeatherMapApiKey, latitude, longitude);
            }

            //* set the flag to true so we don't get the weather again
            office.gotWeather = true;

            //* update the fuse collection since the data in the state "offices" has changed.
            //This is because when fuse searches the data it should use the updated data
            //if not it uses the initial data (onInit - line 170) in which gotWeather will be false for the office.
            //Can do this before returing IQuickViewData, but that happens every time irrespective of whether the offices in the state was updated
            if (showSearch) {
              fuse.setCollection(offices);
            }

            //* re-render as the offices data in the state has been updated after the asyncronous operation
            this.setState();

          }, 500);
        }

        dataToReturn = {
          ...dataToReturn,
          office,
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

    const { filteredOffices, currentOfficeIndex } = this.state;

    let totalNumberOfOffices: number = filteredOffices.length;

    if ((<ISubmitActionArguments>action).type === 'Submit') {
      const submitAction = <ISubmitActionArguments>action;
      const { id, searchText } = submitAction.data;

      switch (id) {
        case 'previous':
          this.properties.stopPollingForTime();
          let prevOfficeIndex: number = currentOfficeIndex - 1;
          prevOfficeIndex = (prevOfficeIndex < 0) ? (totalNumberOfOffices - 1) : prevOfficeIndex;
          this.setState({ currentOfficeIndex: prevOfficeIndex });
          break;

        case 'next':
          this.properties.stopPollingForTime();
          let nextOfficeIndex: number = currentOfficeIndex + 1;
          nextOfficeIndex = (nextOfficeIndex < totalNumberOfOffices) ? nextOfficeIndex : 0;
          this.setState({ currentOfficeIndex: nextOfficeIndex });
          break;

        case 'search':
          this.properties.stopPollingForTime();
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
          this.properties.stopPollingForTime();
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