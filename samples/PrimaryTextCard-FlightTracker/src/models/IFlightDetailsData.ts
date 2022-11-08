export interface IFlightDetailsData {
  subTitle: string;
  title: string;
  flightNumber: string;
  airlineLogo: string;
  airlineName: string;
  departureAirport: string;
  departureAirportCode: string;
  departureRealTime: string;
  departureScheduleTime: string;
  arrivalAirport: string;
  arrivalAirportCode: string;
  arrivalRealTime: string;
  arrivalScheduleTime: string;
  flightStatus: string;
  flightStatusColor: string;
  departureTerminal: string;
  arrivalTerminal: string;
  aircraft: string;
  aircraftImage: string;
  aircraftRegistration: string;
  aircraftModeS: string;
  liveUpdatesON?: boolean;
}
