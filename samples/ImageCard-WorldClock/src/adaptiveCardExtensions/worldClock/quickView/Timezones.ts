import { DateTime } from "luxon";
import USA from "../assets/flags/usa.svg";
import MEXICO from "../assets/flags/mexico.svg";
import ARGENTINA from "../assets/flags/argentina.svg";
import BRAZIL from "../assets/flags/brazil.svg";
import PORTUGAL from "../assets/flags/portugal.svg";
import UK from "../assets/flags/uk.svg";
import ITALY from "../assets/flags/italy.svg";
import UKRAINE from "../assets/flags/ukraine.svg";
import RUSSIA from "../assets/flags/russia.svg";
import AFGHANISTAN from "../assets/flags/afghanistan.svg";
import CHINA from "../assets/flags/china.svg";
import JAPAN from "../assets/flags/japan.svg";
import AUSTRALIA from "../assets/flags/australia.svg";

type City = {
  name: string;
  zone: string;
  icon: string;
};

export type Timezone = {
  title: string;
  time: string;
  icon: string;
};

const cities: City[] = [
  { name: "Anchorage", zone: "America/Anchorage", icon: USA },
  { name: "Los Angeles", zone: "America/Los_Angeles", icon: USA },
  { name: "Mexico City", zone: "America/Mexico_City", icon: MEXICO },
  { name: "New York", zone: "America/New_York", icon: USA },
  { name: "Buenos Aires", zone: "America/Buenos_Aires", icon: ARGENTINA },
  { name: "Sao Paulo", zone: "America/Sao_Paulo", icon: BRAZIL },
  { name: "Lisbon", zone: "Europe/Lisbon", icon: PORTUGAL },
  { name: "London", zone: "Europe/London", icon: UK },
  { name: "Rome", zone: "Europe/Rome", icon: ITALY },
  { name: "Kyiv", zone: "Europe/Kyiv", icon: UKRAINE },
  { name: "Moscow", zone: "Europe/Moscow", icon: RUSSIA },
  { name: "Kabul", zone: "Asia/Kabul", icon: AFGHANISTAN },
  { name: "Beijing", zone: "Asia/Shanghai", icon: CHINA },
  { name: "Tokyo", zone: "Asia/Tokyo", icon: JAPAN },
  { name: "Sydney", zone: "Australia/Sydney", icon: AUSTRALIA },
];

export const getTimezones = (): Timezone[] => {
  const currentTime = DateTime.now();

  return cities.map((city) => ({
    title: city.name,
    time: currentTime
      .setZone(city.zone)
      .toLocaleString(DateTime.TIME_24_SIMPLE),
    icon: city.icon,
  }));
};
