import Link from "next/link";
import dayjs from "dayjs";
import { getDateFormatJapanTimeFromDayjs } from "@/utils/datetimeUtils";

export const DateSwitcher = ({ currentDate }: { currentDate: Date }) => {
  const djsDate = dayjs(currentDate);

  return (
    <div className="my-4 flex items-baseline justify-center rounded-lg bg-orange-400 p-4 dark:bg-blue-800">
      <Link
        href={`/archive/${getDateFormatJapanTimeFromDayjs(djsDate.subtract(1, "day"))}`}
      >
        &lt;
      </Link>
      <div className="ml-4 mr-4 text-sm">Change Haiku Date</div>
      {djsDate.isBefore(dayjs(), "day") ? (
        <Link
          href={`/archive/${getDateFormatJapanTimeFromDayjs(djsDate.add(1, "day"))}`}
        >
          &gt;
        </Link>
      ) : (
        <span>&gt;</span>
      )}
    </div>
  );
};

export default DateSwitcher;
