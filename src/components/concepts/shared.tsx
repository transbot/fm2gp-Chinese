import { useLanguage } from '../../context/LanguageContext';
import { Matrix } from '../../lib/algorithms/concepts';
export function MatrixTable({ value, label, onSelect, selected, names, previous }: {
    value: Matrix;
    label: string;
    onSelect?: (i: number, j: number) => void;
    selected?: [
        number,
        number
    ];
    names?: string[];
    previous?: Matrix;
}) {
    const { lang } = useLanguage();
    return <div className="overflow-x-auto max-w-full" role="region" aria-label={label} tabIndex={0}><table className="border-separate border-spacing-1 text-center"><caption className="text-left font-semibold pb-2">{label}</caption><thead><tr><th /><>{value[0]?.map((_, j) => <th className="text-sm px-2" key={j}>{names?.[j] ?? j}</th>)}</></tr></thead><tbody>{value.map((row, i) => <tr key={i}><th className="text-sm px-2">{names?.[i] ?? i}</th>{row.map((n, j) => <td key={j}><button disabled={!onSelect} onClick={() => onSelect?.(i, j)} aria-pressed={selected?.[0] === i && selected?.[1] === j} aria-label={`${names?.[i] ?? i} → ${names?.[j] ?? j}: ${n}${previous && n !== previous[i][j] ? (lang === 'zh' ? '，已改变' : ', changed') : ''}`} className={`touch-target rounded-lg px-3 font-mono ${selected?.[0] === i && selected?.[1] === j ? 'bg-blue-600 text-white' : previous && n !== previous[i][j] ? 'bg-emerald-100 text-emerald-900' : selected && (selected[0] === i && selected[1] === -1 || selected[1] === j && selected[0] === -1) ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>{n}{previous && n !== previous[i][j] && <span aria-hidden="true"> *</span>}</button></td>)}</tr>)}</tbody></table></div>;
}
