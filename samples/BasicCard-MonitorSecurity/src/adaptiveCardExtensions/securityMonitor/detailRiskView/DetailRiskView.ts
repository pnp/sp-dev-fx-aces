import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SecurityMonitorAdaptiveCardExtensionStrings';
import { securityCenterUrl } from '../../../common/Constants';
import { ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState } from '../SecurityMonitorAdaptiveCardExtension';

export interface IDetailRiskViewData {
    riskData: any[];
    moreLink: string;
}

export class DetailRiskView extends BaseAdaptiveCardView<
    ISecurityMonitorAdaptiveCardExtensionProps,
    ISecurityMonitorAdaptiveCardExtensionState,
    IDetailRiskViewData
> {
    public get data(): IDetailRiskViewData {
        return {
            riskData: this.state.riskData,
            moreLink: securityCenterUrl
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/RiskViewTemplate.json');
    }
}