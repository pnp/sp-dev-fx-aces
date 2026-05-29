import { RetrievedTeams, Team } from "./types";
import { GraphServiceInstance } from './GraphService';
import * as _ from 'lodash';

export async function getRecentlyCreatedTeams(userEmail: string): Promise<RetrievedTeams> {

    try {
        let filteredTeams: Team[];
        const result: RetrievedTeams = {
            "@odata.count": 0,
            "value": [],
            userId: ""
        };
        const userData = await GraphServiceInstance.GetUserId(userEmail);
        result.userId = userData.value[0].id;
        const userTeams:RetrievedTeams = await GraphServiceInstance.GetUserTeams(result.userId);
        if (userTeams.value.length > 0) {
            const userTeamsId = userTeams.value.map(team => team.id);
            const allTeams:RetrievedTeams = await GraphServiceInstance.GetTeams();
            filteredTeams = allTeams.value.filter(team => !(userTeamsId.indexOf(team.id) > -1) && team.visibility === "Public");
        } else {
            filteredTeams = (await GraphServiceInstance.GetTeams()).value;
        }
        filteredTeams = _.sortBy(filteredTeams, function(item) {
            return new Date(item.createdDateTime);
          });
        if (filteredTeams.length >20){
            filteredTeams = filteredTeams.slice(0, 20);
        }
        result["@odata.count"] = filteredTeams.length;
        for (const item of filteredTeams) {
            const photo = await GraphServiceInstance.GetProfilePicture(item.id);
            result.value.push({ displayName: item.displayName, createdDateTime: item.createdDateTime, description: item.description, picture: photo, id: item.id });
        }

        return result;

    } catch (error) {
        console.error(error);
        return { "@odata.count": 0, value: [], userId: "" };
    }
}
