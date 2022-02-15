import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { MapsSource, Office, OfficeLocationMap } from '../../../types';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState } from '../OfficeLocationsAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { getOfficeLocationWeatherFromAPI, getOfficeLocationWeatherFromList, PLACEHOLDER_IMAGE_URL } from '../../../officelocation.service';

/* interface IOfficeLocationMap {
  imageUrl: string;
  imageAlt: string;
  directionUrl: string;
  directionVisible: boolean;
} */

export interface IQuickViewData {
  subTitle: string;
  title: string;
  office: Office;
  // officeLocationMap: IOfficeLocationMap;
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
    let dataToReturn: IQuickViewData = null;
    try {
      const { offices } = this.state;
      const office: Office = this.state.offices[this.state.currentOfficeIndex];
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
          subTitle: office.name,
          title: this.properties.title,
          office: office,
          showWeather: this.properties.showWeather && !isEmpty(office.weather),
          showMaps: this.properties.showMaps && !isEmpty(office.locationMap)
        };
      }
    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${error}`, LogLevel.Error);
    }
    return dataToReturn;
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === 'Submit') {
      const { id, newIndex } = action.data;
      if (id === 'previous') {
        let newOfficeIndex: number = this.state.currentOfficeIndex - 1;
        newOfficeIndex = (newOfficeIndex < 0) ? (this.state.offices.length - 1) : newOfficeIndex;
        this.setState({ currentOfficeIndex: newOfficeIndex });
      } else if (id === 'next') {
        let newOfficeIndex: number = this.state.currentOfficeIndex + 1;
        newOfficeIndex = (newOfficeIndex < this.state.offices.length) ? newOfficeIndex : 0;
        this.setState({ currentOfficeIndex: newOfficeIndex });
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}