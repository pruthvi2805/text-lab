export type TimestampUnit = "seconds" | "milliseconds";

export interface TimestampResult {
  unix: number;
  unixMs: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
  date: Date;
}

export function parseTimestamp(input: string, unit: TimestampUnit): TimestampResult {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Please enter a timestamp or date");
  }

  let date: Date;
  const num = Number(trimmed);

  if (!isNaN(num)) {
    // Input is a number - treat as timestamp
    if (unit === "seconds") {
      date = new Date(num * 1000);
    } else {
      date = new Date(num);
    }
  } else {
    // Try to parse as date string
    date = new Date(trimmed);
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp or date format");
  }

  return formatTimestampResult(date);
}

export function getCurrentTimestamp(): TimestampResult {
  return formatTimestampResult(new Date());
}

function formatTimestampResult(date: Date): TimestampResult {
  const unixMs = date.getTime();
  const unix = Math.floor(unixMs / 1000);

  return {
    unix,
    unixMs,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    relative: getRelativeTime(date),
    date,
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const absDiffSec = Math.abs(diffSec);
  const absDiffMin = Math.abs(diffMin);
  const absDiffHour = Math.abs(diffHour);
  const absDiffDay = Math.abs(diffDay);

  const suffix = diffMs < 0 ? "ago" : "from now";

  if (absDiffSec < 60) {
    return absDiffSec === 1 ? `1 second ${suffix}` : `${absDiffSec} seconds ${suffix}`;
  }
  if (absDiffMin < 60) {
    return absDiffMin === 1 ? `1 minute ${suffix}` : `${absDiffMin} minutes ${suffix}`;
  }
  if (absDiffHour < 24) {
    return absDiffHour === 1 ? `1 hour ${suffix}` : `${absDiffHour} hours ${suffix}`;
  }
  if (absDiffDay < 30) {
    return absDiffDay === 1 ? `1 day ${suffix}` : `${absDiffDay} days ${suffix}`;
  }

  const months = Math.floor(absDiffDay / 30);
  if (months < 12) {
    return months === 1 ? `1 month ${suffix}` : `${months} months ${suffix}`;
  }

  const years = Math.floor(months / 12);
  return years === 1 ? `1 year ${suffix}` : `${years} years ${suffix}`;
}

export function formatTimestampOutput(result: TimestampResult): string {
  const lines: string[] = [];

  lines.push("=== UNIX TIMESTAMPS ===");
  lines.push(`Seconds:      ${result.unix}`);
  lines.push(`Milliseconds: ${result.unixMs}`);
  lines.push("");
  lines.push("=== FORMATTED DATES ===");
  lines.push(`ISO 8601:     ${result.iso}`);
  lines.push(`UTC:          ${result.utc}`);
  lines.push(`Local:        ${result.local}`);
  lines.push("");
  lines.push("=== RELATIVE ===");
  lines.push(result.relative);

  return lines.join("\n");
}
