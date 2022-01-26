export enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

export interface ILunch {
  id: number;
  title: string;
  shortDescription: string;
  seeMore: string;
  dishes: string;
  weekday: Weekday;
  hasVeganDishes: boolean;
  picture: string;
  calories: number;
  formattedDishes: string;
}

export class Lunch implements ILunch {
  constructor(
    public id: number,
    public title: string = "",
    public shortDescription: string = "",
    public seeMore: string = "https://www.bing.com",
    public dishes: string = "",
    public weekday: Weekday = Weekday.Monday,
    public hasVeganDishes: boolean = true,
    public picture: string = "",
    public calories: 0
  ) { }

  public get formattedDishes(): string {
    const dishesAsList: string[] = this.dishes.split(',');
    const dishesLi: string[] = dishesAsList.map(item => `- ${item.trim()}`);
    return dishesLi.join('\r');
  }
}

export interface ILunches {
  lunches: ILunch[];
}
