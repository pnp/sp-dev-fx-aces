import { HttpClient } from "@microsoft/sp-http";
import { ExtensionResponse, Line, LinesOpenExtension, TfLLine } from "../types";
import { MSGraph } from "./msgraph";
import { getThemeColor } from "./themehelper";

const fillColour = getThemeColor("themePrimary").replace('#', '%23');
export const star: string = `data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Cpath d='M12.7013 3.90838C13.2332 2.83067 14.7699 2.83067 15.3018 3.90838L17.9928 9.3609L24.01 10.2353C25.1993 10.4081 25.6742 11.8696 24.8136 12.7085L20.4595 16.9527L21.4874 22.9456C21.6905 24.1301 20.4473 25.0334 19.3835 24.4742L14.0015 21.6447L8.61958 24.4742C7.55582 25.0334 6.31254 24.1301 6.5157 22.9456L7.54357 16.9527L3.18947 12.7085C2.32887 11.8696 2.80376 10.4081 3.99308 10.2353L10.0103 9.3609L12.7013 3.90838ZM14.0015 4.66308L11.3438 10.0483C11.1326 10.4763 10.7243 10.7729 10.252 10.8415L4.30903 11.7051L8.60941 15.8969C8.95115 16.23 9.1071 16.71 9.02642 17.1804L8.01124 23.0993L13.3268 20.3048C13.7492 20.0827 14.2539 20.0827 14.6763 20.3048L19.9918 23.0993L18.9767 17.1804C18.896 16.71 19.0519 16.23 19.3937 15.8969L23.6941 11.7051L17.7511 10.8415C17.2788 10.7729 16.8705 10.4763 16.6593 10.0483L14.0015 4.66308Z' fill='${fillColour}' %3E%3C/path%3E %3C/svg%3E`;
export const starFilled: string = `data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Cpath d='M12.7013 3.90838C13.2332 2.83067 14.7699 2.83067 15.3018 3.90838L17.9928 9.3609L24.01 10.2353C25.1993 10.4081 25.6742 11.8696 24.8136 12.7085L20.4595 16.9527L21.4874 22.9456C21.6905 24.1301 20.4473 25.0334 19.3835 24.4742L14.0015 21.6447L8.61958 24.4742C7.55582 25.0334 6.31254 24.1301 6.5157 22.9456L7.54357 16.9527L3.18947 12.7085C2.32887 11.8696 2.80376 10.4081 3.99308 10.2353L10.0103 9.3609L12.7013 3.90838Z' fill='${fillColour}' %3E%3C/path%3E %3C/svg%3E`;


export async function getLineDetails(httpClient: HttpClient, lineId: string): Promise<TfLLine> {
    try {
        const response = await httpClient.get(
            `https://api.tfl.gov.uk/Line/${lineId}/Status`,
            HttpClient.configurations.v1);
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error(errorDetails);
            return null;
        }
        const lineDetails: TfLLine[] = await response.json();
        return lineDetails[0];
    } catch (error) {
        console.error(error);
        return null;
    }

}

export async function getAllLinesDetails(httpClient: HttpClient): Promise<TfLLine[]> {
    try {
        const response = await httpClient.get(
            `https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,tflrail/Status`,
            HttpClient.configurations.v1);
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error(errorDetails);
            return null;
        }
        const lineDetails: TfLLine[] = await response.json();
        return lineDetails;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function mapLine(tflLine: TfLLine, favouriteLineId: string): Line {
    const isFavourite: boolean = tflLine.id === favouriteLineId;
    const statusSeverity: number  = tflLine.lineStatuses[0].statusSeverity;
    return {
        id: tflLine.id,
        name: tflLine.name,
        status: tflLine.lineStatuses[0].statusSeverityDescription,
        colour: getLineColour(tflLine.id),
        isFavourite,
        favouriteIconSvg: isFavourite ? starFilled : star,
        style: statusSeverity === 10 ? "default" : "attention"
    };
}

export function getLineColour(lineId: string): string {
    switch (lineId) {
        case 'bakerloo':
            return '%23996633';
        case 'central':
            return '%23CC3333';
        case 'circle':
            return '%23FFCC00';
        case 'district':
            return '%23006633';
        case 'dlr':
            return '%23009999';
        case 'hammersmith-city':
            return '%23CC9999';
        case 'jubilee':
            return '%23868F98';
        case 'london-overground':
            return '%23FF6600';
        case 'metropolitan':
            return '%23660066';
        case 'northern':
            return '%23000000';
        case 'piccadilly':
            return '%23000099';
        case 'tfl-rail':
            return '%230019A8';
        case 'victoria':
            return '%230099CC';
        case 'waterloo-city':
            return '%2366CCCC';
        default:
            return '%23000000';
    }
}

export async function getFavouriteLine(favLineExtensionName: string): Promise<string> {

    let extensionExists: boolean = false;

    try {
        let extensionsResponse: ExtensionResponse = await MSGraph.Get('/me/extensions', "v1.0");
        console.debug("Extension response from Graph %o", extensionsResponse);

        if (extensionsResponse.value.length > 0) {
            let requiredExtension: LinesOpenExtension[] = extensionsResponse.value.filter(e => e.id === favLineExtensionName);
            if (requiredExtension && requiredExtension.length > 0) {
                console.debug("Required extension %o", requiredExtension[0].line);
                extensionExists = true;
                return requiredExtension[0].line;
            } else {
                console.warn("Extension does not exist");
            }
        } else {
            console.warn("Extensions do not exist, so creating");
        }

        if (!extensionExists) {
            const createExtensionUrl: string = `/me/extensions`;
            const extensionData: any = {
                "@odata.type": "microsoft.graph.openTypeExtension",
                "extensionName": favLineExtensionName,
                "line": ""
            };
            MSGraph.Post(createExtensionUrl, "v1.0", extensionData);
            return null;
        }

    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function setFavouriteLine(lineId: string, favLineExtensionName: string): Promise<boolean> {

    try {
        const updateExtensionUrl: string = `/me/extensions/${favLineExtensionName}`;
        const extensionData: LinesOpenExtension = {
            line: lineId
        };
        await MSGraph.Patch(updateExtensionUrl, "v1.0", extensionData);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}