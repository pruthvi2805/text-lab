"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import { convertCase, caseOptions, CaseType } from "@/lib/tools/case";

export default function CaseConverterPage() {
  const [input, setInput] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("lower");

  const output = useMemo(() => {
    return convertCase(input, caseType);
  }, [input, caseType]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const selectedOption = caseOptions.find((o) => o.value === caseType);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste text here"
      outputPlaceholder={`→ ${selectedOption?.example || "converted text"}`}
      options={
        <div className="flex flex-wrap items-center gap-1">
          {caseOptions.map((option) => (
            <Button
              key={option.value}
              variant={caseType === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setCaseType(option.value)}
              title={option.example}
            >
              {option.label}
            </Button>
          ))}
        </div>
      }
    />
  );
}
