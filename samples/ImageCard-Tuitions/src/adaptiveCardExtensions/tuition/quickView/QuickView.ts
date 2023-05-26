import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ITuitionAdaptiveCardExtensionProps, ITuitionAdaptiveCardExtensionState } from '../TuitionAdaptiveCardExtension';
import  illustration  from '../assets/Illustration.png';
import * as strings from 'TuitionAdaptiveCardExtensionStrings';
import {IQuickViewTutionData} from '../../tuition/models/tution-models';

export interface IQuickViewData {
  illustrationImg: string;
  tutionStatementText: string;
  studentNameText: string;
  studentNumText: string;
  datePreparedText: string;
  dateText: string;
  transactionText: string;
  paymentsText: string;
  chargesText: string;
  totalText: string;
  balanceText: string;
  payButtonText: string;
  tutionDetails : IQuickViewTutionData;
  dateObjects : unknown[];
  transactionObjects : unknown[];
  paymentsObjects : unknown[];
  chargesObjects : unknown[];
}

export class QuickView extends BaseAdaptiveCardView<
  ITuitionAdaptiveCardExtensionProps,
  ITuitionAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tutionDetails : IQuickViewTutionData  =  require('../../tuition/models/sample-tution-template.json');    
    const dateObjects : unknown[]  = [];
    const transactionObjects : unknown[]  = [];
    const paymentsObjects : unknown[]  = [];
    const chargesObjects : unknown[]  = [];

    tutionDetails.transactionDetails.forEach(element => {
      dateObjects.push({"date" : element.date});
      transactionObjects.push({"transaction" : element.transaction});
      paymentsObjects.push({"payment" : element.payments});
      chargesObjects.push({"charges" : element.charges});
    });

    return {
      illustrationImg: illustration,
      tutionStatementText : strings.TutionStatementText,
      studentNameText :strings.StudentNameText,
      studentNumText : strings.StudentNumText,
      datePreparedText : strings.DatePreparedText,
      dateText : strings.DateText,
      transactionText : strings.TransactionText,
      paymentsText : strings.PaymentsText,
      chargesText : strings.ChargesText,
      totalText : strings.TotalText,
      balanceText : strings.BalanceText,
      payButtonText : strings.PayButtonText,
      tutionDetails : tutionDetails,
      dateObjects : dateObjects,
      transactionObjects : transactionObjects,
      paymentsObjects : paymentsObjects,
      chargesObjects : chargesObjects
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}