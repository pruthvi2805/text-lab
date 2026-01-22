"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type DataType = "name" | "email" | "phone" | "address" | "company" | "lorem" | "uuid" | "date" | "creditcard" | "username";

// Simple seedable random for consistency
class Random {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Math.floor(Math.random() * 2147483647);
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Data pools
const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Christopher", "Karen", "Emma", "Oliver", "Ava", "Noah",
  "Sophia", "Liam", "Isabella", "Mason", "Mia", "Ethan", "Charlotte", "Lucas",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
];

const STREET_TYPES = ["St", "Ave", "Blvd", "Dr", "Ln", "Rd", "Way", "Pl", "Ct"];
const STREET_NAMES = [
  "Main", "Oak", "Maple", "Cedar", "Pine", "Elm", "Washington", "Lake",
  "Hill", "Park", "River", "Spring", "Valley", "Forest", "Sunset", "Highland",
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "Seattle", "Denver", "Boston",
];

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const COMPANIES = [
  "Tech", "Solutions", "Systems", "Industries", "Corp", "Inc", "Labs", "Digital",
  "Global", "International", "Services", "Group", "Partners", "Innovations",
];

const COMPANY_PREFIXES = [
  "Acme", "Alpha", "Beta", "Delta", "Omega", "Prime", "Apex", "Nova",
  "Vertex", "Quantum", "Nexus", "Fusion", "Matrix", "Sigma", "Phoenix",
];

const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "proton.me"];

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
];

function generateData(type: DataType, rng: Random): string {
  switch (type) {
    case "name":
      return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;

    case "email": {
      const first = rng.pick(FIRST_NAMES).toLowerCase();
      const last = rng.pick(LAST_NAMES).toLowerCase();
      const domain = rng.pick(DOMAINS);
      const style = rng.int(0, 2);
      if (style === 0) return `${first}.${last}@${domain}`;
      if (style === 1) return `${first}${last}${rng.int(1, 99)}@${domain}`;
      return `${first[0]}${last}@${domain}`;
    }

    case "phone": {
      const area = rng.int(200, 999);
      const p1 = rng.int(200, 999);
      const p2 = rng.int(1000, 9999);
      return `(${area}) ${p1}-${p2}`;
    }

    case "address": {
      const num = rng.int(1, 9999);
      const street = rng.pick(STREET_NAMES);
      const type = rng.pick(STREET_TYPES);
      const city = rng.pick(CITIES);
      const state = rng.pick(STATES);
      const zip = rng.int(10000, 99999);
      return `${num} ${street} ${type}, ${city}, ${state} ${zip}`;
    }

    case "company":
      return `${rng.pick(COMPANY_PREFIXES)} ${rng.pick(COMPANIES)}`;

    case "lorem": {
      const count = rng.int(8, 15);
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(rng.pick(LOREM_WORDS));
      }
      const sentence = words.join(" ");
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    }

    case "uuid": {
      const hex = "0123456789abcdef";
      const parts = [8, 4, 4, 4, 12];
      return parts
        .map((len) =>
          Array.from({ length: len }, () => hex[rng.int(0, 15)]).join("")
        )
        .join("-");
    }

    case "date": {
      const year = rng.int(1970, 2024);
      const month = rng.int(1, 12);
      const day = rng.int(1, 28);
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }

    case "creditcard": {
      // Fake card (starts with 4 for Visa pattern)
      const p1 = "4" + rng.int(100, 999).toString();
      const p2 = rng.int(1000, 9999).toString();
      const p3 = rng.int(1000, 9999).toString();
      const p4 = rng.int(1000, 9999).toString();
      return `${p1} ${p2} ${p3} ${p4}`;
    }

    case "username": {
      const first = rng.pick(FIRST_NAMES).toLowerCase();
      const style = rng.int(0, 3);
      if (style === 0) return `${first}${rng.int(1, 999)}`;
      if (style === 1) return `${first}_${rng.pick(["dev", "pro", "user", "ninja", "coder"])}`;
      if (style === 2) return `the_${first}`;
      return `${first}${rng.int(2020, 2024)}`;
    }

    default:
      return "";
  }
}

const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: "name", label: "Full Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "address", label: "Address" },
  { value: "company", label: "Company" },
  { value: "username", label: "Username" },
  { value: "uuid", label: "UUID" },
  { value: "date", label: "Date" },
  { value: "creditcard", label: "Credit Card (Fake)" },
  { value: "lorem", label: "Lorem Sentence" },
];

export default function FakeDataPage() {
  const [selectedTypes, setSelectedTypes] = useState<DataType[]>(["name", "email", "phone"]);
  const [count, setCount] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [format, setFormat] = useState<"text" | "json" | "csv">("text");

  const output = useMemo(() => {
    if (selectedTypes.length === 0) return "Select at least one data type";

    const rng = new Random(refreshKey || undefined);
    const records: Record<string, string>[] = [];

    for (let i = 0; i < count; i++) {
      const record: Record<string, string> = {};
      selectedTypes.forEach((type) => {
        record[type] = generateData(type, rng);
      });
      records.push(record);
    }

    if (format === "json") {
      return JSON.stringify(records, null, 2);
    }

    if (format === "csv") {
      const headers = selectedTypes.join(",");
      const rows = records.map((r) =>
        selectedTypes.map((t) => {
          const val = r[t];
          return val.includes(",") ? `"${val}"` : val;
        }).join(",")
      );
      return [headers, ...rows].join("\n");
    }

    // Text format
    const lines: string[] = [];
    records.forEach((record, i) => {
      if (i > 0) lines.push("");
      lines.push(`─── Record ${i + 1} ───`);
      selectedTypes.forEach((type) => {
        const label = DATA_TYPES.find((t) => t.value === type)?.label || type;
        lines.push(`${label.padEnd(14)}: ${record[type]}`);
      });
    });

    return lines.join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes, count, refreshKey, format]);

  const handleInputChange = useCallback(() => {}, []);

  const toggleType = (type: DataType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <ToolLayout
      input=""
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Configure options above, data generated on the right →"
      outputPlaceholder="→ Generated fake data"
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Count:</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={format === "text" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFormat("text")}
            >
              Text
            </Button>
            <Button
              variant={format === "json" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFormat("json")}
            >
              JSON
            </Button>
            <Button
              variant={format === "csv" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFormat("csv")}
            >
              CSV
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            Regenerate
          </Button>

          <div className="w-full flex flex-wrap gap-1.5 mt-1">
            {DATA_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  selectedTypes.includes(type.value)
                    ? "bg-accent text-white"
                    : "bg-bg-surface text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}
