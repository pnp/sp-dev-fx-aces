import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'BookspaceAdaptiveCardExtensionStrings';
import { IBookspaceAdaptiveCardExtensionProps, IBookspaceAdaptiveCardExtensionState } from '../BookspaceAdaptiveCardExtension';
import { IChoiceWithLabel, IBookSpaceDetails } from '../../bookspace/models/bookspace-models';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  tabOne: string;
  tabTwo: string;
  arrowIcon: any;
  editIcon: any;
  cancelIcon: any;
  amenityChoiceWithLabel: IChoiceWithLabel;
  buildingChoiceWithLabel: IChoiceWithLabel;
  availableSpacesText: string;
  asOfText: string;
  amenityText: string;
  buildingText: string;
  dateText: string;
  fromText: string;
  toText: string;
  allDayText: string;
  searchText: string;
  bookText: string;
  reservationDetailsText: string;
  modifyText: string;
  cancelReservationText: string;
  confirmCancellationText: string;
  timeText: string;
  allBookspacesData: any;
  reservedSpacesArray: IBookSpaceDetails[];
  availableSpacesArray: IBookSpaceDetails[];
  availableBookspacesCount: number;
}

export class QuickView extends BaseAdaptiveCardView<
  IBookspaceAdaptiveCardExtensionProps,
  IBookspaceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    var amenity: IChoiceWithLabel = {
      "label": "Aminity",
      "choices": [{ "choice": "All", "value": "1" }, { "choice": "Auditorium", "value": "2" }, { "choice": "Library", "value": "3" }]
    };

    var building: IChoiceWithLabel = {
      "label": "Building",
      "choices": [{ "choice": "Hub dining", "value": "1" }, { "choice": "Allen Library", "value": "2" }, { "choice": "Knane hall", "value": "3" }]
    };

    var bookspaceJsonData: any = require('../../bookspace/models/bookspace-sample-json-data.json');
    var arrowIcon: any = require('../assets/Shape.png');
    var editIcon: any = require('../assets/EditIcon.png');
    var cancelIcon: any = require('../assets/CancelIcon.png');
    var reservedSpacesArray: IBookSpaceDetails[] = bookspaceJsonData.reservedSpacesData as IBookSpaceDetails[];
    var availableSpacesArray: IBookSpaceDetails[] = bookspaceJsonData.availableSpacesData as IBookSpaceDetails[];
    var modifiedReservedSpacesArray: IBookSpaceDetails[] = reservedSpacesArray.map((item, index) => {
      item.arrowIconButtonImage = require('../assets/Shape.png');
      return item;
    });

    var availableBookspacesCount: number = bookspaceJsonData.availableSpacesData.length;

    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      tabOne: strings.TabOne,
      tabTwo: strings.TabTwo,
      amenityChoiceWithLabel: amenity,
      buildingChoiceWithLabel: building,
      arrowIcon: arrowIcon,
      editIcon: editIcon,
      cancelIcon: cancelIcon,
      availableSpacesText: strings.AvailableSpacesText,
      asOfText: strings.AsOfText,
      amenityText: strings.AmenityText,
      buildingText: strings.BuildingText,
      dateText: strings.DateText,
      fromText: strings.FromText,
      toText: strings.ToText,
      allDayText: strings.AllDayText,
      searchText: strings.SearchText,
      bookText: strings.BookText,
      reservationDetailsText: strings.ReservationDetailsText,
      modifyText: strings.ModifyText,
      cancelReservationText: strings.CancelReservationText,
      confirmCancellationText: strings.ConfirmCancellationText,
      timeText: strings.TimeText,
      allBookspacesData: bookspaceJsonData,
      reservedSpacesArray: modifiedReservedSpacesArray,
      availableSpacesArray: availableSpacesArray,
      availableBookspacesCount: availableBookspacesCount,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}