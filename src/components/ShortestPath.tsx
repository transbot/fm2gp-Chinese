import { useState } from 'react';
import { ArrowLeft, ArrowRight, Home, Languages, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { ValidationMessage } from './common/ValidationMessage';
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';
import { BOOK_GRAPH, buildDistanceLayers, candidateRoutes, distanceLabel, nodeLabel, routeLabel } from '../lib/algorithms/shortest_path';
import { RouteGraph } from './shortest-path/RouteGraph';
import { ShortestPathNotes } from './shortest-path/ShortestPathNotes';

const layers = buildDistanceLayers(BOOK_GRAPH);
const powers = ['¹', '²', '³', '⁴', '⁵', '⁶'];
const nodes = BOOK_GRAPH.map((_, index) => index);

export function ShortestPath() {
  const [power, setPower] = useState(1);
  const [started, setStarted] = useState(false);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(5);
  const [via, setVia] = useState<number | null>(null);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
  const { lang, setLang } = useLanguage();
  const zh = lang === 'zh';
  const t = translations[lang];
  const matrix = layers[power - 1];
  const previous = power > 1 ? layers[power - 2] : null;
  const result = matrix[from][to];
  const candidates = previous ? candidateRoutes(previous, layers[0], from, to) : [];
  const reachable = candidates.filter(candidate => Number.isFinite(candidate.distance));
  const unreachable = candidates.filter(candidate => !Number.isFinite(candidate.distance));
  const inspected = candidates.find(candidate => candidate.via === via);
  const shownPath = inspected?.path ?? result.path;
  const shownDistance = inspected?.distance ?? result.distance;
  const isBest = shownDistance === result.distance;
  const changed = previous && result.distance < previous[from][to].distance;

  const showPower = (next: number) => {
    setPower(next);
    setVia(null);
    setValidationErrorKey(null);
  };
  const nextStep = () => {
    if (!started) return setValidationErrorKey('shortestPathStartFirst');
    if (power === layers.length) return setValidationErrorKey('shortestPathAlreadyComplete');
    showPower(power + 1);
  };
  const choosePair = (source: number, target: number) => {
    setFrom(source);
    setTo(target);
    setVia(null);
  };
  const example = (target: number, exponent: number) => {
    choosePair(0, target);
    showPower(exponent);
    setStarted(true);
  };

  return (
    <div className="safe-app-x safe-app-bottom max-w-6xl mx-auto py-4 sm:py-6 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link to="/" className="learning-secondary flex shrink-0 items-center justify-center gap-2"><Home size={16} />{t.backToHome}</Link>
          <h1 className="learning-title min-w-0">{t.shortestPathTitle}</h1>
        </div>
        <button onClick={() => setLang(zh ? 'en' : 'zh')} className="touch-target flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"><Languages size={16} />{t.language}</button>
      </header>

      <section className="learning-intro">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">{zh ? '第 8.6 节 · 从路线出发理解矩阵' : 'Section 8.6 · Routes first, matrices next'}</p>
        <h2 className="mt-3 text-2xl font-bold">{zh ? '接起来用加法，选路线取最小值。' : 'Add along a route. Take the minimum across routes.'}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-700">{zh ? '先追踪一对起终点：每前进一步，就多允许走一条边。看看哪些新路线能到达终点，再比较它们的总距离。' : 'Follow one start and destination. Each step allows one more edge: see which new routes reach the destination, then compare their total lengths.'}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => example(5, 2)} className="learning-secondary text-sm">{zh ? '例 1：A → F，比较两条路线' : 'Example 1: A → F, compare two routes'}</button>
          <button onClick={() => example(6, 3)} className="learning-secondary text-sm">{zh ? '例 2：A → G，需要三条边' : 'Example 2: A → G, three edges needed'}</button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-600">{zh ? '起点' : 'Start'}
              <select value={from} onChange={e => choosePair(Number(e.target.value), to)} className="touch-target mt-1 block w-24 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900">
                {nodes.map(node => <option key={node} value={node}>{nodeLabel(node)}</option>)}
              </select>
            </label>
            <ArrowRight size={18} className="mt-5 text-slate-400" aria-hidden="true" />
            <label className="text-sm font-semibold text-slate-600">{zh ? '终点' : 'Destination'}
              <select value={to} onChange={e => choosePair(from, Number(e.target.value))} className="touch-target mt-1 block w-24 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900">
                {nodes.map(node => <option key={node} value={node}>{nodeLabel(node)}</option>)}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {!started && <button onClick={() => { setStarted(true); showPower(1); }} className="touch-target flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"><Play size={16} />{t.startCalculation}</button>}
            {started && <button onClick={() => showPower(power - 1)} disabled={power === 1} className="touch-target flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40"><ArrowLeft size={16} />{zh ? '上一次幂' : 'Previous Power'}</button>}
            <button onClick={nextStep} className="touch-target flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"><ArrowRight size={16} />{t.nextPower}</button>
            <button onClick={() => { showPower(1); setStarted(false); choosePair(0, 5); }} className="touch-target flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><RotateCcw size={16} />{t.reset}</button>
          </div>
        </div>
        <ValidationMessage errorKey={validationErrorKey} messages={t} />
        <div className="grid grid-cols-6 gap-1 sm:gap-2" aria-label={zh ? '允许的边数' : 'Edge budget'}>
          {layers.map((_, index) => <button key={index} disabled={!started} onClick={() => showPower(index + 1)} aria-pressed={power === index + 1}
            aria-label={zh ? `最多 ${index + 1} 条边` : `At most ${index + 1} edges`}
            className={`touch-target rounded-lg border py-2 text-sm ${power === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 disabled:opacity-50'}`}>
            <span className="block font-bold">D{powers[index]}</span><span className="text-xs">{zh ? `${index + 1} 条边` : `${index + 1} ${index === 0 ? 'edge' : 'edges'}`}</span>
          </button>)}
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2" aria-live="polite">
          <h2 className="text-lg font-bold text-slate-900">{zh ? `最多走 ${power} 条边` : `At most ${power} ${power === 1 ? 'edge' : 'edges'}`}</h2>
          <p className="text-sm text-slate-500">{zh ? '“最多”是上限，不必把边数用满。' : 'This is a limit; a shorter route may use fewer edges.'}</p>
        </div>
        {power === layers.length && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{t.calculationComplete}</p>}
      </section>

      <div id="route-explorer" className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">{zh ? '① 在图上看路线' : '① Follow the route'}</h2>
            <span className="text-xs text-slate-500">{zh ? '箭头表示方向 · 数字是路段长度' : 'Arrows: direction · Numbers: edge lengths'}</span>
          </div>
          <RouteGraph from={from} to={to} path={shownPath} isBest={isBest} lang={lang} />
          <div className={`rounded-xl p-4 ${isBest ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`} aria-live="polite">
            <p className="text-xs font-semibold">{zh ? (isBest ? '当前最短路线' : '正在查看的候选路线') : (isBest ? 'Current shortest route' : 'Inspecting an alternative')}</p>
            <p className="mt-2 font-mono font-semibold text-lg">{shownPath.length ? routeLabel(shownPath) : (zh ? '在当前边数内尚不可达' : 'Not reachable within this edge budget')}</p>
            {shownPath.length > 0 && <p className="mt-2 text-sm">{shownPath.length > 1 ? shownPath.slice(1).map((node, i) => BOOK_GRAPH[shownPath[i]][node]).join(' + ') : '0'} = {distanceLabel(shownDistance)}</p>}
          </div>
          <p className="mt-3 text-xs text-slate-500">{zh ? '蓝色节点是起点，深色节点是终点；点击候选路线，图中的高亮会随之改变。' : 'Blue vertex: start; dark vertex: destination. Select an alternative to change the highlighted route.'}</p>
        </section>

        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">{zh ? '② 接起来，再比较' : '② Join, then compare'}</h2>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-blue-50 p-4">
            <div><p className="font-semibold text-slate-800">{nodeLabel(from)} → {nodeLabel(to)}</p><p className="text-xs mt-1 text-slate-600">{zh ? `最多 ${power} 条边的最短距离` : `Shortest distance with at most ${power} edges`}</p></div>
            <strong className="text-3xl text-blue-800 font-mono" data-testid="selected-distance">{distanceLabel(result.distance)}</strong>
          </div>
          {previous && <p className={`mt-3 text-sm font-medium ${changed ? 'text-emerald-700' : 'text-slate-600'}`}>
            {zh ? '上一步 → 这一步：' : 'Previous → current: '}{distanceLabel(previous[from][to].distance)} → {distanceLabel(result.distance)}
            {changed ? (zh ? ' · 找到了更短的路线' : ' · A shorter route is now available') : (zh ? ' · 这一对距离没有变化' : ' · This pair is unchanged')}
          </p>}
          {power === 1 ? <p className="mt-4 leading-7 text-slate-600">{zh ? '第一步只看直达边。如果没有直达边，就写 ∞；起点与终点相同时写 0。点击“下一次幂”，试着经过一个中转点。' : 'Start with direct edges only. Write ∞ when there is no direct edge, or 0 when start and destination coincide. Select Next Power to try a connection through another vertex.'}</p> : <>
            <p className="mt-4 text-sm leading-6 text-slate-600">{zh ? `把“最多 ${power - 1} 条边到达中转点 k”的距离，加上“k 到终点”的边长，再从所有接法中取最小值。` : `Add the distance to an intermediate vertex k (at most ${power - 1} edges) to the final edge from k to the destination, then take the minimum over all choices.`}</p>
            <p className="mt-2 text-xs text-slate-500">{zh ? '中转点也可以是起点或终点：对角线的 0 允许原地不动。' : 'k can also be the start or destination: a diagonal 0 permits staying put.'}</p>
            <div className="mt-4 space-y-2">
              {reachable.map(candidate => {
                const best = candidate.distance === result.distance;
                return <button key={candidate.via} onClick={() => setVia(candidate.via)} aria-pressed={via === candidate.via}
                  className={`w-full rounded-xl border p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${best ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-amber-50'} ${via === candidate.via ? 'ring-2 ring-blue-500' : ''}`}>
                  <span className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>{routeLabel(candidate.path)}</span><span className={best ? 'text-emerald-800' : 'text-slate-500'}>{best ? (zh ? '最短候选' : 'Minimum') : (zh ? '更长' : 'Longer')}</span></span>
                  <span className="mt-1 block font-mono text-lg">{distanceLabel(candidate.left)} + {distanceLabel(candidate.right)} = {distanceLabel(candidate.distance)}</span>
                  <span className="mt-1 block text-xs text-slate-500">k = {nodeLabel(candidate.via)}{candidate.via === to ? (zh ? ' · 最后留在原地' : ' · Stay put at the end') : ''}</span>
                </button>;
              })}
            </div>
            {unreachable.length > 0 && <details className="mt-3 text-sm text-slate-500"><summary className="cursor-pointer py-2">{zh ? `另有 ${unreachable.length} 个接法暂时不通` : `${unreachable.length} other connections are unavailable`}</summary>
              <ul className="mt-2 space-y-2">{unreachable.map(candidate => <li key={candidate.via} className="font-mono">k = {nodeLabel(candidate.via)}: {distanceLabel(candidate.left)} + {distanceLabel(candidate.right)} = ∞</li>)}</ul>
            </details>}
            <p className="mt-4 rounded-lg bg-slate-100 p-3 font-mono text-sm break-words">min({candidates.map(candidate => distanceLabel(candidate.distance)).join(', ')}) = {distanceLabel(result.distance)}</p>
          </>}
        </section>
      </div>

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">{zh ? '③ 把所有起终点的答案放进一张表' : '③ Put every pair’s answer in one table'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{zh ? `行是起点，列是终点。蓝框选中 ${nodeLabel(from)} → ${nodeLabel(to)}；浅绿色表示比上一次幂变短的格子。点击任一格子，就能查看它在图上对应的路线。` : `Rows are starts; columns are destinations. The blue outline selects ${nodeLabel(from)} → ${nodeLabel(to)}. Pale green marks a decrease from the previous power. Select any cell to inspect its route on the graph.`}</p>
        {previous && <p className="my-3 text-sm font-mono text-slate-700">D{powers[power - 1]}[{nodeLabel(from)}, {nodeLabel(to)}] = minₖ (D{powers[power - 2]}[{nodeLabel(from)}, k] + D[k, {nodeLabel(to)}])</p>}
        <ResponsiveVisualFrame label={zh ? '最短路径距离矩阵' : 'Shortest path distance matrix'} minWidth={320} className="mt-4">
          <table className="w-full table-fixed text-sm border-separate border-spacing-1">
            <caption className="text-left pb-3 text-slate-500">D{powers[power - 1]} · {zh ? `最多 ${power} 条边，∞ 表示在此边数内不可达` : `At most ${power} edges; ∞ means unreachable within this budget`}</caption>
            <thead><tr><th className="text-xs text-slate-500">{zh ? '起/终' : 'From / to'}</th>{nodes.map(node => <th key={node} scope="col" className={`h-10 rounded ${node === to ? 'bg-blue-100 text-blue-900' : 'text-slate-600'}`}>{nodeLabel(node)}</th>)}</tr></thead>
            <tbody>{matrix.map((row, source) => <tr key={source}><th scope="row" className={`rounded ${source === from ? 'bg-blue-100 text-blue-900' : 'text-slate-600'}`}>{nodeLabel(source)}</th>
              {row.map((cell, target) => {
                const selected = source === from && target === to;
                const improved = previous && cell.distance < previous[source][target].distance;
                return <td key={target}><button onClick={() => choosePair(source, target)} aria-label={`${nodeLabel(source)} → ${nodeLabel(target)}: ${distanceLabel(cell.distance)}`} aria-pressed={selected}
                  className={`min-h-[44px] w-full rounded-lg font-mono ${selected ? 'bg-blue-600 text-white ring-2 ring-blue-700 ring-offset-1' : improved ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'}`}>{distanceLabel(cell.distance)}</button></td>;
              })}
            </tr>)}</tbody>
          </table>
        </ResponsiveVisualFrame>
      </section>

      <ShortestPathNotes lang={lang} />
      <Links lang={lang} />
    </div>
  );
}
