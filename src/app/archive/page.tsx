import ArchivePage from "./[archiveDate]/page";
import {
  getDateFormatJapanTimeFromDayjs,
  getTodayDateFormatJapanTime,
} from "@/utils/datetimeUtils";
import dayjs from "dayjs";
import { redirect, RedirectType } from "next/navigation";

// TODO -> Put in a higher value to avoid re-rendering the same page all over again
export const revalidate = 0;

export default function RootArchivePage() {
    const yesterdayDate = dayjs().subtract(1, "day");

    redirect(
      `/archive/${getDateFormatJapanTimeFromDayjs(yesterdayDate)}`,
      RedirectType.replace,
    );
    return;
}
