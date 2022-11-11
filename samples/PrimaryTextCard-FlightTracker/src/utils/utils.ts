/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  format,
  isSameDay,
  parseISO,
} from 'date-fns';

/* eslint-disable @typescript-eslint/no-var-requires */
import { PHOTO_AIRLINE_URL } from '../constants/constants';
import { IFlightInformation } from '../models';
import { IAirline } from '../models/IAirlines';
import { IFlightDetailsData } from '../models/IFlightDetailsData';

const airlinesList = require("../data/airlines.json");

export const statusColors = new Map<string, string>([
  ["Unknown", "default"],
  ["Expected", "default"],
  ["EnRoute", "default"],
  ["CheckIn", "accent"],
  ["Boarding", "accent"],
  ["GateClosed", "default"],
  ["Departed", "accent"],
  ["Delayed", "attention"],
  ["Approaching", "default"],
  ["Arrived", "good"],
  ["Canceled", "attention"],
  ["Diverted", "attention"],
  ["CanceledUncertain", "default"],
]);

export const getFlightStatusColor = (status: string): string => {
  return statusColors.get(status) || "default";
};

export const getAirlineByName = async (name: string): Promise<IAirline> => {
  try {
    if (name && airlinesList && airlinesList?.rows?.length > 0) {
      const airline = airlinesList.rows.find((airline: IAirline) =>
        airline.Name.toLowerCase().includes(name.toLowerCase())
      );
      let photo = "";
      if (airline?.Code) {
        photo = `${PHOTO_AIRLINE_URL}${airline.Code}.png`;
      }
      return { ...airline, Photo: photo };
    } else {
      return null;
    }
  } catch (error) {
    if (DEBUG) {
      console.log(["getAirlineByName"], error);
    }
    return null;
  }
};

export const getTimeFromDate = (date: string): string => {
  const today = new Date();
  try {
    if (date) {
      return isSameDay(parseISO(date), today) ? format(parseISO(date), "k:mm") : format(parseISO(date), "dd/MM, k:mm");
    } else {
      return "";
    }
  } catch (error) {
    if (DEBUG) {
      console.log(["getTimeFromDate"], error);
    }
    return "";
  }
};

export const getAirlineLogo = async (airlineName: string): Promise<string> => {
  try {
    if (airlineName) {
      const airline = await getAirlineByName(airlineName);
      return airline ? airline.Photo : undefined;
    } else {
      return undefined;
    }
  } catch (error) {
    if (DEBUG) {
      console.log(["getAirlineLogo"], error);
    }
    return undefined;
  }
};

const checkStatus = (status: string): string => {
  let newStatus = "";
  switch (status) {
    case "GateClosed":
      newStatus = "Closed";
      break;
    case "EnRoute":
      newStatus = "En Route";
      break;
    case "CanceledUncertain":
    case "Unknown":
      newStatus = "";
      break;
    default:
      newStatus = status;
      break;
  }
  return newStatus;
};

export const mapData = async (data: IFlightInformation, liveUpdatesON:boolean): Promise<IFlightDetailsData> => {
  const airlineLogo = await getAirlineLogo(data?.airline?.name);
  const flightDetailsData: IFlightDetailsData = {
    airlineName: data?.airline?.name ?? "N/A",
    airlineLogo: airlineLogo ?? "",
    flightNumber: data?.number,
    departureAirport: data?.departure?.airport?.name,
    departureAirportCode: data?.departure?.airport?.iata ?? "N/A",
    departureRealTime: data?.departure?.actualTimeLocal && data?.departure?.scheduledTimeLocal ? getTimeFromDate(data?.departure?.actualTimeLocal ?? data?.departure?.scheduledTimeLocal ) : "N/A",
    departureScheduleTime: data?.departure?.scheduledTimeLocal ? getTimeFromDate(data?.departure?.scheduledTimeLocal)   : "N/A",
    departureTerminal: data?.departure?.terminal ?? "N/A",
    arrivalAirport: data?.arrival?.airport?.name ?? "",
    arrivalAirportCode: data?.arrival?.airport?.iata ?? "N/A",
    arrivalRealTime: data?.arrival?.actualTimeLocal ? getTimeFromDate(data?.arrival?.actualTimeLocal) : "N/A",
    arrivalScheduleTime: data?.arrival?.scheduledTimeLocal ?  getTimeFromDate(data?.arrival?.scheduledTimeLocal) : "N/A",
    arrivalTerminal: data?.arrival?.terminal ?? "N/A",
    aircraft: data?.aircraft?.model ?? "N/A",
    aircraftImage: data?.aircraft?.image?.url ?? "",
    aircraftRegistration: data?.aircraft?.reg  ?? "N/A",
    aircraftModeS: data?.aircraft?.modeS ?? "N/A",
    flightStatus: checkStatus(data?.status),
    flightStatusColor: getFlightStatusColor(data?.status),
    title: data?.number,
    subTitle: data?.status,
    liveUpdatesON: liveUpdatesON,
  };
  return flightDetailsData;
};
