"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "il1Lo0O",
};

interface Options {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  count: number;
}

function generatePassword(options: Options): string {
  let charset = "";
  if (options.lowercase) charset += CHAR_SETS.lowercase;
  if (options.uppercase) charset += CHAR_SETS.uppercase;
  if (options.numbers) charset += CHAR_SETS.numbers;
  if (options.symbols) charset += CHAR_SETS.symbols;

  if (options.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !CHAR_SETS.ambiguous.includes(c))
      .join("");
  }

  if (charset.length === 0) {
    return "";
  }

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((n) => charset[n % charset.length])
    .join("");
}

function generateMultiplePasswords(options: Options): string[] {
  return Array.from({ length: options.count }, () => generatePassword(options));
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Weak", color: "text-error" };
  if (score <= 4) return { score, label: "Fair", color: "text-warning" };
  if (score <= 5) return { score, label: "Good", color: "text-accent" };
  return { score, label: "Strong", color: "text-success" };
}

export default function PasswordPage() {
  const [options, setOptions] = useState<Options>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    count: 5,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const passwords = useMemo(() => {
    return generateMultiplePasswords(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, refreshKey]);

  const output = useMemo(() => {
    if (passwords.length === 0 || passwords[0] === "") {
      return "Select at least one character type";
    }

    const lines = passwords.map((pwd) => {
      const strength = calculateStrength(pwd);
      return `${pwd}  [${strength.label}]`;
    });

    return lines.join("\n");
  }, [passwords]);

  const handleInputChange = useCallback(() => {}, []);

  const handleRegenerate = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const updateOption = <K extends keyof Options>(key: K, value: Options[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const firstPassword = passwords[0] || "";
  const strength = firstPassword ? calculateStrength(firstPassword) : null;

  return (
    <ToolLayout
      input=""
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Passwords auto-generated on the right →"
      outputPlaceholder="→ Secure passwords"
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Length:</label>
            <input
              type="number"
              min={4}
              max={128}
              value={options.length}
              onChange={(e) => updateOption("length", parseInt(e.target.value, 10) || 16)}
              className="w-16 bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Count:</label>
            <select
              value={options.count}
              onChange={(e) => updateOption("count", parseInt(e.target.value, 10))}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={options.lowercase ? "primary" : "ghost"}
              size="sm"
              onClick={() => updateOption("lowercase", !options.lowercase)}
              title="Include lowercase letters (a-z)"
            >
              a-z
            </Button>
            <Button
              variant={options.uppercase ? "primary" : "ghost"}
              size="sm"
              onClick={() => updateOption("uppercase", !options.uppercase)}
              title="Include uppercase letters (A-Z)"
            >
              A-Z
            </Button>
            <Button
              variant={options.numbers ? "primary" : "ghost"}
              size="sm"
              onClick={() => updateOption("numbers", !options.numbers)}
              title="Include numbers (0-9)"
            >
              0-9
            </Button>
            <Button
              variant={options.symbols ? "primary" : "ghost"}
              size="sm"
              onClick={() => updateOption("symbols", !options.symbols)}
              title="Include symbols (!@#$...)"
            >
              !@#
            </Button>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => updateOption("excludeAmbiguous", e.target.checked)}
              className="rounded border-border"
            />
            <span>Exclude ambiguous (il1Lo0O)</span>
          </label>

          {strength && (
            <span className={`text-xs font-medium ${strength.color}`}>
              {strength.label}
            </span>
          )}

          <Button variant="secondary" size="sm" onClick={handleRegenerate}>
            Regenerate
          </Button>
        </div>
      }
    />
  );
}
