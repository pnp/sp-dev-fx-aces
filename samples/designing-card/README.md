# Designing Card Templates

## Summary

This sample application provides a list of design cards, accordingly to the documentation available on page [Designing Viva Connections custom cards for your dashboard](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/viva/design/designing-card).



## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.18.2-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| generic-card | PaoloPia (Paolo Pialorsi, PiaSys.com, [@PaoloPia](https://twitter.com/PaoloPia)) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | January 19, 2024 | Initial release |

## List of Designs

Here you can see the list of designs available in this project.

| Family | Combination 	| Card bar 	| Header 	|  Body 	 |  Footer 	     | Notes                                 	| Sample Card 	| Card Name |
|:-----------:	|:-----------:	|:--------:	|:------------:	|:-----:	 |:-------:	     |---------------------------------------	|-------------	|-------------	|
| Generic |     1     	|    Yes   	|     Text     	| Empty 	 | Action button | Previously known as the Image template 	| ![Generic card with image permutation 1.](https://learn.microsoft.com/en-us/sharepoint/dev/images/viva-design/img-permutation-01-card-layout.png) | GenericTextImageButton |
| Generic |     2     	|    Yes   	|     Text     	| Empty 	 | Empty         | Previously known as the Image template	| ![Generic card with image permutation 2.](https://learn.microsoft.com/en-us/sharepoint/dev/images/viva-design/img-permutation-02-card-layout.png) | GenericTextImage |
| Generic |     3     	|    Yes   	|     Text     	| Empty 	 | Text Input    | New layout                           	| ![Generic card with image permutation 3.](https://learn.microsoft.com/en-us/sharepoint/dev/images/viva-design/img-permutation-03-card-layout.png) | GenericTextInputImage |
| Generic |     4     	|    Yes   	|     Text     	| Text input | Action Button | New layout                           	| ![Generic card with image permutation 4.](https://learn.microsoft.com/en-us/sharepoint/dev/images/viva-design/img-permutation-04-card-layout.png) | GenericTextInputButtonImage |
| Generic |     5     	|    Yes   	|     Text     	| Text input | Empty         | New layout                             	| ![Generic card with image permutation 5.](https://learn.microsoft.com/en-us/sharepoint/dev/images/viva-design/img-permutation-05-card-layout.png) | GenericTextInputImage |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
