# primary-text-card-people-details

## Summary

This Adaptive Card Extension shows general CRUD operations for people details using SharePoint list and Adaptive Card which involves multiple QuickViews and pnp js.

![screenshot](assets/PrimaryTextCard-PeopleDetails-Demo.gif)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.13.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites
> Run the PowerShell **`CreatePeopleList.ps1`** script under *Prerequisites* folder to create required Lists
* Lists with name **People** and **Country** will be created
* Put some value in the **Country** list 

## Solution

Solution|Author(s)
--------|---------
PrimaryTextCard-PeopleDetails | Soumyadeep Mukherjee ([@soumyadeep2207](https://github.com/soumyadeep2207)), Soumit Mukherjee ([@msoumit](https://github.com/msoumit)), Sourav Paul ([@XLR8-0](https://github.com/XLR8-0))

## Version history

Version|Date|Comments
-------|----|--------
1.0|January 01, 2022|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  * Serve the solution
    - **`npm install`**
    - **`gulp serve`**
  * Bundle the solution
    - **`gulp build --ship`**
    - **`gulp bundle --ship`**
    - **`gulp package-solution --ship`**


## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- Adaptive Card Extension - PrimaryTextCard Template 
- SharePoint CRUD Operation using PnP with ACE


## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development