import { ToDoItem } from './ToDoItem';

/**
 * Defines the abstract interface for the ToDo Service
 */
export interface IToDoService {

    /**
     * Initializes the ToDoService instance
     * @param serviceBaseUrl The base URL of the service endpoint
     * @returns The whole list of ToDo items
     */
    Initialize: (serviceBaseUrl: string) => void;

    /**
     * Returns the whole list of ToDo items
     * @returns The whole list of ToDo items
     */
    ListToDo: () => Promise<ToDoItem[]>;

    /**
     * Retrieves a specific ToDo item by ID
     * @param id The ID of the ToDo item to retrieve
     * @returns A specific ToDo item by ID
     */
    GetToDo: (id: string) => Promise<ToDoItem>;

    /**
     * Adds a new ToDo item
     * @param order The ToDo item to add
     * @returns The just inserted ToDo item
     */
    AddToDo: (item: ToDoItem) => Promise<ToDoItem>;

    /**
     * Updates an already existing ToDo item
     * @param order The updated ToDo item to save
     * @returns The just updated ToDo item
     */
    UpdateToDo: (item: ToDoItem) => Promise<ToDoItem>;

    /**
     * Deletes a specific ToDo item by ID
     * @param id The ID of the ToDo item to delete
     */
    DeleteToDo: (id: string) => Promise<void>;
}
