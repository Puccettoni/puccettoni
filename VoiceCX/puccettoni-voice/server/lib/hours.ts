// Service-hours guard. The Toast Orders API does NOT verify restaurant hours,
// so we own this. Hours (ET): Mon–Fri 11:00–14:00 & 17:00–21:00, Sat 17:00–21:00, Sun closed.

const TZ = "America/New_York";

interface Window {
  start: number; // minutes from midnight
  end: number;
}

// day index: 0=Sun ... 6=Sat
const SCHEDULE: Record<number, Window[]> = {
  0: [], // Sunday closed
  1: [{ start: 11 * 60, end: 14 * 60 }, { start: 17 * 60, end: 21 * 60 }],
  2: [{ start: 11 * 60, end: 14 * 60 }, { start: 17 * 60, end: 21 * 60 }],
  3: [{ start: 11 * 60, end: 14 * 60 }, { start: 17 * 60, end: 21 * 60 }],
  4: [{ start: 11 * 60, end: 14 * 60 }, { start: 17 * 60, end: 21 * 60 }],
  5: [{ start: 11 * 60, end: 14 * 60 }, { start: 17 * 60, end: 21 * 60 }],
  6: [{ start: 17 * 60, end: 21 * 60 }], // Saturday dinner only
};

function nowInET(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = weekdays[map.weekday] ?? new Date().getDay();
  const hour = parseInt(map.hour ?? "0", 10) % 24;
  const minute = parseInt(map.minute ?? "0", 10);
  return { day, minutes: hour * 60 + minute };
}

export function isOpenNow(): boolean {
  // Demo override: set DEMO_FORCE_OPEN=true to rehearse the full order flow any time of day.
  if (process.env.DEMO_FORCE_OPEN === "true") return true;
  const { day, minutes } = nowInET();
  return (SCHEDULE[day] || []).some((w) => minutes >= w.start && minutes < w.end);
}

// Returns a short, single-line human note about the next opening (for the agent to speak).
export function nextOpenNote(): string {
  const { day } = nowInET();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    if ((SCHEDULE[d] || []).length > 0) {
      const w = SCHEDULE[d][0];
      const hh = String(Math.floor(w.start / 60)).padStart(2, "0");
      const mm = String(w.start % 60).padStart(2, "0");
      const when = i === 0 ? "later today" : i === 1 ? "tomorrow" : `on ${dayNames[d]}`;
      return `next opening is ${when} at ${hh}:${mm} ET`;
    }
  }
  return "see our posted hours";
}
