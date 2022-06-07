export interface IActionHandler{
    shouldHandleAction(actionId: string): boolean;
    handleAction(action: {id, data: any}): Promise<any>;
}