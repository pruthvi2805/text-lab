"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

const PRESETS: { label: string; cron: string }[] = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every day at noon", cron: "0 12 * * *" },
  { label: "Every Monday at 9am", cron: "0 9 * * 1" },
  { label: "Every weekday at 9am", cron: "0 9 * * 1-5" },
  { label: "First day of month", cron: "0 0 1 * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every 6 hours", cron: "0 */6 * * *" },
  { label: "Sunday at midnight", cron: "0 0 * * 0" },
];

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseCron(cron: string): CronParts | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

function describePart(value: string, unit: string, names?: string[]): string {
  if (value === "*") return `every ${unit}`;
  if (value.includes("/")) {
    const [, step] = value.split("/");
    return `every ${step} ${unit}s`;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    const startName = names ? names[parseInt(start)] || start : start;
    const endName = names ? names[parseInt(end)] || end : end;
    return `${startName} through ${endName}`;
  }
  if (value.includes(",")) {
    const vals = value.split(",").map(v => names ? names[parseInt(v)] || v : v);
    return vals.join(", ");
  }
  return names ? names[parseInt(value)] || value : value;
}

function describeCron(cron: string): string {
  const parts = parseCron(cron);
  if (!parts) return "Invalid cron expression";

  const descriptions: string[] = [];

  // Build human-readable description
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

  // Time
  if (minute === "*" && hour === "*") {
    descriptions.push("Every minute");
  } else if (minute === "0" && hour === "*") {
    descriptions.push("Every hour");
  } else if (minute.includes("/") && hour === "*") {
    const step = minute.split("/")[1];
    descriptions.push(`Every ${step} minutes`);
  } else if (hour.includes("/") && minute === "0") {
    const step = hour.split("/")[1];
    descriptions.push(`Every ${step} hours`);
  } else if (minute === "*") {
    descriptions.push(`Every minute during hour ${describePart(hour, "hour")}`);
  } else if (hour === "*") {
    descriptions.push(`At minute ${minute} of every hour`);
  } else {
    const h = parseInt(hour);
    const m = parseInt(minute);
    const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    if (hour.includes(",") || hour.includes("-") || hour.includes("/")) {
      descriptions.push(`At minute ${minute} past ${describePart(hour, "hour")}`);
    } else if (minute.includes(",") || minute.includes("-") || minute.includes("/")) {
      descriptions.push(`At ${describePart(minute, "minute")} past ${h}:00`);
    } else {
      descriptions.push(`At ${time}`);
    }
  }

  // Day of week
  if (dayOfWeek !== "*") {
    descriptions.push(`on ${describePart(dayOfWeek, "day", DAYS)}`);
  }

  // Day of month
  if (dayOfMonth !== "*") {
    descriptions.push(`on day ${describePart(dayOfMonth, "day")} of the month`);
  }

  // Month
  if (month !== "*") {
    descriptions.push(`in ${describePart(month, "month", MONTHS)}`);
  }

  return descriptions.join(", ");
}

function getNextRuns(cron: string, count: number = 5): Date[] {
  const parts = parseCron(cron);
  if (!parts) return [];

  const runs: Date[] = [];
  const now = new Date();
  let current = new Date(now);
  current.setSeconds(0);
  current.setMilliseconds(0);

  const matches = (value: string, num: number, max: number): boolean => {
    if (value === "*") return true;
    if (value.includes("/")) {
      const [base, step] = value.split("/");
      const s = parseInt(step);
      if (base === "*") return num % s === 0;
      return num >= parseInt(base) && (num - parseInt(base)) % s === 0;
    }
    if (value.includes("-")) {
      const [start, end] = value.split("-");
      return num >= parseInt(start) && num <= parseInt(end);
    }
    if (value.includes(",")) {
      return value.split(",").map(Number).includes(num);
    }
    return num === parseInt(value);
  };

  // Search for next runs (max 1 year ahead)
  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  while (runs.length < count && current < maxDate) {
    current.setMinutes(current.getMinutes() + 1);

    const minute = current.getMinutes();
    const hour = current.getHours();
    const day = current.getDate();
    const month = current.getMonth() + 1;
    const dow = current.getDay();

    if (
      matches(parts.minute, minute, 59) &&
      matches(parts.hour, hour, 23) &&
      matches(parts.dayOfMonth, day, 31) &&
      matches(parts.month, month, 12) &&
      matches(parts.dayOfWeek, dow, 6)
    ) {
      runs.push(new Date(current));
    }
  }

  return runs;
}

export default function CronPage() {
  const [input, setInput] = useState("0 9 * * 1-5");
  const [cronParts, setCronParts] = useState<CronParts>({
    minute: "0",
    hour: "9",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "1-5",
  });

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    const parsed = parseCron(value);
    if (parsed) {
      setCronParts(parsed);
    }
  }, []);

  const updatePart = (part: keyof CronParts, value: string) => {
    const newParts = { ...cronParts, [part]: value };
    setCronParts(newParts);
    setInput(`${newParts.minute} ${newParts.hour} ${newParts.dayOfMonth} ${newParts.month} ${newParts.dayOfWeek}`);
  };

  const applyPreset = (cron: string) => {
    setInput(cron);
    const parsed = parseCron(cron);
    if (parsed) {
      setCronParts(parsed);
    }
  };

  const description = useMemo(() => describeCron(input), [input]);
  const nextRuns = useMemo(() => getNextRuns(input, 10), [input]);
  const isValid = parseCron(input) !== null;

  const output = useMemo(() => {
    if (!isValid) return "Invalid cron expression\n\nFormat: minute hour day-of-month month day-of-week\nExample: 0 9 * * 1-5";

    const lines = [
      "═══════════════════════════════════════════════════════════════════",
      "                     CRON EXPRESSION ANALYZER",
      "═══════════════════════════════════════════════════════════════════",
      "",
      `Expression: ${input}`,
      "",
      "───────────────────────────────────────────────────────────────────",
      "",
      "HUMAN READABLE:",
      description,
      "",
      "───────────────────────────────────────────────────────────────────",
      "",
      "BREAKDOWN:",
      `  Minute:       ${cronParts.minute.padEnd(10)} (0-59)`,
      `  Hour:         ${cronParts.hour.padEnd(10)} (0-23)`,
      `  Day of Month: ${cronParts.dayOfMonth.padEnd(10)} (1-31)`,
      `  Month:        ${cronParts.month.padEnd(10)} (1-12)`,
      `  Day of Week:  ${cronParts.dayOfWeek.padEnd(10)} (0-6, Sun=0)`,
      "",
      "───────────────────────────────────────────────────────────────────",
      "",
      "NEXT 10 SCHEDULED RUNS:",
    ];

    if (nextRuns.length > 0) {
      nextRuns.forEach((date, i) => {
        const formatted = date.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        lines.push(`  ${(i + 1).toString().padStart(2)}. ${formatted}`);
      });
    } else {
      lines.push("  No runs scheduled in the next year");
    }

    lines.push("");
    lines.push("═══════════════════════════════════════════════════════════════════");
    lines.push("");
    lines.push("SYNTAX REFERENCE:");
    lines.push("  *     any value");
    lines.push("  ,     value list separator (1,3,5)");
    lines.push("  -     range of values (1-5)");
    lines.push("  /     step values (*/15 = every 15)");

    return lines.join("\n");
  }, [input, description, cronParts, nextRuns, isValid]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter cron expression (e.g., 0 9 * * 1-5)"
      outputPlaceholder="→ Cron analysis"
      error={!isValid ? "Invalid cron expression format" : null}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Presets:</label>
            <select
              value=""
              onChange={(e) => e.target.value && applyPreset(e.target.value)}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select preset...</option>
              {PRESETS.map((p) => (
                <option key={p.cron} value={p.cron}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <input
              type="text"
              value={cronParts.minute}
              onChange={(e) => updatePart("minute", e.target.value)}
              placeholder="min"
              className="w-12 bg-bg-surface border border-border rounded px-1 py-0.5 text-center text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              title="Minute (0-59)"
            />
            <input
              type="text"
              value={cronParts.hour}
              onChange={(e) => updatePart("hour", e.target.value)}
              placeholder="hr"
              className="w-12 bg-bg-surface border border-border rounded px-1 py-0.5 text-center text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              title="Hour (0-23)"
            />
            <input
              type="text"
              value={cronParts.dayOfMonth}
              onChange={(e) => updatePart("dayOfMonth", e.target.value)}
              placeholder="dom"
              className="w-12 bg-bg-surface border border-border rounded px-1 py-0.5 text-center text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              title="Day of Month (1-31)"
            />
            <input
              type="text"
              value={cronParts.month}
              onChange={(e) => updatePart("month", e.target.value)}
              placeholder="mon"
              className="w-12 bg-bg-surface border border-border rounded px-1 py-0.5 text-center text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              title="Month (1-12)"
            />
            <input
              type="text"
              value={cronParts.dayOfWeek}
              onChange={(e) => updatePart("dayOfWeek", e.target.value)}
              placeholder="dow"
              className="w-12 bg-bg-surface border border-border rounded px-1 py-0.5 text-center text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              title="Day of Week (0-6, Sun=0)"
            />
          </div>

          {isValid && (
            <span className="text-xs text-success">✓ Valid</span>
          )}
        </div>
      }
    />
  );
}
