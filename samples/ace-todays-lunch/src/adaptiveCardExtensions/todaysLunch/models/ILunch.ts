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
    dishes: string;
    weekday: Weekday;
    hasVeganDishes: boolean;
    picture: string;
    calories: number;
  }
  
  export class Lunch implements ILunch {
    constructor(
      public id: number,
      public title: string = "",
      public dishes: string = "",
      public weekday: Weekday = Weekday.Monday,
      public hasVeganDishes: boolean = true,
      public picture: string = "",
      public calories: 0
    ) { }
  }