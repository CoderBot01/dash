import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

type FieldType = "text" | "number" | "date" | "textarea" | "select";

interface SelectOption {
  value: string;
  label: string;
}

interface InlineEditFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: FieldType;
  options?: SelectOption[];
  className?: string;
  displayValue?: string;
}

export function InlineEditField({
  value,
  onChange,
  type = "text",
  options,
  className = "",
  displayValue,
}: InlineEditFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [editing]);

  const save = () => {
    setEditing(false);
    const newVal = type === "number" ? Number(draft) || 0 : draft;
    if (newVal !== value) onChange(newVal);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(String(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") cancel();
  };

  if (!editing) {
    return (
      <span
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className={`group/edit inline-flex items-center gap-1 cursor-pointer rounded px-1 -mx-1 hover:bg-accent transition-colors ${className}`}
        title="Click to edit"
      >
        <span>{displayValue ?? String(value)}</span>
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity shrink-0" />
      </span>
    );
  }

  const inputClasses = "rounded border bg-background px-2 py-1 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  if (type === "select" && options) {
    return (
      <select
        ref={inputRef as React.RefObject<HTMLSelectElement>}
        value={draft}
        onChange={(e) => { setDraft(e.target.value); }}
        onBlur={save}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={`${inputClasses} ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        rows={2}
        className={`${inputClasses} w-full resize-none ${className}`}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type === "number" ? "number" : type === "date" ? "date" : "text"}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      className={`${inputClasses} ${type === "number" ? "w-28" : type === "date" ? "w-40" : "w-full"} ${className}`}
    />
  );
}
