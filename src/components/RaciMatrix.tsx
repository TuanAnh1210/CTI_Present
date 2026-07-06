import { roleOrder } from "../data/roles";
import type { RaciRow } from "../data/raci";

export function RaciMatrix({ rows }: { rows: RaciRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="p-3 text-left">Section</th>
            {roleOrder.map((role) => <th key={role} className="p-3 text-center">{role}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sectionId} className="border-t border-slate-100">
              <td className="p-3 font-bold text-slate-700">{row.sectionTitle}</td>
              {roleOrder.map((role) => (
                <td key={role} className="p-3 text-center">
                  {row.values[role] && <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-black text-white">{row.values[role]}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
