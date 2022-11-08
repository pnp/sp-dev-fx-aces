export interface IFlightInformation {
  greatCircleDistance: GreatCircleDistance;
  departure: FlightInformation;
  arrival: FlightInformation;
  lastUpdatedUtc: string;
  number: string;
  status: string;
  codeshareStatus: string;
  isCargo: boolean;
  aircraft: Aircraft;
  airline: Airline;
}

interface Airline {
  name: string;
}

interface Aircraft {
  reg: string;
  modeS: string;
  model: string;
  image: Image;
}

interface Image {
  url: string;
  webUrl: string;
  author: string;
  title: string;
  description: string;
  license: string;
  htmlAttributions: string[];
}

interface FlightInformation {
  airport: Airport;
  scheduledTimeLocal: string;
  actualTimeLocal: string;
  scheduledTimeUtc: string;
  actualTimeUtc: string;
  terminal: string;
  quality: string[];
}

interface Airport {
  icao: string;
  iata: string;
  name: string;
  shortName: string;
  municipalityName: string;
  location: Location;
  countryCode: string;
}

interface Location {
  lat: number;
  lon: number;
}

interface GreatCircleDistance {
  meter: number;
  km: number;
  mile: number;
  nm: number;
  feet: number;
}
