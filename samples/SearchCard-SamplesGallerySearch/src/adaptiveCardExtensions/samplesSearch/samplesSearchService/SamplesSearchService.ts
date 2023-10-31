import { ISamplesSearchService } from "./ISamplesSearchService";

import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

import { ISearchResults, ISampleItem } from "./ISearchResults";

export class SamplesSearchService implements ISamplesSearchService {

    // Create a ServiceKey to register in the Service Scope
    public static readonly serviceKey: ServiceKey<ISamplesSearchService> = ServiceKey.create<ISamplesSearchService>('PiaSys:SamplesSearchService', SamplesSearchService);

    private _httpClient: HttpClient;
    private _searchServiceUri: string;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            // Get the MSGraphClientFactory service instance from the service scope
            this._httpClient = serviceScope.consume(HttpClient.serviceKey);
        });
    }
    
    public init(searchServiceUri: string): void {
        this._searchServiceUri = `${searchServiceUri}${searchServiceUri.charAt(searchServiceUri.length - 1) === '/' ? '': '/'}Samples/searchSamples`;
        console.log(this._searchServiceUri);
    }

    public async search(queryString: string): Promise<ISampleItem[]> {
        const searchResults: ISearchResults = await this.invokeSearch(queryString, 20);
        return searchResults.items;
    }

    public async getSuggested(queryString: string): Promise<ISampleItem | undefined> {
        const searchResults: ISearchResults = await this.invokeSearch(queryString, 1);
        return searchResults.items.length > 0 ? searchResults.items[0] : undefined;
    }

    private async invokeSearch(queryString: string, size: number): Promise<ISearchResults> {

        // Prepare a request options object to send to the search service
        // query for searched text and retrieve the top size results
        const requestOptions: IHttpClientOptions = {
            body: JSON.stringify({
                sort: {
                    field: 'Title',
                    descending: true
                },
                filter: {
                    search: queryString
                },
                pagination: {
                    size: size,
                    index: 1
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }

        // Make the actual search request
        const response: HttpClientResponse = await this._httpClient.post(this._searchServiceUri,
            HttpClient.configurations.v1,
            requestOptions);

        // Process the response
        const searchResults: ISearchResults = await response.json();

        // Return the search results
        return searchResults;
    }
}