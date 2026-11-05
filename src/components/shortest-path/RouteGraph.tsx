import { useId } from 'react';
import { BOOK_GRAPH, nodeLabel, routeLabel } from '../../lib/algorithms/shortest_path';

const positions = [[55, 85], [235, 45], [235, 365], [65, 255], [415, 90], [265, 235], [425, 315]];

interface Props {
  from: number;
  to: number;
  path: number[];
  isBest: boolean;
  lang: 'en' | 'zh';
}

export function RouteGraph({ from, to, path, isBest, lang }: Props) {
  const id = useId().replace(/:/g, '');
  const color = isBest ? '#047857' : '#b45309';
  const edges = BOOK_GRAPH.flatMap((row, source) => row.flatMap((weight, target) =>
    source !== target && Number.isFinite(weight) ? [{ source, target, weight }] : []));

  return (
    <svg viewBox="0 0 480 410" role="img" aria-label={lang === 'zh' ? `有向图，高亮路线：${routeLabel(path) || '无'}` : `Directed graph. Highlighted route: ${routeLabel(path) || 'none'}`}
      className="w-full h-auto" data-testid="route-graph" data-path={routeLabel(path)}>
      <defs>
        {[['muted', '#94a3b8'], ['active', color]].map(([name, fill]) => (
          <marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
          </marker>
        ))}
      </defs>
      {edges.map(({ source, target, weight }) => {
        const [x1, y1] = positions[source];
        const [x2, y2] = positions[target];
        const [cx, cy] = source === 2 && target === 0 ? [-50, 330]
          : source === 6 && target === 1 ? [560, -15] : [(x1 + x2) / 2, (y1 + y2) / 2];
        const startLength = Math.hypot(cx - x1, cy - y1);
        const endLength = Math.hypot(x2 - cx, y2 - cy);
        const sx = x1 + (cx - x1) * 24 / startLength;
        const sy = y1 + (cy - y1) * 24 / startLength;
        const ex = x2 - (x2 - cx) * 30 / endLength;
        const ey = y2 - (y2 - cy) * 30 / endLength;
        // Place curved-edge labels away from vertex circles, along the same curve.
        const labelT = source === 6 && target === 1 ? 0.7 : 0.5;
        const lx = (1 - labelT) ** 2 * sx + 2 * labelT * (1 - labelT) * cx + labelT ** 2 * ex;
        const ly = (1 - labelT) ** 2 * sy + 2 * labelT * (1 - labelT) * cy + labelT ** 2 * ey;
        const active = path.some((node, index) => node === source && path[index + 1] === target);
        return (
          <g key={`${source}-${target}`}>
            <path d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`} opacity={path.length > 0 && !active ? 0.5 : 1} fill="none" stroke={active ? color : '#94a3b8'} strokeWidth={active ? 4 : 1.8} markerEnd={`url(#${id}-${active ? 'active' : 'muted'})`} />
            <rect x={lx - 16} y={ly - 14} width="32" height="28" rx="7" fill={active ? (isBest ? '#d1fae5' : '#fef3c7') : '#fff'} />
            <text x={lx} y={ly + 7} textAnchor="middle" fontSize="20" fontWeight={active ? 700 : 500} fill={active ? color : '#475569'}>{weight}</text>
          </g>
        );
      })}
      {positions.map(([x, y], node) => (
        <g key={node}>
          <circle cx={x} cy={y} r="22" fill={node === from ? '#1d4ed8' : node === to ? '#0f172a' : '#fff'} stroke={path.includes(node) ? color : '#94a3b8'} strokeWidth={path.includes(node) ? 3 : 1.5} />
          <text x={x} y={y + 7} textAnchor="middle" fontSize="21" fontWeight="700" fill={node === from || node === to ? '#fff' : '#334155'}>{nodeLabel(node)}</text>
        </g>
      ))}
    </svg>
  );
}
