import { CardSize } from "@microsoft/sp-adaptive-card-extension-base";

interface WeatherUnit {
  value: number;
  unit: string;
}

interface DailyIndex {
  indexId: number;
  category: string;
}

interface AirQuality {
  category: string;
  dominantPollutant: string;
}

export interface IWeatherAdaptiveCardExtensionState {
  loading: boolean;
  temperature: WeatherUnit;
  wind: {
    speed: WeatherUnit;
  };
  visibility: WeatherUnit;
  pressure: WeatherUnit;
  cloudCover: number;
  iconCode: number;
  dateTime: string;
  locationName: string;
  phrase: string;
  airQuality: AirQuality;
  asthmaForecast: DailyIndex;
  fluForecast: DailyIndex;
  dustForecast: DailyIndex;
  cardSize: CardSize;
}