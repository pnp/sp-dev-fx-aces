# Dynamic Announcements

## Summary

This ACE card would be useful for an organization use it to make Announcements driven from SharePoint List.  This dynamic ACE component can be used to add to the Viva Connections dashboard and drive the CardView and QuickView from a SharePoint list. It filters the data from a SharePoint list based on the start date and end date for each row.
Each row will represents the Card view with a title and description and it can be configured from the List if we want to open external link or display a Quick View. The Quick View adaptive card template and data is also read from column in SharePoint list to resuse cards for different scenarios.

![Web part in Action](./assets/aceinaction.gif)

## Features

- ACE component to show multiple cards/items from a SharePoint list at a time based on dates
- The same component can render different Adaptive card formats as Quick View based on individual SharePoint list item
- On click of the Card View, it will open either an External URL or Quick view or no action based on the item's configuration(OnCardSelectionType)
- There are columns for Quick View adaptive card json template and for JSON data that will drive how the Quick View is rendered for a particular item
- To make the card dynamic, we can write PowerAutomate or to update the JSON object in the data column based on our requirement according to the adaptive card template.
- Prev and Next button to navigate through different items
- Option to create List from configuration Panel
- Option to enable Auto Rotate card every 4 seconds
- Same card be added multiple times on Dashboard pointing to different lists.

List Data Sample Screenshot
![Web part in Action](./assets/listsdataexample.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.14.0beta-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Technical Notes

> Card works on SP list which following schema and its columns explanation. Option to create list from ACE configuration pane.

1. `CardViewTitle`: Text to be display on Card View Title area
2. `CardViewDescription`: Text to be displayed on Card View Description area
3. `OnCardSelectionType`: Choice column to what should be done on click on Card View, Options are
    a. Noaction: Nothing will happen on click on Card View
    b. ExternalLink: External link will open on click of cardview, which link to be opened can be added to column 'ExternalLinkURL'
    c. QuickView: A QuickView will open on click on card for this item, Adaptive card template will read from 'QuickViewAdaptiveCardJSON' and data will be read from 'QuickViewAdaptiveCardData'
4. `ExternalLinkURL`: Link to open on click of Card View, this will only be application if OnCardSelectionType is selected as 'ExternalLink'
5. `QuickViewAdaptiveCardJSON`: Multile line of text column where we can configure the Adaptive Card Template JSON object, it should be a valid JSON object which you get by designing your adaptive card at this [link](https://adaptivecards.io/designer/)
6. `QuickViewAdaptiveCardData`: Multiple line of text column where we can put dynamic data in form of a valid JSON object to make the Adaptive card dynamic by passing values. This column can be updated via from PowerAutomate or scheduler to display data from external system or from anywhere within M365 product line.
7. `StartDate`: Start date after which this entry should start displaying on the component
8. `EndDate`: End date till which this entry should start displaying on the component. Data would be filtered based if today is greater than StartDate and less than EndDate.

You can refer and download sample data for quick reference from [here](./assets/sampledata.xlsx)

## Solution

Solution|Author(s)
--------|---------
PrimaryTextCard-Dynamic-Announcements | [Siddharth Vaghasia](https://siddharthvaghasia.com)

## Version history

Version|Date|Comments
-------|----|--------
1.0|March 14, 2022|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

## Concept Explored

This extension illustrates the following technical concepts:

- Making dynamic Cards driven from SharePoint list
- Getting data from SharePoint List

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/PrimaryTextCard-Dynamic-Announcements" />
