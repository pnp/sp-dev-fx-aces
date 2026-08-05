import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export class PnPServices {
    public static sp: SPFI;

    public static refreshData = async () => {
        let peopleData: any[] = [];
        let countryData: any[] = [];
        let indexId: number = 0;
        try {
            let peopleResult: any[] = [];
            for await (const items of PnPServices.sp.web.lists.getByTitle(`People`).items) {
                peopleResult = peopleResult.concat(items);
            }
            peopleResult.forEach((elem) => {
                let obj = {
                    id: indexId,
                    title: elem["Title"] === null? "": elem["Title"],
                    itemId: elem["ID"],
                    email: elem["Email"] === null? "": elem["Email"],
                    jobTitle: elem["JobTitle"] === null? "": elem["JobTitle"],
                    country: elem["Country"] === null? "": elem["Country"],
                };
                peopleData.push(obj);
                indexId = indexId + 1;
            });
            
            let countryResult: any[] = [];
            for await (const items of PnPServices.sp.web.lists.getByTitle(`Country`).items) {
                countryResult = countryResult.concat(items);
            }
            countryResult.forEach((elem) => {
                let obj = {
                    title: elem["Title"] === null? "": elem["Title"],
                    value: elem["Value"] === null? "": elem["Value"]
                };
                countryData.push(obj);
            });
        }
        catch (err) {
            console.log(err);
        }
        let result = { 
            peopleData: peopleData,
            countryData: countryData 
        };
        return result;
    }

    public static updateItem = async (data: any, itemId: any) => {
        try {
            await PnPServices.sp.web.lists.getByTitle(`People`).items.getById(itemId).update({
                Title: data["title"],
                Email: data["email"],
                JobTitle: data["jobTitle"],
                Country: data["country"],
            });
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    public static createItem = async (data: any) => {
        try {
            let createData = await PnPServices.sp.web.lists.getByTitle(`People`).items.add({
                Title: data["title"],
                Email: data["email"],
                JobTitle: data["jobTitle"],
                Country: data["country"],
            });
            return createData;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    public static deleteItem = async (itemId: any) => {
        try {
            await PnPServices.sp.web.lists.getByTitle(`People`).items.getById(itemId).recycle();
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}