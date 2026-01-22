"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";

interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

function permissionsToOctal(perms: Permissions): string {
  const calc = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);

  return `${calc(perms.owner)}${calc(perms.group)}${calc(perms.others)}`;
}

function permissionsToSymbolic(perms: Permissions): string {
  const format = (p: { read: boolean; write: boolean; execute: boolean }) =>
    `${p.read ? "r" : "-"}${p.write ? "w" : "-"}${p.execute ? "x" : "-"}`;

  return `-${format(perms.owner)}${format(perms.group)}${format(perms.others)}`;
}

function octalToPermissions(octal: string): Permissions | null {
  const cleaned = octal.replace(/^0o?/, "").trim();
  if (!/^[0-7]{3}$/.test(cleaned)) return null;

  const parse = (digit: string) => {
    const n = parseInt(digit, 8);
    return {
      read: (n & 4) !== 0,
      write: (n & 2) !== 0,
      execute: (n & 1) !== 0,
    };
  };

  return {
    owner: parse(cleaned[0]),
    group: parse(cleaned[1]),
    others: parse(cleaned[2]),
  };
}

function symbolicToPermissions(symbolic: string): Permissions | null {
  const cleaned = symbolic.trim().replace(/^[-d]/, "");
  if (!/^[rwx-]{9}$/.test(cleaned)) return null;

  const parse = (str: string) => ({
    read: str[0] === "r",
    write: str[1] === "w",
    execute: str[2] === "x",
  });

  return {
    owner: parse(cleaned.slice(0, 3)),
    group: parse(cleaned.slice(3, 6)),
    others: parse(cleaned.slice(6, 9)),
  };
}

const COMMON_PERMISSIONS = [
  { octal: "755", desc: "Executables, public dirs", symbolic: "-rwxr-xr-x" },
  { octal: "644", desc: "Regular files", symbolic: "-rw-r--r--" },
  { octal: "777", desc: "Full access (use sparingly)", symbolic: "-rwxrwxrwx" },
  { octal: "700", desc: "Private executables", symbolic: "-rwx------" },
  { octal: "600", desc: "Private files", symbolic: "-rw-------" },
  { octal: "750", desc: "Group-shared programs", symbolic: "-rwxr-x---" },
  { octal: "640", desc: "Group-readable files", symbolic: "-rw-r-----" },
  { octal: "444", desc: "Read-only for all", symbolic: "-r--r--r--" },
];

export default function ChmodPage() {
  const [permissions, setPermissions] = useState<Permissions>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
  });
  const [input, setInput] = useState("");

  const octal = useMemo(() => permissionsToOctal(permissions), [permissions]);
  const symbolic = useMemo(() => permissionsToSymbolic(permissions), [permissions]);

  const output = useMemo(() => {
    const lines = [
      "═══════════════════════════════════════",
      "           CHMOD PERMISSION CALCULATOR",
      "═══════════════════════════════════════",
      "",
      "CURRENT PERMISSIONS",
      "",
      `  Numeric:   ${octal}`,
      `  Symbolic:  ${symbolic}`,
      "",
      "CHMOD COMMANDS",
      "",
      `  chmod ${octal} filename`,
      `  chmod u=${permissions.owner.read ? "r" : ""}${permissions.owner.write ? "w" : ""}${permissions.owner.execute ? "x" : ""},g=${permissions.group.read ? "r" : ""}${permissions.group.write ? "w" : ""}${permissions.group.execute ? "x" : ""},o=${permissions.others.read ? "r" : ""}${permissions.others.write ? "w" : ""}${permissions.others.execute ? "x" : ""} filename`,
      "",
      "BREAKDOWN",
      "",
      "         READ    WRITE   EXECUTE",
      `  Owner:  ${permissions.owner.read ? "✓" : "✗"}       ${permissions.owner.write ? "✓" : "✗"}       ${permissions.owner.execute ? "✓" : "✗"}`,
      `  Group:  ${permissions.group.read ? "✓" : "✗"}       ${permissions.group.write ? "✓" : "✗"}       ${permissions.group.execute ? "✓" : "✗"}`,
      `  Others: ${permissions.others.read ? "✓" : "✗"}       ${permissions.others.write ? "✓" : "✗"}       ${permissions.others.execute ? "✓" : "✗"}`,
      "",
      "═══════════════════════════════════════",
      "",
      "COMMON PERMISSIONS",
      "",
    ];

    COMMON_PERMISSIONS.forEach((p) => {
      const marker = p.octal === octal ? "→ " : "  ";
      lines.push(`${marker}${p.octal}  ${p.symbolic}  ${p.desc}`);
    });

    return lines.join("\n");
  }, [permissions, octal, symbolic]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);

    // Try to parse as octal
    const fromOctal = octalToPermissions(value);
    if (fromOctal) {
      setPermissions(fromOctal);
      return;
    }

    // Try to parse as symbolic
    const fromSymbolic = symbolicToPermissions(value);
    if (fromSymbolic) {
      setPermissions(fromSymbolic);
    }
  }, []);

  const togglePermission = (
    role: "owner" | "group" | "others",
    perm: "read" | "write" | "execute"
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm],
      },
    }));
  };

  const PermissionCheckbox = ({
    role,
    perm,
    label,
  }: {
    role: "owner" | "group" | "others";
    perm: "read" | "write" | "execute";
    label: string;
  }) => (
    <label className="flex items-center gap-1 cursor-pointer">
      <input
        type="checkbox"
        checked={permissions[role][perm]}
        onChange={() => togglePermission(role, perm)}
        className="rounded border-border"
      />
      <span className="text-xs">{label}</span>
    </label>
  );

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter octal (755) or symbolic (rwxr-xr-x)..."
      outputPlaceholder="→ Permission details"
      options={
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium w-12">Owner:</span>
            <PermissionCheckbox role="owner" perm="read" label="r" />
            <PermissionCheckbox role="owner" perm="write" label="w" />
            <PermissionCheckbox role="owner" perm="execute" label="x" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium w-12">Group:</span>
            <PermissionCheckbox role="group" perm="read" label="r" />
            <PermissionCheckbox role="group" perm="write" label="w" />
            <PermissionCheckbox role="group" perm="execute" label="x" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium w-12">Others:</span>
            <PermissionCheckbox role="others" perm="read" label="r" />
            <PermissionCheckbox role="others" perm="write" label="w" />
            <PermissionCheckbox role="others" perm="execute" label="x" />
          </div>

          <div className="flex items-center gap-2 px-2 py-1 bg-bg-surface rounded">
            <code className="text-accent font-mono">{octal}</code>
            <span className="text-text-muted">/</span>
            <code className="text-accent font-mono">{symbolic}</code>
          </div>
        </div>
      }
    />
  );
}
