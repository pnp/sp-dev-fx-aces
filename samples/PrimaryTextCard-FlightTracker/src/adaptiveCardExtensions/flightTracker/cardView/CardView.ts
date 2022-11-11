import * as strings from 'FlightTrackerAdaptiveCardExtensionStrings';

import {
  BasePrimaryTextCardView,
  ICardButton,
  IExternalLinkCardAction,
  IPrimaryTextCardParameters,
  IQuickViewCardAction,
} from '@microsoft/sp-adaptive-card-extension-base';

import { EProcessStatus } from '../../../constants/EProcessStatus';
import {
  IFlightTrackerAdaptiveCardExtensionProps,
  IFlightTrackerAdaptiveCardExtensionState,
} from '../../../models';
import { QUICK_VIEW_REGISTRY_ID } from '../FlightTrackerAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<
  IFlightTrackerAdaptiveCardExtensionProps,
  IFlightTrackerAdaptiveCardExtensionState
> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const { processStatus } = this.state;
    if (processStatus !== EProcessStatus.SUCCESS) {
      return undefined;
    }
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: "QuickView",

          parameters: {
            view: QUICK_VIEW_REGISTRY_ID,
          },
        },
      },
    ];
  }

  protected renderMediumCard(): IPrimaryTextCardParameters {
    const { processStatus } = this.state;
    switch (processStatus) {
      case EProcessStatus.ERROR:
        return this.renderError();
      case EProcessStatus.LOADING:
        return this.renderIsLoading();
      case EProcessStatus.NO_FLIGHT_NUMBER:
        return this.renderNoFlightNumberDefined();
      case EProcessStatus.NO_FLIGHT_INFO:
        return this.renderNoFlightInfo();
      case EProcessStatus.SUCCESS:
        return this.renderMediumCardData();
    }
  }

  protected renderLargeCard(): IPrimaryTextCardParameters {
    const { processStatus } = this.state;
    switch (processStatus) {
      case EProcessStatus.ERROR:
        return this.renderError();
      case EProcessStatus.LOADING:
        return this.renderIsLoading();
      case EProcessStatus.NO_FLIGHT_NUMBER:
        return this.renderNoFlightNumberDefined();
      case EProcessStatus.NO_FLIGHT_INFO:
        return this.renderNoFlightInfo();
      case EProcessStatus.SUCCESS:
        return this.renderLargeCardData();
    }
  }

  protected renderError = (): IPrimaryTextCardParameters => {
    return {
      primaryText: strings.Error,
      description: strings.ErrorMessage,
    };
  };

  protected renderIsLoading = (): IPrimaryTextCardParameters => {
    return {
      primaryText: strings.loading,
      description: "",
    };
  };

  protected renderNoFlightNumberDefined = (): IPrimaryTextCardParameters => {
    return {
      primaryText: strings.ConfigureCard,
      description: strings.ConfigureCardDescription,
    };
  };

  protected renderNoFlightInfo = (): IPrimaryTextCardParameters => {
    return {
      primaryText: strings.NoFlightInformation,
      description: strings.NoFlightInformationDescription,
    };
  };

  protected renderMediumCardData(): IPrimaryTextCardParameters {
    const { mappedData } = this.state;

    return {
      iconProperty: mappedData?.airlineLogo,
      primaryText: `${mappedData?.flightStatus?.toUpperCase()}`,
      description: `**${mappedData?.departureAirportCode?.toUpperCase()}:** (${
        mappedData?.departureRealTime
      })\n\n **${mappedData?.arrivalAirportCode?.toUpperCase()}:** (${mappedData?.arrivalRealTime})`,
      title: `**${this.properties?.flightNumber}**`,
    };
  }

  protected renderLargeCardData(): IPrimaryTextCardParameters {
    const { mappedData } = this.state;
    return {
      iconProperty: mappedData?.airlineLogo,
      primaryText: `${mappedData?.flightStatus?.toUpperCase()}`,
      description: `${mappedData?.departureAirport} **(${mappedData?.departureAirportCode?.toUpperCase()}):** (${
        mappedData?.departureRealTime
      })\n\n  ${mappedData?.arrivalAirport} **(${mappedData?.arrivalAirportCode?.toUpperCase()}):** (${
        mappedData?.arrivalRealTime
      })`,
      title: `**${this.properties?.flightNumber}**`,
    };
  }

  public get data(): IPrimaryTextCardParameters {
    switch (this.cardSize) {
      case "Medium":
        return this.renderMediumCard();
      case "Large":
        return this.renderLargeCard();
      default:
        break;
    }
  }
  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return undefined;
  }
}
