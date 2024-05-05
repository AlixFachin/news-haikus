"use client";
// This component should be a client side component to allow the date to be local to user's timezone

import Link from "next/link";
import dayjs from "dayjs";
import { getDateFormatJapanTimeFromDayjs } from "@/utils/datetimeUtils";

export const DateSwitcher = ({ currentDate }: { currentDate: Date }) => {
  const djsDate = dayjs(currentDate);
  const nextDayHref =
    getDateFormatJapanTimeFromDayjs(djsDate.add(1, "day")) ===
    getDateFormatJapanTimeFromDayjs(dayjs())
      ? "/"
      : `/archive/${getDateFormatJapanTimeFromDayjs(djsDate.add(1, "day"))}`;

  return (
    <div className="my-4 flex items-baseline justify-center rounded-lg bg-orange-400 p-4 dark:bg-blue-800">
      <Link
        href={`/archive/${getDateFormatJapanTimeFromDayjs(djsDate.subtract(1, "day"))}`}
        data-cy="date-switcher-previous"
      >
        &lt;
      </Link>
      <div className="ml-4 mr-4 text-sm">Change Haiku Date</div>
      {djsDate.isBefore(dayjs(), "day") ? (
        <Link href={nextDayHref} data-cy="date-switcher-next">
          &gt;
        </Link>
      ) : (
        <span>&gt;</span>
      )}
    </div>
  );
};

export default DateSwitcher;
