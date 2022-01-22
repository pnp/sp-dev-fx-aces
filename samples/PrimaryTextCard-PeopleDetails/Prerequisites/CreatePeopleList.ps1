Clear-Host
#Write-Host "Please enter your site URL"
$siteUrl = Read-Host "Please enter your Site URL"
$PeopleListName = "People"
$CountryListName = "Country"

try{
    Connect-PnPOnline -Url $siteUrl -UseWebLogin

    Write-Host "You are connected to "$siteUrl -ForegroundColor Green
    Write-Host "Lists with name "$PeopleListName " and " $CountryListName " will be created.." -ForegroundColor Yellow

    New-PnPList -Title $PeopleListName -Template GenericList

    Add-PnPField -List $PeopleListName -DisplayName "Email" -InternalName "Email" -Type Text -AddToDefaultView
    Add-PnPField -List $PeopleListName -DisplayName "JobTitle" -InternalName "JobTitle" -Type Text -AddToDefaultView
    Add-PnPField -List $PeopleListName -DisplayName "Country" -InternalName "Country" -Type Text -AddToDefaultView
     
    Write-Host "List "$PeopleListName "has been created succesfully.." -ForegroundColor Green

    New-PnPList -Title $CountryListName -Template GenericList

    Add-PnPField -List $CountryListName -DisplayName "Value" -InternalName "Value" -Type Text -AddToDefaultView

    Write-Host "List "$CountryListName "has been created succesfully.." -ForegroundColor Green
}
catch{
    write-host "Error occurred" -ForegroundColor Red
}