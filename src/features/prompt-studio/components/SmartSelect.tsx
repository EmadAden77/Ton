import { getFieldConstraints } from "../constraints";
import type { SelectOption } from "../options";
import type { SceneState } from "../types";

type SmartSelectProps = {
  id: string;
  field: keyof SceneState;
  state: SceneState;
  onChange: (value: string) => void;
  label: string;
  options: SelectOption[];
  className?: string;
};

export function SmartSelect({
  id,
  field,
  state,
  onChange,
  label,
  options,
  className = "",
}: SmartSelectProps) {
  const constraints = getFieldConstraints(field, state);
  const lockedTo = constraints?.lockedTo;
  const value = lockedTo ?? String(state[field] ?? "");

  return (
    <label className={`grid gap-2 ${className}`} htmlFor={id}>
      <span className="flex items-center gap-2">
        {lockedTo !== undefined && <span aria-hidden="true">🔒</span>}
        <span>{label}</span>
      </span>
      <select
        id={id}
        value={value}
        disabled={lockedTo !== undefined}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {options.map((option) => {
          const constraint = constraints?.options.find(
            (item) => item.value === option.value,
          );
          const disabled = constraint?.disabled ?? false;

          return (
            <option key={option.value} value={option.value} disabled={disabled}>
              {option.label}
              {disabled && constraint?.reason ? ` (${constraint.reason})` : ""}
            </option>
          );
        })}
      </select>
      {lockedTo !== undefined && constraints?.lockReason && (
        <span className="text-xs leading-5 text-amber-300">
          ↳ {constraints.lockReason}
        </span>
      )}
    </label>
  );
}
