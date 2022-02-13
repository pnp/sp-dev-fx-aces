import * as Localizations from "HybridWorkCheckinAdaptiveCardExtensionStrings";

export const CheckinFormTemplateLabels = {
    mainHeaderLabel: Localizations.MainFormHeaderLabel,
    nameLabel: Localizations.NameInputLabel,
    checkinTillLabel: Localizations.CheckinTillDateLabel,
    optionSectionLabel: Localizations.SurveySectionHeaderLabel,
    workOptionLabel: Localizations.WorkLocationOptionLabel,
    vaccineCheckLabel: Localizations.VaccinationCheckLabel,
    symptomCheckLabel: Localizations.CovidSymptomsCheckLabel,
    declarationSectionLabel: Localizations.DeclareSectionHeaderLabel
};

export const listName = "Hybrid Work Employee Check in";
export const checkinListApi = `/_api/web/lists/getByTitle('${listName}')/items`;
export const checkinLocationOptionApi = `/_api/web/lists/getByTitle('${listName}')/fields?$filter=EntityPropertyName eq 'WorkLocation'`;