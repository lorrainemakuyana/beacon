import { useState, useEffect } from "react";
import { Attendance } from "@/interfaces";
import { getUserAttendanceRecords } from "@/firebase/services/attendance";

interface UseUserAttendanceResult {
  attendanceByShift: Record<string, Attendance>;
  loading: boolean;
}

export function useUserAttendance(userId: string | undefined): UseUserAttendanceResult {
  const [attendanceByShift, setAttendanceByShift] = useState<Record<string, Attendance>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setLoading(true);

    getUserAttendanceRecords(userId)
      .then((records) => {
        if (cancelled) return;
        const map: Record<string, Attendance> = {};
        for (const record of records) {
          map[record.shiftId] = record;
        }
        setAttendanceByShift(map);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { attendanceByShift, loading };
}
