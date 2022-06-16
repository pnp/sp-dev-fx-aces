/**
 * @jest-environment jsdom
 */
///<reference types="jest" />
import { assert } from "chai";
import { PeopleViewManager } from "../../src/viewManager/PeopleViewManager";
import { MockUsers } from "../mocks/MockUsers";

jest.mock("@microsoft/teams-js", () => ({
    app: {
        initialize: () => { },
        openLink: () => { }
    }
}));

describe("PeopleViewManager", () => {

    test("should handle getUsers action", async () => {
        let peopleService = {
            getUsers: () => Promise.resolve(MockUsers.users)
        }
        let getUsersSpy = jest.spyOn(peopleService, "getUsers");
        let peopleManager = new PeopleViewManager(peopleService as any);
        let partialState = await peopleManager.handleAction({ id: "PeopleSearchInputAction", data: { PeopleSearchInput: "test" } });
        assert.deepEqual(partialState, { searchedUsers: MockUsers.users });

        expect(getUsersSpy).toHaveBeenCalledWith("test");
    });
    test("should handle chat action (Teams)", async () => {
        let peopleService = {
            getUsers: () => Promise.resolve(MockUsers.users)
        };
        
        let mockedTeamsSDK = require("@microsoft/teams-js");
        let openLinkSpy = jest.spyOn(mockedTeamsSDK.app, "openLink");
        let peopleManager = new PeopleViewManager(peopleService as any);

        await peopleManager.handleAction({ id: "chat-test-id", data: { loginName: "test-user-principal-name" } });
        expect(openLinkSpy).toHaveBeenCalledWith("https://teams.microsoft.com/l/chat/0/0?users=test-user-principal-name");
    });
    test("should handle chat action (SP)", async () => {
        let peopleService = {
            getUsers: () => Promise.resolve(MockUsers.users)
        };
        let openLinkSpy = jest.spyOn(window, "open");
        let peopleManager = new PeopleViewManager(peopleService as any);

        await peopleManager.handleAction({ id: "chat-test-id", data: { loginName: "test-user-principal-name" } });
        expect(openLinkSpy).toHaveBeenCalledWith("https://teams.microsoft.com/l/chat/0/0?users=test-user-principal-name", "_blank");
    });
});