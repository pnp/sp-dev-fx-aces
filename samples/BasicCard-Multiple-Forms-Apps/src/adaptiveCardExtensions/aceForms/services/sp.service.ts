import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { IListItem } from '../models/models';

export const fetchListTitle = async (spContext: AdaptiveCardExtensionContext, listId: string, siteURL: string): Promise<string> => {
  if (!siteURL) { return Promise.reject('No Site URL specified.'); }
  if (!listId) { return Promise.reject('No List ID specified.'); }

  const response = await (await spContext.spHttpClient.get(
    //`${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')/?$select=Title`,
    `${siteURL}/_api/web/lists/GetById(id='${listId}')/?$select=Title`,
    SPHttpClient.configurations.v1
  )).json();

  return Promise.resolve(response.Title);
}

export const fetchListItems = async (spContext: AdaptiveCardExtensionContext, listId: string, siteURL: string): Promise<IListItem[]> => {
  if (!siteURL) { return Promise.reject('No Site URL specified.'); }
  if (!listId) { return Promise.reject('No List ID specified.'); }

  const response = await (await spContext.spHttpClient.get(
    //`${spContext.pageContext.web.absoluteUrl}/_api/web/lists/GetById(id='${listId}')/items?$select=ID,Title,Description,Image,Link`,
    `${siteURL}/_api/web/lists/GetById(id='${listId}')/items?$select=ID,Title,Description,Image,Link`,
    SPHttpClient.configurations.v1
  )).json();

  if (response.value?.length > 0) {
    return Promise.resolve(response.value.map(
      (listItem: any, index: number) => {

        const item = <IListItem>{
            id: listItem.ID,
            title: listItem.Title,
            imageURL: listItem.Image ? JSON.parse(listItem.Image).serverUrl + JSON.parse(listItem.Image).serverRelativeUrl : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
            linkURL: listItem.Link ?    generateStageViewLink(listItem.Link)
                                        : '',

            description: listItem.Description,
            index: index
        };

        return item;
      }
    ));
  } else {
    return Promise.resolve([]);
  }
}

const generateStageViewLink = (url:string) => {
  let deepLinkURL = url;

  if(url.indexOf("forms.office.com") > 0){
    deepLinkURL = "https://teams.microsoft.com/l/stage/81fef3a6-72aa-4648-a763-de824aeafb7d/0?context=%7B%22contentUrl%22%3A%22" + url +
    "%22%2C%22websiteUrl%22%3A%22" + url + "%22%7D"
  }

  if(url.indexOf("apps.powerapps.com") > 0){
    deepLinkURL = "https://teams.microsoft.com/l/stage/a6b63365-31a4-4f43-92ec-710b71557af9/0?context=%7B%22contentUrl%22%3A%22" + encodeURIComponent(url) +
    "%22%2C%22websiteUrl%22%3A%22" + encodeURIComponent(url) + "%22%7D"
  }

  return deepLinkURL;
}