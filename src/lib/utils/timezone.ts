export interface TimezoneOption {
  value: string;
  label: string;
  city: string;
  region: string;
}

export const TIMEZONES: TimezoneOption[] = [
  { value: "Africa/Lagos", label: "Africa/Lagos", city: "Lagos", region: "West Africa" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg", city: "Johannesburg", region: "South Africa" },
  { value: "America/New_York", label: "America/New_York", city: "New York", region: "Eastern Time" },
  { value: "America/Chicago", label: "America/Chicago", city: "Chicago", region: "Central Time" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles", city: "Los Angeles", region: "Pacific Time" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo", city: "São Paulo", region: "Brazil" },
  { value: "Europe/London", label: "Europe/London", city: "London", region: "United Kingdom" },
  { value: "Europe/Paris", label: "Europe/Paris", city: "Paris", region: "Central Europe" },
  { value: "Europe/Berlin", label: "Europe/Berlin", city: "Berlin", region: "Germany" },
  { value: "Asia/Dubai", label: "Asia/Dubai", city: "Dubai", region: "Gulf Standard" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata", city: "Kolkata", region: "India" },
  { value: "Asia/Singapore", label: "Asia/Singapore", city: "Singapore", region: "Singapore" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo", city: "Tokyo", region: "Japan" },
  { value: "Australia/Sydney", label: "Australia/Sydney", city: "Sydney", region: "Eastern Australia" },
];

export function getTimezoneInfo(timezoneStr: string, date: Date = new Date()) {
  try {
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneStr,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const time = timeFormatter.format(date);

    // Get GMT offset string
    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneStr,
      timeZoneName: "shortOffset",
    });
    const parts = offsetFormatter.formatToParts(date);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value || "GMT";

    return { time, offset };
  } catch {
    return { time: "--:--", offset: "GMT" };
  }
}
