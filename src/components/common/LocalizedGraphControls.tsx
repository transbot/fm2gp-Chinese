import { Controls, ControlButton, useReactFlow, useStore, useStoreApi } from 'reactflow';
import { useLanguage } from '../../context/LanguageContext';
export function LocalizedGraphControls() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const flow = useReactFlow(), store = useStoreApi();
    const interactive = useStore(s => s.nodesDraggable || s.nodesConnectable || s.elementsSelectable);
    const actions = [
        { label: zh ? '放大' : 'Zoom in', symbol: '+', run: () => flow.zoomIn() },
        { label: zh ? '缩小' : 'Zoom out', symbol: '−', run: () => flow.zoomOut() },
        { label: zh ? '适合画布' : 'Fit view', symbol: '↔', run: () => flow.fitView() },
        { label: zh ? '切换交互' : 'Toggle interactivity', symbol: interactive ? '◇' : '◆', run: () => store.setState({ nodesDraggable: !interactive, nodesConnectable: !interactive, elementsSelectable: !interactive }) },
    ];
    return <Controls showZoom={false} showFitView={false} showInteractive={false}>{actions.map(a => <ControlButton key={a.symbol} title={a.label} aria-label={a.label} onClick={a.run} style={{ width: 44, height: 44 }}>{a.symbol}</ControlButton>)}</Controls>;
}
