import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPHttpClient } from '@microsoft/sp-http'

export const STATUS_HIRED = 'hired';
export const STATUS_ENROUTE = 'en route';
export const STATUS_AVAILABLE = 'available';

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IListItem {
  ['@odata.type']?: string;
  Id?: string;
  Title: string;
  Status: string;
  OriginLocation?: string | ILocation;
  DestinationName?: string;
  DestinationLocation?: string | ILocation;
}

export const fetchListItem = async (spContext: AdaptiveCardExtensionContext, listId: string): Promise<IListItem> => {
  if (!listId) { return Promise.reject('No listId specified.'); }

  const listApiUrl = `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')`;
  const user = spContext.pageContext.user.loginName;

  const response: { value: IListItem[] } = await (await spContext.spHttpClient.get(
    `${listApiUrl}/items/?$select=Id,Title,Status,OriginLocation,DestinationName,DestinationLocation&$filter=Title eq '${user}'&$top=1`,
    SPHttpClient.configurations.v1
  )).json();

  if (response.value.length === 0) { return Promise.resolve(<IListItem>{ Title: user, Status: STATUS_AVAILABLE }); }

  const convertedTrip = response.value[0];

  if (convertedTrip) {
    const origin = convertedTrip.OriginLocation as string;
    convertedTrip.OriginLocation = <ILocation>{
      latitude: Number(origin.split(',')[0]),
      longitude: Number(origin.split(',')[1])
    };
  }
  if (convertedTrip) {
    const destination = convertedTrip.DestinationLocation as string;
    convertedTrip.DestinationLocation = <ILocation>{
      latitude: Number(destination.split(',')[0]),
      longitude: Number(destination.split(',')[1])
    };
  }

  return Promise.resolve(convertedTrip);
}

const getItemEntityType = async (spContext: AdaptiveCardExtensionContext, listApiUrl: string): Promise<string> => {
  const response: { ListItemEntityTypeFullName: string } = await (await spContext.spHttpClient.get(
    `${listApiUrl}?$select=ListItemEntityTypeFullName`,
    SPHttpClient.configurations.v1
  )).json();

  return response.ListItemEntityTypeFullName;
}

const createListItem = async (
  spContext: AdaptiveCardExtensionContext,
  listApiUrl: string,
  listItem: IListItem): Promise<void> => {

  listItem['@odata.type'] = await getItemEntityType(spContext, listApiUrl);

  await spContext.spHttpClient.post(
    `${listApiUrl}/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'ACCEPT': 'application/json; odata.metadata=none',
        'CONTENT-TYPE': 'application/json'
      },
      body: JSON.stringify(listItem)
    }
  );

  return Promise.resolve();
}

export const upsertListItem = async (spContext: AdaptiveCardExtensionContext, listId: string, trip: IListItem): Promise<void> => {
  if (!listId) { return Promise.reject('No listId specified.'); }

  // copy the trip so the location objects in the ACE state don't change
  const listItem: IListItem = { ...trip };

  const listApiUrl = `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')`;

  const originLocationObj = (listItem.OriginLocation as ILocation);
  listItem.OriginLocation = `${originLocationObj.latitude},${originLocationObj.longitude}`;
  const destinationLocationObj = (listItem.DestinationLocation as ILocation);
  listItem.DestinationLocation = `${destinationLocationObj.latitude},${destinationLocationObj.longitude}`;

  if (!listItem['@odata.type']) { return createListItem(spContext, listApiUrl, listItem); }

  await spContext.spHttpClient.post(
    `${listApiUrl}/items(${listItem.Id})`,
    SPHttpClient.configurations.v1,
    {
      headers: { 'IF-MATCH': '*', 'X-HTTP-METHOD': 'MERGE' },
      body: JSON.stringify(<IListItem>{
        Title: listItem.Title,
        Status: listItem.Status,
        OriginLocation: listItem.OriginLocation,
        DestinationName: listItem.DestinationName,
        DestinationLocation: listItem.DestinationLocation
      })
    }
  );

  return Promise.resolve();
}

export const deleteListItem = async (spContext: AdaptiveCardExtensionContext, listId: string, listItemId: number): Promise<void> => {
  if (!listId) { return Promise.reject('No listId specified.'); }
  if (!listItemId) { return Promise.reject('No listItemId specified.'); }

  const listApiUrl = `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')`;

  await spContext.spHttpClient.post(
    `${listApiUrl}/items(${listItemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: { 'IF-MATCH': '*', 'X-HTTP-METHOD': 'DELETE' }
    }
  );
}
