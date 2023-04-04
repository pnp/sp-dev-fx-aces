declare interface IToDoServiceStrings {
  ErrorNullArgument: string;
  ErrorCannotFindToDo: string;
  ErrorRetrievingToDo: string;
  ErrorRetrievingToDos: string;
  ErrorAddingToDo: string;
  ErrorUpdatingToDo: string;
  ErrorDeletingToDo: string;
  ErrorForbidden: string;
}

declare module 'ToDoServiceStrings' {
  const strings: IToDoServiceStrings;
  export = strings;
}
