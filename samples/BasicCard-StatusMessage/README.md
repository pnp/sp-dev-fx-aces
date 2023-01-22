# BasicCard-StatusMessage

## Summary

This ACE demonstrates how to use the Presence Graph API endpoints (beta) to get/set a status message and availability/activity for a user.

![card view](assets/card_view.png)

![card view with settings](assets/card_view_settings.png)

![quick view](assets/quick_view.png)

![card view success](assets/quick_view_success.png)

![card view updated](assets/card_view_updated.png)

![teams client](assets/teams_client.png)

## Compatibility

![SPFx 1.16](https://img.shields.io/badge/SPFx-1.16.0-green.svg)
![Node.js LTS 16.x](https://img.shields.io/badge/Node.js-LTS%2016.x-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)

## Applies to

* [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
* [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)

## Prerequisites

> You need to approve the following Microsoft Graph permissions at the tenant level:

* Presence.ReadWrite
* Application.Read.All

NOTE: This sample uses some beta Graph endpoints (Presence). The beta endpoints can change at any time and should not be used in production.

## Solution

Solution|Author(s)
--------|---------
BasicCard-StatusMessage | [Yves Habersaat](https://github.com/yhabersaat) ([@yhabersaat](https://twitter.com/yhabersaat)), Sword Group

## Version history

Version|Date|Comments
-------|----|--------
1.1|January 22, 2023|Added new Presence API capabilities (get/set availability and activity)
1.0|December 21, 2022|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* in the command line run:
  * `npm install`
  * `gulp serve`
