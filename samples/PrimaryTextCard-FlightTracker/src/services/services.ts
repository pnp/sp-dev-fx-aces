import axios from 'axios';
import { format } from 'date-fns';

import {
  RAPID_API_AERODATABOX_FLIGHT_DETAILS_ENDPOINT,
  RAPID_API_HOST_AERODATABOX,
  RAPID_API_KEY_AERODATABOX,
} from '../constants/constants';
import { IFlightInformation } from '../models';

export const getFlightDetails = async (flightNumer:string): Promise<IFlightInformation> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  if (!flightNumer) { return undefined}
    const axiosOptions = {
    method: "GET",
    url: `${RAPID_API_AERODATABOX_FLIGHT_DETAILS_ENDPOINT}${flightNumer}/${today}`,
    params: {withAircraftImage: 'true', withLocation: 'true'},
    headers: {
      "X-RapidAPI-Key": `${RAPID_API_KEY_AERODATABOX}`,
      "X-RapidAPI-Host": `${RAPID_API_HOST_AERODATABOX}`,
    },
  };

  try {
    const response = await axios.request(axiosOptions);
    return   response?.data[0] as IFlightInformation || undefined;

  } catch (error) {
    if (DEBUG) {
      console.log("[getFlightDetails] error", error);
      throw error;
    }
  }
};
