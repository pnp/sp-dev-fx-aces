import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IActionArguments,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ImageCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'UserManagerAdaptiveCardExtensionStrings';
import {
  IUserManagerAdaptiveCardExtensionProps,
  IUserManagerAdaptiveCardExtensionState,
} from '../UserManagerAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
	IUserManagerAdaptiveCardExtensionProps,
	IUserManagerAdaptiveCardExtensionState,
	ComponentsCardViewParameters
> {
	_retryLoading: () => void;

	constructor(retryLoading: () => void) {
		super();

		this._retryLoading = retryLoading;
	}

	public get cardViewParameters(): ComponentsCardViewParameters {
		const { managerPicture, manager, error } = this.state;

		let text = manager?.displayName;

		// If the manager has a phone number add it to the text
		if (manager?.jobTitle) {
			text += "\n" + manager.jobTitle;
		}

		// If the manager has a phone number add it to the text
		if (manager?.businessPhones && manager?.businessPhones?.length > 0) {
			text += "\n" + manager.businessPhones[0];
		}

		// If the manager has an office location add it to the text
		if (manager?.officeLocation) {
			text += "\n" + manager.officeLocation;
		}

		const cardView = ImageCardView({
			cardBar: {
				componentName: "cardBar",
				title: strings.CardTitle,
				icon: {
					url: require("../assets/RecruitmentManagement.png"),
				},
			},
			header: {
				componentName: "text",
				text: error === false ? text : strings.Error,
			},
			image: {
				url:
					error === false
						? managerPicture ?? require("../assets/missing-picture.png")
						: require("../assets/error.png"),
				altText: manager?.displayName,
			},
			footer: {
				componentName: "cardButton",
				title: error === false ? strings.CardViewButton : strings.ReloadButton,
				style: "positive",
				action:
					error === false
						? {
								type: "ExternalLink",
								parameters: {
									isTeamsDeepLink: false,
									target: `https://teams.microsoft.com/l/chat/0/0?users=${manager?.userPrincipalName}`,
								},
						}
						: {
								type: "Execute",
								parameters: {
									reload: true,
								},
						},
			},
		});

		return cardView;
	}

	onAction(action: IActionArguments): void {
    // Reload the card if the user clicks the reload button
    if (action.type === "Execute" && action.data.reload === true) {
      this._retryLoading();
    }
  }

	public get onCardSelection():
		| IQuickViewCardAction
		| IExternalLinkCardAction
		| undefined {

    const { manager } = this.state;
    
    // if the manager is defined then open a new mail message to the manager
		return {
			type: "ExternalLink",
			parameters: {
				target: manager
					? `mailto:${manager.mail}`
					: "https://outlook.office365.com/mail/",
			},
		};
	}
}
