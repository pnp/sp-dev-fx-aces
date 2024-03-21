import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPHttpClient } from '@microsoft/sp-http'

export interface IListItem {
    title: string;
    description: string;
    link: string;
    image: string;
}
export interface IListInfo {
    listUrl: string;
    odataUrl: string;
}
//Check if the list already exists
export const testlist = async (spContext: AdaptiveCardExtensionContext ): Promise<IListInfo> => { 
       //Check if list already exists
       const listResponse = await (await spContext.spHttpClient.get(
        `${spContext.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Title eq 'DCC Content List'`,
        SPHttpClient.configurations.v1
    )).json()

    if (listResponse.value.length > 0) {
        //List already exists
        return Promise.resolve({listUrl: `${spContext.pageContext.web.absoluteUrl}/lists/DCC Content List`, odataUrl: listResponse.value[0]['@odata.id'] });
    }
    else {
        //List does not exist
        return Promise.resolve({listUrl: '', odataUrl: '' });
    }
}
//Create the list to store the content
export const createList = async (spContext: AdaptiveCardExtensionContext): Promise<IListInfo> => {
    //Check if list already exists
    const listResponse = await (await spContext.spHttpClient.get(
        `${spContext.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Title eq 'DCC Content List'`,
        SPHttpClient.configurations.v1
    )).json()

    console.log(listResponse);
        
    
    if (listResponse.value.length > 0) {
        //List already exists
        return Promise.resolve(listResponse.value[0]['@odata.id']);
    }
    else {
        //create a list
        const response = await (await spContext.spHttpClient.post(
            `${spContext.pageContext.web.absoluteUrl}/_api/web/lists`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'ACCEPT': 'application/json',
                    'CONTENT-TYPE': 'application/json;odata=nometadata'
                },
                body: JSON.stringify({
                    ContentTypesEnabled: true,
                    Title: 'DCC Content List',
                    Description: 'List to support content for DCC',
                    BaseTemplate: 100,
                    AllowContentTypes: true,
                    EnableAttachments: false
                })
            }
        )).json()

        //Create the columns
            //description
            await spContext.spHttpClient.post(response['@odata.id'] + '/fields',
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        },
                        body: JSON.stringify({
                            Title: 'Description',
                            FieldTypeKind: 2,
                            Required: true
                        })
                    }
                );
            //link
            await spContext.spHttpClient.post(response['@odata.id'] + '/fields',
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        },
                        body: JSON.stringify({
                            Title: 'Link',
                            FieldTypeKind: 11,
                            Required: true
                        })
                    }
                );
            //image
            await spContext.spHttpClient.post(response['@odata.id'] + '/fields/CreateFieldAsXml',
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        },
                        body: JSON.stringify({
                            "parameters": {
                            "SchemaXml": "<Field DisplayName='Image' Format='Thumbnail' IsModern='TRUE' Name='Image' Title='Image' Type='Thumbnail'></Field>"
                            }
                            })
                    }
                );
            //country
            await spContext.spHttpClient.post(response['@odata.id'] + '/fields',
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        },
                        body: JSON.stringify({
                            Title: 'Country',
                            FieldTypeKind: 2,
                            Required: true
                        })
                    }
                );
            //create columns for the list that is a boolean to ask if the link should be opened outside of teams
            await spContext.spHttpClient.post(response['@odata.id'] + '/fields',
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        },
                        body: JSON.stringify({
                            Title: 'Open Outside of Teams',
                            FieldTypeKind: 8
                        })    
                    }
                );

        
        //Update the default view with new fields
            //get the default view
            const viewResponse = await (await spContext.spHttpClient.get(
                `${response['@odata.id']}/DefaultView`,
                SPHttpClient.configurations.v1
            )).json()

            //Update the view
            await spContext.spHttpClient.post(viewResponse['@odata.id']+ `/ViewFields/addViewField('Description')`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'ACCEPT': 'application/json',
                            'CONTENT-TYPE': 'application/json;odata=nometadata'
                        }
                    }
                );
            await spContext.spHttpClient.post(viewResponse['@odata.id']+ `/ViewFields/addViewField('Link')`,
            SPHttpClient.configurations.v1,
                {
                    headers: {
                        'ACCEPT': 'application/json',
                        'CONTENT-TYPE': 'application/json;odata=nometadata'
                    }
                }
                );
            await spContext.spHttpClient.post(viewResponse['@odata.id']+ `/ViewFields/addViewField('Image')`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'ACCEPT': 'application/json',
                    'CONTENT-TYPE': 'application/json;odata=nometadata'
                }
            }
                );
            await spContext.spHttpClient.post(viewResponse['@odata.id']+ `/ViewFields/addViewField('Country')`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'ACCEPT': 'application/json',
                    'CONTENT-TYPE': 'application/json;odata=nometadata'
                }
            }
                );
            await spContext.spHttpClient.post(viewResponse['@odata.id']+ `/ViewFields/addViewField('Open Outside of Teams')`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'ACCEPT': 'application/json',
                        'CONTENT-TYPE': 'application/json;odata=nometadata'
                    }
                }
                );
        return Promise.resolve({listUrl: `${spContext.pageContext.web.absoluteUrl}/lists/DCC Content List`, odataUrl: response.value[0]['@odata.id']});
    }
}
//Fetch the list items to be then use by the adaptive card
export const fetchListItems = async (spContext: AdaptiveCardExtensionContext, odataUrl: string, usageLocation: string): Promise<IListItem[]> => {
    if (!odataUrl) { return Promise.reject('No listId specified.'); }
  
    const response = await (await spContext.spHttpClient.get(
      `${odataUrl}/items?$select=Title,Description,Image,Link,Open_x0020_Outside_x0020_of_x002&$filter=Country eq '${usageLocation}'`,
      SPHttpClient.configurations.v1
    )).json();
  
    if (response.value?.length > 0) {
      return Promise.resolve(response.value.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (listItem: any) => {
            //Add the query parameter to the link if the link should be opened outside of teams
            if (listItem.Open_x0020_Outside_x0020_of_x002 === true) {
                if (listItem.Link.Url.includes('?')) 
                { listItem.Link.Url += '&vcNativeLink=true'; } 
                else 
                { listItem.Link.Url += '?vcNativeLink=true'; }
            }
            
          return <IListItem>{
            link: listItem.Link.Url,
            title: listItem.Title,
            description: listItem.Description,
            image: JSON.parse(listItem.Image).serverUrl + JSON.parse(listItem.Image).serverRelativeUrl
          };
        }
      ));
    } else {
      return Promise.resolve([]);
    }
  }
