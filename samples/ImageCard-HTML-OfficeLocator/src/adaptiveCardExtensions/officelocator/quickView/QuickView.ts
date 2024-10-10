import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import {
  IOfficelocatorAdaptiveCardExtensionProps,
  IOfficelocatorAdaptiveCardExtensionState
} from '../OfficelocatorAdaptiveCardExtension';

import { OfficeLocatorMap } from './components/OfficeLocatorMap';


export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseWebQuickView<
  IOfficelocatorAdaptiveCardExtensionProps,
  IOfficelocatorAdaptiveCardExtensionState
> {

  

  render(): void {
    const {offices, mapkey} = this.properties;
    
    const element: React.ReactElement<{}> = React.createElement(OfficeLocatorMap, {
      subscriptionKey: mapkey,
      offices:  offices.map(office => ({
        ...office,
        lon: parseFloat(office.lon),
        lat: parseFloat(office.lat)
      }))

    });
    ReactDOM.render(element, this.domElement);
  }

  public onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.dispose();
  }


  // public get data(): IQuickViewData {
  //   return {
  //     subTitle: strings.SubTitle,
  //     title: strings.Title
  //   };
  // }


}
