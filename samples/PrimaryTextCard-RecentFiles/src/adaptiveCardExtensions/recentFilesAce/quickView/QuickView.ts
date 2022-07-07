import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'RecentFilesAceAdaptiveCardExtensionStrings';
import { IRecentFilesAceAdaptiveCardExtensionProps, IRecentFilesAceAdaptiveCardExtensionState } from '../RecentFilesAceAdaptiveCardExtension';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface IQuickViewData {
	subTitle: string;
	title: string;
	recents: MicrosoftGraph.DriveItem[];
	currentFile: MicrosoftGraph.DriveItem;
	isFirstElement: boolean;
	isLastElement: boolean;
	previousIcon: string;
	nextIcon: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IRecentFilesAceAdaptiveCardExtensionProps,
  IRecentFilesAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const currentFile = this.getCurrentFile();
    return {
			subTitle: strings.SubTitle,
			title: strings.Title,
			recents:
				this.state.recents && this.state.recents.length > 0
					? this.state.recents
					: [],
			currentFile: currentFile,
			isFirstElement:
				this.state.recents && this.state.recents.length > 0
					? this.state.recents.indexOf(currentFile) == 0
					: true,
			isLastElement:
				this.state.recents && this.state.recents.length > 0
					? this.state.recents.indexOf(currentFile) == this.state.recents.length - 1
					: true,
			previousIcon: require("../assets/previous.png"),
			nextIcon: require("../assets/next.png"),
		};
  }

  private getCurrentFile = (): MicrosoftGraph.DriveItem => {
    let result: MicrosoftGraph.DriveItem = undefined;

    if (this.state.recents && this.state.recents.length > 0 && this.state.currentIndex < this.state.recents.length) {
      result = this.state.recents[this.state.currentIndex];
    }

    return result;
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: ISubmitActionArguments): void {
    if (action.type == "Submit") {
      let nextIndex: number = 0;

      switch(action.id) {
        case "next":
          nextIndex = ((this.state.currentIndex + 1) >= this.state.recents.length) ? this.state.currentIndex : this.state.currentIndex + 1;
          if(nextIndex != this.state.currentIndex) {
            this.setState({
              currentIndex: nextIndex
            });
          }
          break;
        case "prev":
          nextIndex = ((this.state.currentIndex - 1) < 0) ? 0 : this.state.currentIndex - 1;
          if(nextIndex != this.state.currentIndex) {
            this.setState({
              currentIndex: nextIndex
            });
          }
          break;
      }
    }
  }
}