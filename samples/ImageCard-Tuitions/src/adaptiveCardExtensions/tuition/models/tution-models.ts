export interface IQuickViewTutionData{
    studentName: string;
	studentNumber: string;
    datePrepared:string;
    total:string;
    balance:string;
    transactionDetails : ITransactionDetails[]
}

export interface ITransactionDetails{
    date: string;
	transaction: string;
    payments : string;
    charges:string;
}