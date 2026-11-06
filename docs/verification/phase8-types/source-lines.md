# 源码行对照与固定结果

四张卡引用已发布基线 `bdc1749f2e083393f1af013f83c000cda401d1df` 的配套代码。行号属于源文件。正文引用书中的节和定义。

| 卡片 | 文件与行 | 核对内容 |
|---|---|---|
| C.1 模板函数 | [ch07.h L179–192](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07.h#L179-L192) · [ch07_6.cpp L48–53](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07_6.cpp#L48-L53) | 四参数重载。实参 r 和 a 共同推导 A，返回类型使用同一个 A；n 推导 N，multiply 的闭包类型推导 Op。真实调用给出 486。 |
| C.2 原著写法 | [ch07.h L28–34](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07.h#L28-L34) · [L179–183](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07.h#L179-L183) | Regular、SemigroupOperation、Integer 展开为 typename；Domain 是注释。|
| C.2 中文版写法 | [ch07_6.cpp L15–32](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07_6.cpp#L15-L32) | requires 和 same_as 检查调用与结果类型。减法表达式可通过编译；三元组 (5,3,1) 得 1、3；从 5 减两次 3 的三元组 (5,3,3) 得 −1、5。只有后者是累积算法的伴读反例。 |
| C.4 函数对象 | [ch07_6.cpp L35–42](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07_6.cpp#L35-L42) · [L68–73](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07_6.cpp#L68-L73) | 先执行 op(r,a)，随后 op(a,a)。字符串调用 r 为 `"Result: "`，a 为 `"b"`，n 为 3，输出 `Result: bbb`。固定预期按整行精确比较。 |
| C.5 调用约定 | [ch07.h L179–187](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07.h#L179-L187) · [ch07_6.cpp L45–63](https://github.com/transbot/fm2gp-Chinese/blob/bdc1749f2e083393f1af013f83c000cda401d1df/%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81%28fm2gpcode%29/ch07_6.cpp#L45-L63) | n≥0；n=0 时返回 r。乘法、加法分别从 r=2 累积到 486、17；对应纯幂为 243、15。n=0 时两个累积结果都是 2，纯幂返回 1、0。my_ratio 是附录原书例，非此头文件中的函数。 |

## 运行核对

[MSVC C++20 原程序输出及额外断言](cpp.txt)。原程序由基线的 ch07_6.cpp 原样编译。补充驱动复用了同一文件的概念和函数，在未定义 NDEBUG 的构建中执行下列断言：

```cpp
auto minus = [](int x,int y){return x-y;};
static_assert(SemigroupOperation<decltype(minus), int>);
int calls=0;
auto times = [&calls](int x,int y){++calls;return x*y;};
assert(power_accumulate_semigroup(2,3,0,times)==2 && calls==0);
assert((5-3)-3==-1 && power_accumulate_semigroup(5,3,2,minus)==5);
```

生产预览另外通过实际代数演示分别设置两组减法数据，并在真实 /power 页读回四个纯幂结果。10.2 使用定义 10.1–10.5；10.3 的栈例与三类概念要求引出前向、随机访问迭代器的实际移动比较。
