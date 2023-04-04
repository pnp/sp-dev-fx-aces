import { ToDoItem } from './ToDoItem';
import { IToDoService } from './IToDoService';
import * as strings from 'ToDoServiceStrings';

// Import types for supporting SPFx with the service class
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadHttpClientFactory, AadHttpClient, IHttpClientOptions } from "@microsoft/sp-http";

/**
 * Define a custom Error type for the ToDo Service
 */
export class ToDoServiceError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ToDoService implements IToDoService {

    public static readonly serviceKey: ServiceKey<IToDoService> = ServiceKey.create<IToDoService>('PnP:ToDoService', ToDoService);

    private serviceBaseUrl: string;
    private aadClient: AadHttpClient;
    private ownerId: string;

    /**
     * Constructor for the service class
     * @param serviceScope Service Scope to initialize the service class
     */
    public constructor(serviceScope: ServiceScope) {

        // Initialized the PnPjs framework for SPFx
        serviceScope.whenFinished(async () => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this.ownerId = pageContext.legacyPageContext.aadUserId; 

            const aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            this.aadClient = await aadHttpClientFactory.getClient('api://4d1a3ac4-a31b-4263-aca7-b60c247ff535');
        });
    }

    /**
     * Initializes the ToDoService instance
     * @param serviceBaseUrl The base URL of the service endpoint
     * @returns The whole list of ToDo items
     */
    public Initialize(serviceBaseUrl: string): void {
        if (serviceBaseUrl === undefined) {
            throw new Error(strings.ErrorNullArgument + 'serviceBaseUrl');
        }

        this.serviceBaseUrl = serviceBaseUrl.replace(/\/$/, "");
    }

        /**
     * Returns the whole list of ToDo items
     * @returns The whole list of ToDo items
     */
    public async ListToDo(): Promise<ToDoItem[]> {
        try {
            // Configure the request options
            const httpOptions: IHttpClientOptions = {
                headers: this.getRequestHeaders()
            };
                        
            // Make the actual HTTP request
            const httpResponse = await this.aadClient.get(
                `${this.serviceBaseUrl}/rest/todo`, 
                AadHttpClient.configurations.v1,
                httpOptions);

            if (httpResponse.status === 403) {
                throw new ToDoServiceError(strings.ErrorForbidden);
            }
            else if (httpResponse.status !== 200) {
                throw new ToDoServiceError(strings.ErrorRetrievingToDos);
            }
        
            // Parse the JSON response
            const result: { value: ToDoItem[] } = await httpResponse.json();

            // Return the ToDo items
            return result.value;
        } catch (error) {
            if (error instanceof ToDoServiceError) {
                throw error;
            } else {
                throw new ToDoServiceError(`${strings.ErrorRetrievingToDos}: ${error.message}`);
            }
        }
    }

    /**
     * Retrieves a specific ToDo item by ID
     * @param id The ID of the ToDo item to retrieve
     * @returns A specific ToDo item by ID
     */
    public async GetToDo(id: string): Promise<ToDoItem> {
        try {
            // Configure the request options
            const httpOptions: IHttpClientOptions = {
                headers: this.getRequestHeaders()
            };

            // Make the actual HTTP request
            const httpResponse = await this.aadClient.get(
                `${this.serviceBaseUrl}/rest/todo/id/${id}`, 
                AadHttpClient.configurations.v1,
                httpOptions);

            if (httpResponse.status === 403) {
                throw new ToDoServiceError(strings.ErrorForbidden);
            }
            else if (httpResponse.status !== 200) {
                throw new ToDoServiceError(strings.ErrorRetrievingToDo);
            }
        
            // Parse the JSON response
            const result: { value: ToDoItem[] } = await httpResponse.json();

            // Return the single ToDo item
            return result.value[0];
        } catch (error) {
            if (error instanceof ToDoServiceError) {
                throw error;
            } else {
                throw new ToDoServiceError(`${strings.ErrorRetrievingToDo}: ${error.message}`);
            }
        }
    }

    /**
     * Adds a new ToDo item
     * @param order The ToDo item to add
     * @returns The just inserted ToDo item
     */
    public async AddToDo(item: ToDoItem): Promise<ToDoItem> {
        try {
            // Set the current user ID as the owner of the item
            console.log(this.ownerId);
            console.log(item);
            item.owner_id = this.ownerId;

            // Define the HTTP request headers
            const requestHeaders: Headers = this.getRequestHeaders();
            requestHeaders.append('Content-type', 'application/json');

            // Configure the request options
            const httpOptions: IHttpClientOptions = {
                body: JSON.stringify(item),
                headers: requestHeaders
            };

            // Make the actual HTTP request
            const httpResponse = await this.aadClient.post(
                `${this.serviceBaseUrl}/rest/todo`, 
                AadHttpClient.configurations.v1,
                httpOptions);

            if (httpResponse.status === 403) {
                throw new ToDoServiceError(strings.ErrorForbidden);
            }
            else if (httpResponse.status !== 201) {
                throw new ToDoServiceError(strings.ErrorAddingToDo);
            }

            // Parse the JSON response
            const result: { value: ToDoItem[] } = await httpResponse.json();

            // Return the single ToDo item
            return result.value[0];
        } catch (error) {
            if (error instanceof ToDoServiceError) {
                throw error;
            } else {
                throw new ToDoServiceError(`${strings.ErrorAddingToDo}: ${error.message}`);
            }
        }
    }

    /**
     * Updates an already existing ToDo item
     * @param order The updated ToDo item to save
     * @returns The just updated ToDo item
     */
    public async UpdateToDo(item: ToDoItem): Promise<ToDoItem> {
        try {
            // Define the HTTP request headers
            const requestHeaders: Headers = this.getRequestHeaders();
            requestHeaders.append('Content-type', 'application/json');

            // Configure the request options
            const httpOptions: IHttpClientOptions = {
                method: "PATCH",
                body: JSON.stringify({ title: item.title, completed: item.completed }),
                headers: requestHeaders
            };

            // Make the actual HTTP request
            const httpResponse = await this.aadClient.fetch(
                `${this.serviceBaseUrl}/rest/todo/id/${item.id}`, 
                AadHttpClient.configurations.v1,
                httpOptions);

            if (httpResponse.status === 403) {
                throw new ToDoServiceError(strings.ErrorForbidden);
            }
            else if (httpResponse.status !== 200) {
                throw new ToDoServiceError(strings.ErrorUpdatingToDo);
            }

            // Parse the JSON response
            const result: { value: ToDoItem[] } = await httpResponse.json();

            // Return the single ToDo item
            return result.value[0];
        } catch (error) {
            if (error instanceof ToDoServiceError) {
                throw error;
            } else {
                throw new ToDoServiceError(`${strings.ErrorUpdatingToDo}: ${error.message}`);
            }
        }
    }

    /**
     * Deletes a specific ToDo item by ID
     * @param id The ID of the ToDo item to delete
     */
    public async DeleteToDo(id: string): Promise<void> {
        try {
            // Define the HTTP request headers
            const requestHeaders: Headers = this.getRequestHeaders();
            requestHeaders.append('Content-type', 'application/json');

            // Configure the request options
            const httpOptions: IHttpClientOptions = {
                method: "DELETE",
                headers: requestHeaders
            };

            // Make the actual HTTP request
            const httpResponse = await this.aadClient.fetch(
                `${this.serviceBaseUrl}/rest/todo/id/${id}`, 
                AadHttpClient.configurations.v1,
                httpOptions);

            if (httpResponse.status === 403) {
                throw new ToDoServiceError(strings.ErrorForbidden);
            }
            else if (httpResponse.status !== 204) {
                throw new ToDoServiceError(strings.ErrorDeletingToDo);
            }
        } catch (error) {
            if (error instanceof ToDoServiceError) {
                throw error;
            } else {
                throw new ToDoServiceError(`${strings.ErrorDeletingToDo}: ${error.message}`);
            }
        }
    }

    /**
     * Prepares the request headers including the X-MS-API-ROLE header required by DAB
     * @returns The custom request headers
     */
    private getRequestHeaders(): Headers {
        // Define the HTTP request headers
        const requestHeaders: Headers = new Headers();
        requestHeaders.append('X-MS-API-ROLE', 'Sample.Role.1');

        return requestHeaders;
    }
}
