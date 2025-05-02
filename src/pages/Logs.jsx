import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LogsTable from "../components/LogsTable";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch logs once
  useEffect(() => {
    const fetchLogs = async () => {
      const snapshot = await getDocs(collection(db, "logs"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(), // convert Firestore timestamp
      }));
      setLogs(data);
      setFilteredLogs(data);
    };

    fetchLogs();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = logs;

    if (searchText) {
      filtered = filtered.filter((log) =>
        `${log.action} ${log.user} ${log.description} ${log.refId}`
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (log) =>
          log.timestamp >= new Date(startDate) &&
          log.timestamp <= new Date(endDate),
      );
    }

    setFilteredLogs(filtered);
  }, [searchText, startDate, endDate, logs]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* header */}
      <div className="flex w-full flex-wrap items-center justify-between gap-y-3 px-6 py-4">
        {/* title */}
        <div className="flex items-center justify-center gap-x-4">
          <h2 className="text-2xl font-semibold">Activity Logs</h2>
        </div>

        {/* bttn grp */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <HiMagnifyingGlass className="text-2xl text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search shops..."
              className="rounded-full border border-gray-400 bg-neutral-100 px-6 py-2 pl-12 text-sm text-gray-700 focus:ring-1 focus:ring-black focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-gray-400 bg-neutral-100 px-3 py-2 text-sm"
          />
          <input
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-gray-400 bg-neutral-100 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* content */}
      <div className="h-full w-full flex-1 rounded-4xl border border-[#E3E3E3] bg-[#F8F8F8] shadow-xl drop-shadow-2xl">
        {/* Logs Table */}
        <LogsTable logs={filteredLogs} />
      </div>
    </div>
  );
};

export default Logs;
