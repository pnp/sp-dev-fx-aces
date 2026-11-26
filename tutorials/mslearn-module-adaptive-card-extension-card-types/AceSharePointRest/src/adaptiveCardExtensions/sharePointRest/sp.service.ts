import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPHttpClient } from '@microsoft/sp-http'

export interface IListItem {
  id: string;
  title: string;
  description: string;
  index: number;
}

export const fetchListTitle = async (spContext: AdaptiveCardExtensionContext, listId: string): Promise<string> => {
  if (!listId) { return Promise.reject('No listId specified.'); }

  const response = await (await spContext.spHttpClient.get(
    `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')/?$select=Title`,
    SPHttpClient.configurations.v1
  )).json();

  return Promise.resolve(response.Title);
}

export const fetchListItems = async (spContext: AdaptiveCardExtensionContext, listId: string): Promise<IListItem[]> => {
  if (!listId) { return Promise.reject('No listId specified.'); }

  const response = await (await spContext.spHttpClient.get(
    `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')/items?$select=ID,Title,Description`,
    SPHttpClient.configurations.v1
  )).json();

  if (response.value?.length > 0) {
    return Promise.resolve(response.value.map(
      (listItem: { ID: number; Title: string; Description: string }, index: number) => {
        return <IListItem>{
          id: listItem.ID.toString(),
          title: listItem.Title,
          description: listItem.Description,
          index: index
        };
      }
    ));
  } else {
    return Promise.resolve([]);
  }
}

const getItemEntityType = async (spContext: AdaptiveCardExtensionContext, listId: string): Promise<string> => {
  const response: { ListItemEntityTypeFullName: string } = await (await spContext.spHttpClient.get(
    `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')?$select=ListItemEntityTypeFullName`,
    SPHttpClient.configurations.v1
  )).json();

  return response.ListItemEntityTypeFullName;
}

export const addListItem = async (
  spContext: AdaptiveCardExtensionContext,
  listId: string,
  listItemTitle: string,
  listItemDescription: string): Promise<void> => {

    // get the entity type of list item
    const entityListItemType = await getItemEntityType(spContext, listId);

    // create item to send to SP REST API
    const newListItem: { '@odata.type': string; Title: string; Description: string } = {
      '@odata.type': entityListItemType,
      Title: listItemTitle,
      Description: listItemDescription
    };

    await spContext.spHttpClient.post(
      `${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'ACCEPT': 'application/json; odata.metadata=none',
          'CONTENT-TYPE': 'application/json'
        },
        body: JSON.stringify(newListItem)
      }
    );

    return Promise.resolve();
}
