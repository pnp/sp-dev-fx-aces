export interface ToDoItem {
    id: string;
    title: string;
    completed: boolean;
    owner_id?: string;
}