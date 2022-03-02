import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export class PnPServices {

    public static refreshData = async () => {
        let peopleData: any[] = [];
        let countryData: any[] = [];
        let indexId: number = 0;
        try {
            let peopleResult: any[] = await sp.web.lists.getByTitle(`People`).items.getAll();
            await peopleResult.map(async(elem, index) => {
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
            
            let countryResult: any[] = await sp.web.lists.getByTitle(`Country`).items.getAll();
            await countryResult.map(async(elem, index) => {
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
            await sp.web.lists.getByTitle(`People`).items.getById(itemId).update({
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
            let createData = await sp.web.lists.getByTitle(`People`).items.add({
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
            await sp.web.lists.getByTitle(`People`).items.getById(itemId).recycle();
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}