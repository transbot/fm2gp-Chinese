// C++20已正式支持“概念”。对于此例，可定义如下概念：
#include <iterator>

template <typename I0, typename I1>
concept SameValueType = std::same_as<std::iter_value_t<I0>, std::iter_value_t<I1>>;

// 随后，用requires子句替换原注释：
template <std::forward_iterator I0, std::forward_iterator I1>
requires SameValueType<I0, I1>
I1 swap_ranges(I0 first0, I0 last0, I1 first1) {
    // 函数体不变
}