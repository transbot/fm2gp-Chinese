export function ShortestPathNotes({ lang }: { lang: 'en' | 'zh' }) {
  const zh = lang === 'zh';
  const notes = zh ? [
    ['矩阵与矩阵幂', '矩阵就是一张表：行是起点，列是终点，格子里写距离。这里的矩阵幂不是把每个格子里的数字分别乘方，而是把整张表按同一套规则反复“相乘”，把短路线接成长路线。'],
    ['热带半环', '先记住两条规则：沿着同一条路线走，路段长度相加；有多条路线可选，取总长度最小的那条。“热带半环”是这套运算的数学名称：用 min（取较小值）代替普通加法，用加法代替普通乘法。'],
    ['0、∞ 与“最多”', '对角线上的 0 表示留在原地，不增加路程；∞ 表示当前允许的边数内还到不了，并不一定永远到不了。因为可以用 0 原地等待，D 的 p 次幂记录的是“最多走 p 条边”的最短距离。'],
    ['为什么算到 6 就够了？', '图里有 7 个节点，且没有负环（绕一圈反而让总距离变小的回路）。最短路线不需要重复绕圈，所以最多经过 6 条边。此时整张表才保证给出所有起点到终点的最短距离。'],
    ['泛型编程：换规则，复用算法', '泛型编程让算法不必绑死在一种数据或运算上。第 7.5 节通过“折半、平方、累积”求幂；把操作数换成矩阵，再把矩阵乘法内部的运算换成上述规则，这个求幂过程仍然适用。这里逐次展示 D¹ 到 D⁶ 是为了看清变化，计算每个幂时仍使用反复平方。'],
  ] : [
    ['Matrices and matrix powers', 'A matrix is a table: rows are starting points, columns are destinations, and cells hold distances. A matrix power does not raise each cell separately to a power. It repeatedly combines whole tables using one product rule, joining shorter routes into longer ones.'],
    ['Tropical semiring', 'Remember two rules first: add segment lengths along one route; choose the smallest total among alternative routes. “Tropical semiring” is the mathematical name for these operations: min (take the smaller value) replaces ordinary addition, and addition replaces ordinary multiplication.'],
    ['0, ∞ and “at most”', 'A diagonal 0 means staying at a vertex without adding distance. ∞ means unreachable within the current edge budget, not necessarily unreachable forever. Zero-cost stays let D to the power p represent shortest distances using at most p edges.'],
    ['Why stop at 6?', 'The graph has 7 vertices and no negative cycle (a loop that reduces the total distance each time around). A shortest route need not repeat a cycle, so at most 6 edges suffice. Only then is the entire table guaranteed to contain shortest distances for every pair.'],
    ['Generic programming: change the operation, reuse the algorithm', 'Generic programming avoids tying an algorithm to just one data type or operation. Section 7.5 computes powers by halving, squaring, and accumulating. Use matrices as operands and the two rules above inside matrix multiplication, and the same power procedure still works. We display D¹ through D⁶ consecutively to explain the changes, while computing each power by repeated squaring.'],
  ];
  return (
    <section aria-labelledby="shortest-notes" className="rounded-2xl bg-amber-50 border border-amber-200 p-5 sm:p-6">
      <h2 id="shortest-notes" className="text-xl font-bold text-amber-950">{zh ? '开发者笔记 · 把术语翻译成直觉' : 'Developer notes · Terms in plain language'}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {notes.map(([title, body]) => <div key={title}><h3 className="font-semibold text-amber-950">{title}</h3><p className="mt-2 text-sm leading-7 text-amber-900">{body}</p></div>)}
      </div>
    </section>
  );
}
