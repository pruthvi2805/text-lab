"use client";

import { useEffect, useRef } from "react";
import { EditorState, Extension, Compartment } from "@codemirror/state";
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  extensions = [],
  className = "",
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const placeholderCompartmentRef = useRef(new Compartment());

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChangeRef.current) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const baseExtensions: Extension[] = [
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      oneDark,
      EditorView.lineWrapping,
      updateListener,
      placeholderCompartmentRef.current.of(placeholder ? placeholderExt(placeholder) : []),
      ...extensions,
    ];

    if (readOnly) {
      baseExtensions.push(EditorState.readOnly.of(true));
    }

    const state = EditorState.create({
      doc: value,
      extensions: baseExtensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only run on mount - extensions and readOnly don't change dynamically
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update placeholder when it changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: placeholderCompartmentRef.current.reconfigure(
        placeholder ? placeholderExt(placeholder) : []
      ),
    });
  }, [placeholder]);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-hidden [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto [&_.cm-gutters]:bg-bg-panel [&_.cm-gutters]:border-r [&_.cm-gutters]:border-border [&_.cm-activeLineGutter]:bg-bg-hover ${className}`}
    />
  );
}
