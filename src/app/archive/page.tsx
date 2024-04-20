import ArchivePage from "./[archiveDate]/page";
import { getTodayDateFormatJapanTime } from "@/utils/datetimeUtils";

export default function RootArchivePage() {
  return (
    <ArchivePage params={{ archiveDate: getTodayDateFormatJapanTime() }} />
  );
}
