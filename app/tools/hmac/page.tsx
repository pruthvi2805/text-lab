"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Algorithm = "SHA-256" | "SHA-384" | "SHA-512" | "SHA-1";
type OutputFormat = "hex" | "base64";

const ALGORITHMS: { value: Algorithm; label: string; bits: number }[] = [
  { value: "SHA-256", label: "SHA-256", bits: 256 },
  { value: "SHA-384", label: "SHA-384", bits: 384 },
  { value: "SHA-512", label: "SHA-512", bits: 512 },
  { value: "SHA-1", label: "SHA-1", bits: 160 },
];

async function generateHMAC(
  message: string,
  secret: string,
  algorithm: Algorithm,
  outputFormat: OutputFormat
): Promise<string> {
  if (!message || !secret) return "";

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  // Import the key
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );

  // Generate the signature
  const signature = await crypto.subtle.sign("HMAC", key, messageData);

  // Convert to desired format
  if (outputFormat === "base64") {
    const bytes = new Uint8Array(signature);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  // Hex format
  const bytes = new Uint8Array(signature);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HMACPage() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
  const [hmac, setHmac] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!message || !secret) {
      setHmac("");
      return;
    }

    setIsProcessing(true);
    generateHMAC(message, secret, algorithm, outputFormat)
      .then(setHmac)
      .catch(() => setHmac("Error generating HMAC"))
      .finally(() => setIsProcessing(false));
  }, [message, secret, algorithm, outputFormat]);

  const output = useMemo(() => {
    if (!message.trim()) return "";
    if (!secret.trim()) return "Enter a secret key above";

    const algoInfo = ALGORITHMS.find((a) => a.value === algorithm);
    const lines = [
      "═══════════════════════════════════════════════════════════════════",
      `                        HMAC-${algorithm}`,
      "═══════════════════════════════════════════════════════════════════",
      "",
      `Algorithm:    ${algorithm} (${algoInfo?.bits} bits)`,
      `Output:       ${outputFormat.toUpperCase()}`,
      `Message size: ${new TextEncoder().encode(message).length} bytes`,
      `Key size:     ${new TextEncoder().encode(secret).length} bytes`,
      "",
      "───────────────────────────────────────────────────────────────────",
      "",
      hmac || (isProcessing ? "Computing..." : ""),
      "",
      "───────────────────────────────────────────────────────────────────",
    ];

    if (hmac && outputFormat === "hex") {
      lines.push("");
      lines.push(`Length: ${hmac.length} hex characters (${hmac.length / 2} bytes)`);
    }

    return lines.join("\n");
  }, [message, secret, algorithm, outputFormat, hmac, isProcessing]);

  const handleInputChange = useCallback((value: string) => {
    setMessage(value);
  }, []);

  return (
    <ToolLayout
      input={message}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter the message to sign..."
      outputPlaceholder="→ HMAC signature"
      isProcessing={isProcessing}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-xs text-text-muted whitespace-nowrap">Secret Key:</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret key..."
              className="flex-1 bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {ALGORITHMS.map((algo) => (
              <Button
                key={algo.value}
                variant={algorithm === algo.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setAlgorithm(algo.value)}
                title={`${algo.bits} bits`}
              >
                {algo.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={outputFormat === "hex" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setOutputFormat("hex")}
            >
              Hex
            </Button>
            <Button
              variant={outputFormat === "base64" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setOutputFormat("base64")}
            >
              Base64
            </Button>
          </div>
        </div>
      }
    />
  );
}
