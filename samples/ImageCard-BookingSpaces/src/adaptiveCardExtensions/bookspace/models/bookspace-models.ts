export interface IChoiceValues {
    choice: string;
    value: string;
}

export interface IChoiceWithLabel {
    label: string;
    choices: IChoiceValues[];
}

export interface IBookSpaceDetails {
    buildingName: string;
    roomNo: string;
    seats: string;
    dateOfAvailability: string;
    timeOfAvailability: string;
    url: string;
    itemIdValue?: string;
    arrowIconButtonImage?: any;
}