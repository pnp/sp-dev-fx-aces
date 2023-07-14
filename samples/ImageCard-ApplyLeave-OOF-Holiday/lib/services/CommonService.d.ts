import { BaseComponentContext } from '@microsoft/sp-component-base';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
declare class CommonService {
    getHolidayList: (context: BaseComponentContext, countryCode: string) => Promise<any>;
    getConfigList: (emailId: string) => Promise<any>;
    addItemToList: (leaveInfo: any, authorInfo: ISiteUserInfo) => Promise<any>;
}
declare let commonAction: CommonService;
export default commonAction;
//# sourceMappingURL=CommonService.d.ts.map