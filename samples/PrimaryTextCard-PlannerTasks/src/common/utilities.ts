import { isEmpty } from '@microsoft/sp-lodash-subset';
import { compareAsc, format, getDate, getDay, getMonth, isValid, isBefore } from 'date-fns';


export default class Utilities {

  public static getDayFromDate(date: Date): number {
    return isValid(date) ? getDate(date) : 0;
  }
  public static getMonthFromDate(date: Date): string {
    const month = isValid(date) ? date.toLocaleString('default', { month: 'short' }) : "";
    return month;
  }
  public static getLocaleDateString(dateStr: string): string {
    return !isEmpty(dateStr) ? format(new Date(dateStr), 'yyyy-MM-dd') : "";
  }
  public static getCurrentDate(): string {
    var result = format(new Date(), 'yyyy-MM-dd');
    return result;
  }
  public static isDateBeforeToday(dateStr) {
    var result = isBefore(new Date(dateStr), new Date())
    return result;
  }
  public static IsNullOrEmpty(value: any): boolean {
    return isEmpty(value);
  }
  public static GetStatus(percentComplete) {
    var status = {
      '0': 'Pending',
      '50': 'In Progress',
      '100': 'Completed',
      'default': 'Pending'
    };
    return (status[percentComplete] || status['default']);
  }

  public static GetSelectedTypeName(type:string)
  {
    var TasksTypes = {
      'due': 'Upcoming Tasks',
      'overdue': 'Overdue Tasks',
      'inprogress': 'In Progress Tasks',
      'pending': 'Pending Tasks',
      'completed': 'Completed Tasks',
      'default': 'Upcoming Tasks'
    };
    return (TasksTypes[type] || TasksTypes['default']);
  }
}