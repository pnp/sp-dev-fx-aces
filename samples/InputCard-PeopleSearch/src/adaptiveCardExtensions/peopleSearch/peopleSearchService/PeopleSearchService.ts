import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';

import { IPeopleSearchService } from './IPeopleSearchService';
import { IPerson } from '../model/IPerson';
/**
 * type of result returned by the Microsoft Graph /people API
 */
interface IGraphPerson {
  id: string;
  displayName: string;
  jobTitle?: string;
  officeLocation?: string;
  imAddress?: string;
  scoredEmailAddresses?: [{
    address: string;
    relevanceScore: number;
  }];
  phones?: [{
    type: string;
    number: string;
  }];
}

/**
 * type of result returned by the Microsoft Graph /me API
 */
interface IGraphUser {
  id: string;
  displayName: string;
  jobTitle?: string;
  mail: string;
  officeLocation?: string;
  userPrincipalName: string;
  businessPhones?: string[];
}

/**
 * Converts a graph person to a person
 */
const convertGraphPersonToPerson = (graphPerson: IGraphPerson): IPerson => {
  const {
    id,
    displayName,
    jobTitle,
    officeLocation,
    imAddress,
    scoredEmailAddresses,
    phones
  } = graphPerson;

  return {
    id,
    displayName,
    jobTitle: jobTitle || '',
    officeLocation: officeLocation || '',
    picture: `/_layouts/15/userphoto.aspx?size=S&accountname=${imAddress.replace('sip:', '')}`,
    emailAddress: scoredEmailAddresses?.length ? scoredEmailAddresses[0].address : '',
    phone: phones?.length ? phones[0].number : ''
  };
};

/**
 * Converts a graph user to a person
 */
const convertGraphUserToPerson = (graphUser: IGraphUser): IPerson => {
  const {
    id,
    displayName,
    jobTitle,
    mail,
    officeLocation,
    userPrincipalName,
    businessPhones
  } = graphUser;

  return {
    id,
    displayName,
    jobTitle: jobTitle || '',
    officeLocation: officeLocation || '',
    picture: `/_layouts/15/userphoto.aspx?size=S&accountname=${userPrincipalName}`,
    emailAddress: mail,
    phone: businessPhones?.length ? businessPhones[0] : ''
  };
};

export class PeopleSearchService implements IPeopleSearchService {
  // Create a ServiceKey to register in the Service Scope
  public static readonly serviceKey: ServiceKey<IPeopleSearchService> = ServiceKey.create<IPeopleSearchService>('PeopleSearchTutorial:PeopleSearchService', PeopleSearchService);

  private _msGraphClientFactory: MSGraphClientFactory;

  public constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      // Get the MSGraphClientFactory service instance from the service scope
      this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
    });
  }

  public search(queryString: string): Promise<IPerson[]> {
    return this._msGraphClientFactory.getClient('3')
    .then((client: MSGraphClientV3) => {
      // search for people, order by display name, return persons only (no groups, etc.), return top 25 results
      return client.api(`/me/people?$search="${queryString}"&orderBy=displayName&$filter=personType/class eq 'Person'&$top=25`).version('v1.0').get();
    })
    .then ((results: { value: IGraphPerson[] }) => {
      const people: IGraphPerson[] = results.value;
      
      return people.map((person: IGraphPerson) => {
        return convertGraphPersonToPerson(person);
      });
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Error searching people');
    });
  }

  public getSuggested(): Promise<IPerson> {
    // we will return the current user as a suggestion for simplicity
    return this._msGraphClientFactory.getClient('3')
    .then((client: MSGraphClientV3) => {
      return client.api('/me').version('beta').get();
    })
    .then((user: IGraphUser) => {
      return convertGraphUserToPerson(user);
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Error getting suggested person');
    });
  }
}