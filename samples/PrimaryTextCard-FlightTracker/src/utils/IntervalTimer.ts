/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */



export class IntervalTimer {
  private savedCallback:any = undefined;
  private delay = 0;
  private timerId = 0;

  constructor( callback: any, delay: number) {
    this.savedCallback = callback;
    this.delay = delay;
  }

  public  startTimer = (shouldStart: boolean)=> {
    if (shouldStart) {
      const tick = () => {
        this.savedCallback()  ;
      };
    if (this.delay !== null) {
        this.timerId = setInterval(tick, this.delay);

      }
    } else {
      clearInterval(this.timerId);
    }
  } ;
}
