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

        //reutrn a JSON object like : 
        /**
         *Could use the ID for identifying the list in the future
        *@odata.id is also the URL to the list that could be usefull
        {
        "@odata.context": "https://amvcc.sharepoint.com/sites/AMVCCIT/_api/$metadata#lists/$entity",
        "@odata.type": "#SP.List",
        "@odata.id": "https://amvcc.sharepoint.com/sites/AMVCCIT/_api/Web/Lists(guid'686ca9b0-42fa-47c5-a72e-ec0fd7ddf305')",
        "@odata.etag": "\"1\"",
        "@odata.editLink": "Web/Lists(guid'686ca9b0-42fa-47c5-a72e-ec0fd7ddf305')",
        "AllowContentTypes": true,
        "BaseTemplate": 100,
        "BaseType": 0,
        "ContentTypesEnabled": true,
        "CrawlNonDefaultViews": false,
        "Created": "2024-01-04T12:00:14Z",
        "CurrentChangeToken": {
            "StringValue": "1;3;686ca9b0-42fa-47c5-a72e-ec0fd7ddf305;638399664141230000;353907542"
        },
        "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
        "DefaultItemOpenUseListSetting": false,
        "Description": "List to support content for DCC",
        "Direction": "none",
        "DisableCommenting": false,
        "DisableGridEditing": false,
        "DocumentTemplateUrl": null,
        "DraftVersionVisibility": 0,
        "EnableAttachments": true,
        "EnableFolderCreation": false,
        "EnableMinorVersions": false,
        "EnableModeration": false,
        "EnableRequestSignOff": true,
        "EnableVersioning": true,
        "EntityTypeName": "DCC_x0020_Content_x0020_ListList",
        "ExemptFromBlockDownloadOfNonViewableFiles": false,
        "FileSavePostProcessingEnabled": false,
        "ForceCheckout": false,
        "HasExternalDataSource": false,
        "Hidden": false,
        "Id": "686ca9b0-42fa-47c5-a72e-ec0fd7ddf305",
        "ImagePath": {
            "DecodedUrl": "/_layouts/15/images/itgen.png?rev=47"
        },
        "ImageUrl": "/_layouts/15/images/itgen.png?rev=47",
        "DefaultSensitivityLabelForLibrary": "",
        "SensitivityLabelToEncryptOnDOwnloadForLibrary": null,
        "IrmEnabled": false,
        "IrmExpire": false,
        "IrmReject": false,
        "IsApplicationList": false,
        "IsCatalog": false,
        "IsPrivate": false,
        "ItemCount": 0,
        "LastItemDeletedDate": "2024-01-04T12:00:14Z",
        "LastItemModifiedDate": "2024-01-04T12:00:14Z",
        "LastItemUserModifiedDate": "2024-01-04T12:00:14Z",
        "ListExperienceOptions": 0,
        "ListItemEntityTypeFullName": "SP.Data.DCC_x0020_Content_x0020_ListListItem",
        "MajorVersionLimit": 50,
        "MajorWithMinorVersionsLimit": 0,
        "MultipleDataList": false,
        "NoCrawl": false,
        "ParentWebPath": {
            "DecodedUrl": "/sites/AMVCCIT"
        },
        "ParentWebUrl": "/sites/AMVCCIT",
        "ParserDisabled": false,
        "ServerTemplateCanCreateFolders": true,
        "TemplateFeatureId": "00bfea71-de22-43b2-a848-c05709900100",
        "Title": "DCC Content List"
        }
        **/



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
        return Promise.resolve({listUrl: `${spContext.pageContext.web.absoluteUrl}/lists/DCC Content List`, odataUrl: response.value[0]['@odata.id']});
    }
}


export const fetchListItems = async (spContext: AdaptiveCardExtensionContext, odataUrl: string, usageLocation: string): Promise<IListItem[]> => {
    if (!odataUrl) { return Promise.reject('No listId specified.'); }
  
    const response = await (await spContext.spHttpClient.get(
      `${odataUrl}/items?$select=Title,Description,Image,Link&$filter=Country eq '${usageLocation}'`,
      SPHttpClient.configurations.v1
    )).json();
  
    if (response.value?.length > 0) {
      return Promise.resolve(response.value.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (listItem: any) => {
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
