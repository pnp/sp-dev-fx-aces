# SPFX-ACE-at-a-glance

## Summary

This sample shows how to build an ACE with multiple card views to show the first few sentences of an article in a SharePoint site, so that the article can be looked at a glance.

The idea is based off of the *At a glance* section of a news in the BBC news app (beta).

### Highlights
- Usage of `SPHttpClient` or `PnP JS`
- Conditional property enabling
- Usage of emojis in buttons
- Usage of regex to get the sentences from article content

## Demo

![demo](./assets/demo.gif)

## Screenshot of the article

![demo](./assets/article-content.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.13.0-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> None

## Solution

Solution|Author(s)
--------|---------
at-a-glance | [Anoop Tatti](https://linktr.ee/anoopt)

## Version history

Version|Date|Comments
-------|----|--------
1.0|September 09, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**
- Edit the propeties of the ACE to include the ID of the news article.

## Features

The ACE also has properties to show custom text instead of article text. Upto 3 custom sentences can be added in the properties.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development