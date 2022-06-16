export interface IWorkOption {
    choice: string;
    value: string;
}

export interface ICheckinPrefillModel {
    UserIdentifier: string;
    workOptionItems: IWorkOption[];
}