export interface IQuickViewInternData{
    companyName: string;
	internshipMode: string;
    description:string;
    companyImage:string;
}

export interface IQuickViewAllInternData{
    newInternTabData : IQuickViewInternData[],
    recentInternTabData : IQuickViewInternData[]
}