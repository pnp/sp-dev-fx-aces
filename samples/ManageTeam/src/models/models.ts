export interface IMyTeam {
    userPrincipalName: string;
    displayName: string;
    givenName: string;
    id: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    jobTitle: string;
    mail: string;
  }
  
  export interface IConfig {
    members: IMyTeam[];
  }
  
  export class Config implements IConfig {
    constructor(
      public members: IMyTeam[] = []
    ) { }
  }