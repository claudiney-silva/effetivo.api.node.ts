import moment from 'moment';

class TimeUtil {
  /*
  public getUnixTimeForAFutureDay(days: number): number {
	return moment().add(days, 'days').unix();
  }
  */

  public getDateUtc() {
    return moment().utc();
  }

  public getDateUnix() {
    return moment().unix();
  }
}

export const time = new TimeUtil();
