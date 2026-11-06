import {useLanguage} from '../../context/LanguageContext';
import type {ProofRow} from '../../data/groupProofs';
import {ReadingDetail} from './ReadingTools';

export function GroupProof({id,title,rows}:{id:string;title:string;rows:ProofRow[]}) {
  const zh = useLanguage().lang==='zh';
  return <ReadingDetail id={id} label={title}>
    <ol className="list-decimal space-y-3 pl-6">{rows.map(([stepId,formula,z,en])=><li key={stepId}>
      <code className="mb-2 block break-words">{formula}</code>
      <ReadingDetail id={stepId} label={<>{zh?'查看本步依据':'Why this step is valid'}<span className="sr-only">: {formula}</span></>}>
        <p>{zh?z:en}</p>
      </ReadingDetail>
    </li>)}</ol>
  </ReadingDetail>;
}
