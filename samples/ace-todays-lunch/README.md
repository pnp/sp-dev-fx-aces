# Today's lunch Adaptive Card extension

## Summary

This adaptive card extension sample renders information about Today´s lunch. Data is managed in a SharePoint list with a list item per day of the week. 

![picture of the ace in action](assets/demo.gif)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.13-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Microsoft Graph](https://docs.microsoft.com/en-us/graph/overview)
- [PnPJS](https://pnp.github.io/pnpjs/)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Create a SharePoint list named 'TodaysLunch' with the following fields:
  - Title: text
  - Dishes: text
  - HasVeganDishes: yes/no
  - WeekDay: choice with the days of the week options
  - LunchPicture: image
  - Calories: number

## Solution

Solution|Author(s)
--------|---------
ace-todays-lunch | Luis Mañez (MVP, [ClearPeople](http://www.clearpeople.com), @luismanez)

## Version history

Version|Date|Comments
-------|----|--------
1.0|October 28, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Create the SP List described in _Pre-requisites_ section
- in the command line run:
  - `npm install`
  - `gulp serve --nobrowser`
- browse to your hosted workbench https://YOURTENANT.sharepoint.com/sites/_layouts/15/workbench.aspx and add the adaptive card extension.    


## Features

This extension illustrates the following concepts:

- Using PnPJS to get data from a SP List.
- Using PnPJS RenderListDataAsStream with filters

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development