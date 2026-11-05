import type { TraceLine } from '../common/TraceCode';
import type { Phase, ReverseError, ReverseEvent, ReverseFunction, ReverseMethod } from '../../lib/algorithms/reverseTrace';
export const reverseNames:Record<ReverseMethod,[string,string]>={bidirectional:['双向反转','Bidirectional reverse'],recursive:['前向递归反转','Forward recursive reverse'],adaptive:['自适应反转','Adaptive reverse']};
export const reverseErrors:Record<ReverseError,[string,string]>={empty:['待填写：请输入序列，或选择“空序列”预设。','Enter a sequence, or select the explicit Empty sequence preset.'],integer:['每项必须是十进制安全整数；不能省略中间项或使用小数、指数。','Each item must be a decimal safe integer; missing items, decimals, and exponents are not accepted.'],length:['最多支持50个元素，以保留完整回放。','At most 50 elements are supported, with complete replay.'],capacity:['缓冲容量必须是0至50的十进制整数。','Buffer capacity must be a decimal integer from 0 to 50.']};
export const reversePhases:Record<Phase,[string,string]>={enter:['进入调用','Entering call'],left:['等待左半返回','Waiting for left half'],middle:['左半已返回，处理中点','Left half returned; handling midpoint'],right:['处理右半','Processing right half'],swap:['交换两个半区','Swapping halves'],buffer:['使用共享缓冲区','Using shared buffer'],return:['返回','Returning']};
export const reverseMessages:Record<ReverseEvent,[string,string]>={
 init:['已应用输入，尚未进入算法。三个播放器可独立操作。','Input applied; the algorithm has not started. Each player runs independently.'],
 enter:['进入当前函数；下方显示其局部变量。反转调用层数不包含辅助函数。','Enter the current function; its locals appear below. Reversal depth excludes helper functions.'],
 check:['刚执行条件检查或循环变量更新；数据和计数保持对应语句执行后的状态。','A condition or loop-variable update just executed; data and counts show the post-statement state.'],
 baseReturn:['基础情况直接返回：n＝0返回f，n＝1返回++f。无需缓冲区或交换。','Return directly in the base case: n=0 returns f; n=1 returns ++f. No buffer or swap is needed.'],
 split:['h＝⌊n/2⌋：两个半区长度相同；奇数长度的中间元素留在原位。','h=⌊n/2⌋: both halves have equal length; an odd-length range keeps its middle element in place.'],
 leftCall:['调用左半反转，当前父帧等待返回位置m。','Call reversal on the left half; the parent waits for returned position m.'],
 leftReturned:['左半已反转，返回位置保存为m；父帧的f仍是原来的起点。','The left half is reversed; its return is saved as m. The parent’s f still marks its original start.'],
 middle:['按n的奇偶性将m前进0或1步，跳过不参与半区交换的中间元素。','Advance m by 0 or 1 according to the parity of n, skipping the middle element when present.'],
 rightCall:['从m开始反转右半；当前父帧等待返回位置l。','Reverse the right half starting at m; the parent waits for return position l.'],
 rightReturned:['右半已反转，l指向当前子区间的尾后位置。接下来交换两个半区。','The right half is reversed; l points past this subrange. Next, exchange the two halves.'],
 swapCall:['开始交换两个半区。辅助函数取得f、m的副本，不移动父帧中的这两个迭代器。','Start exchanging halves. The helper receives copies of f and m; the parent’s iterators do not move.'],
 swap:['已完成一次交换，并移动源码中的后置递增游标。一次复制构造和两次赋值共计3次元素传送；原始位置标签随值移动。','One swap completed, including the source’s post-increments. One copy construction and two assignments count as 3 element transfers; origin tags move with values.'],
 swapReturn:['两个半区交换完成。辅助游标的返回值未被反转函数使用，父帧f、m保持原值。','The halves have been exchanged. Reversal does not use the helper’s returned cursors; parent f and m remain unchanged.'],
 return:['当前反转调用完成。前向版本返回本子区间的尾后位置，双向版本返回void。','This reversal call is complete. Forward versions return the position past the subrange; the bidirectional version returns void.'],
 bufferCheck:['基础情况已经排除，现在检查n是否不超过缓冲容量。','Base cases have been excluded; now test whether n fits the buffer capacity.'],
 bufferCall:['进入缓冲分支，复用唯一的共享缓冲区；本次有效范围从空开始。','Enter the buffer branch and reuse the single shared buffer; this use begins with an empty valid range.'],
 copy:['将原序列的一个元素复制到缓冲区。两侧游标已前进；缓冲写入和传送各增加1。','Copy one source element into the buffer. Both cursors have advanced; buffer writes and transfers each increase by 1.'],
 copyReturn:['copy_n返回buffer_end：这是缓冲区本次有效范围的尾后位置，不能读取。','copy_n returns buffer_end, the past-the-end position of this valid buffer range; it cannot be read.'],
 write:['先将缓冲区右游标减1，再读取有效元素并写回原序列；原序列游标随后前进。回写和传送各增加1。','Decrement the buffer’s right cursor before reading a valid element and writing it to the sequence; then advance the source cursor. Writebacks and transfers each increase by 1.'],
 writeReturn:['reverse_copy返回原序列中的尾后位置，区别于copy_n返回的缓冲区位置。','reverse_copy returns a past-the-end position in the sequence, distinct from the buffer position returned by copy_n.'],
 done:['全部反转完成。可回看、拖动进度或重播；这些操作不增加算法计数。','Reversal is complete. Step back, seek, or replay; these controls do not add algorithm operations.'],
};
const lines=(entries:[string,string][]):TraceLine[]=>entries.map(([id,text])=>({id,text}));
const recursive=(adaptive:boolean):TraceLine[]=>lines([
 ['entry',adaptive?'I reverse_n_adaptive(I f, N n, B buffer, N bufsize) {':'I reverse_recursive(I f, N n) {'],
 ['zero',adaptive?'  if (n == N(0)) return f;':'  if (n == 0) return f;'],
 ['one',adaptive?'  if (n == N(1)) return ++f;':'  if (n == 1) return ++f;'],
 ...(adaptive? [['fits','  if (n <= bufsize) return reverse_n_with_buffer(f, n, buffer);'] as [string,string]]:[]),
 ['half','  N h = n >> 1;'],['left',adaptive?'  I m = reverse_n_adaptive(f, h, buffer, bufsize);':'  I m = reverse_recursive(f, h);'],
 ['middle',adaptive?'  advance(m, n & 1);':'  if (odd(n)) ++m;'],['right',adaptive?'  I l = reverse_n_adaptive(m, h, buffer, bufsize);':'  I l = reverse_recursive(m, h);'],
 ['ranges','  swap_ranges_n(f, m, h);'],['return','  return l;'],['close','}'],
]);
export const reverseCode:Record<ReverseFunction,TraceLine[]>={
 bidirectional:lines([['entry','void reverse(I f, I l, std::bidirectional_iterator_tag) {'],['loop','  while (f != l && f != --l)'],['swap','    fmgp::swap(*f++, *l);'],['return','}']]),
 recursive:recursive(false),adaptive:recursive(true),
 swap_ranges_n:lines([['entry','std::pair<I0, I1> swap_ranges_n(I0 first0, I1 first1, N n) {'],['loop','  while (n != N(0)) {'],['swap','    fmgp::swap(*first0++, *first1++);'],['decrement','    --n;'],['closeLoop','  }'],['return','  return {first0, first1};'],['close','}']]),
 reverse_n_with_buffer:lines([['entry','I reverse_n_with_buffer(I f, N n, B buffer) {'],['copy','  B buffer_end = copy_n(f, n, buffer);'],['write','  return fmgp::reverse_copy(buffer, buffer_end, f);'],['close','}']]),
 copy_n:lines([['entry','copy_n(source, n, buffer) {'],['copy','  repeat n times: *buffer++ = *source++;'],['return','  return buffer;'],['close','}']]),
 reverse_copy:lines([['entry','O reverse_copy(I f, I l, O result) {'],['loop','  while (f != l)'],['write','    *result++ = *--l;'],['return','  return result;'],['close','}']]),
};
