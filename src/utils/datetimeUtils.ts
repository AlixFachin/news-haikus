import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateFormatJapanTime = (date: Date) => {
  return dayjs(date).tz("Asia/Tokyo").format("YYYYMMDD");
};

export const getDateFormatJapanTimeFromDayjs = (date: Dayjs) => {
  return date.tz("Asia/Tokyo").format("YYYYMMDD");
};

export const getTodayDateFormatJapanTime = () => {
  return dayjs().tz("Asia/Tokyo").format("YYYYMMDD");
};
