///<reference types="jest" />

import { assert } from "chai";
import { PeopleService } from "../../src/service/PeopleService";
import { MockUsers } from "../mocks/MockUsers";

describe("PeopleService", () => {
    test("should return people", async () => {
        let mockGraphClient = {
            get: () => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    value: MockUsers.users
                }),
                text: ()=>Promise.resolve("test-user-image")
            })
        };
        let peopleService = new PeopleService(mockGraphClient as any, "test-user-id");
        let spy = jest.spyOn(mockGraphClient, "get");
        let people = await peopleService.getUsers();
        
        assert.deepEqual(people, MockUsers.users);

        expect(spy).toHaveBeenCalledWith("/v1.0/me/people?$filter=personType/class eq 'Person'");
        expect(spy).toHaveBeenCalledWith("/users/8129ec7a-e92b-49bd-b20e-589ae70b78fd/photo/$value");
        expect(spy).toHaveBeenCalledWith("/users/71c2014a-7592-4545-b4a2-f33d8e1fe6a1/photo/$value");
    });
});