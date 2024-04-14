import ArchivePage from "./[archiveDate]/page";
import dayjs from "dayjs";

export default function RootArchivePage() {
  return <ArchivePage params={{ archiveDate: dayjs().format("YYYYMMDD") }} />;
}
