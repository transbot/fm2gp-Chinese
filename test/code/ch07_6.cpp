// 演示C++20引入的“概念”
// 概念定义：
// SemigroupOperation<Op, A>：约束Op必须是一个接受两个A类型参数并返回A类型的运算。
// Regular<A>：约束A必须是常规类型（可复制、可移动、可比较）。
// Integer<N>：约束N必须是整型。
//
// 示例1：使用乘法运算计算2 * 3^5，结果为486。
// 示例2：使用加法运算计算2 + 3*5，结果为17。
// 示例3：使用自定义运算（字符串拼接）计算"Result: " + "b"^3，结果为"Result: bbb"

#include <iostream>
#include <concepts> // 引入C++20概念支持
#include <functional> // 为了使用std::multiplies

// 定义SemigroupOperation（半群运算）概念
template <typename Op, typename A>
concept SemigroupOperation = requires(Op op, A a, A b) {
    { op(a, b) } -> std::same_as<A>; // 运算op必须接受两个A类型的参数并返回A类型
};

// 定义Regular（常规）类型的概念
template <typename T>
concept Regular = std::regular<T>; // Regular类型必须是可复制、可移动、可比较的

// 定义Integer类型的概念
template <typename T>
concept Integer = std::integral<T>; // Integer类型必须是整型

// 使用了概念的power_accumulate_semigroup函数
// 它实现了“泛型运算”
template <Regular A, Integer N, SemigroupOperation<A> Op>
A power_accumulate_semigroup(A r, A a, N n, Op op) {
    // 前置条件：n >= 0
    if (n == 0) return r; // 如果n为0，直接返回r
    while (true) {
        if (n % 2 != 0) { // 检查n是否为奇数
            r = op(r, a); // 使用泛型运算op计算r和a的结果
            if (n == 1) return r; // 如果n已经减少到1，返回结果r
        }
        n = n / 2; // 将n减半
        a = op(a, a); // 使用泛型运算op计算a的平方
    }
}

int main() {
    // 示例 1：使用乘法运算计算2 * 3^5
    {
        int r = 2; // 初始值
        int a = 3; // 底数
        int n = 5; // 指数
        auto multiply = [](int x, int y) { return x * y; }; // 定义一个乘法运算
        int result = power_accumulate_semigroup(r, a, n, multiply);
        std::cout << "2 * 3^5 = " << result << std::endl; // 输出486
    }

    // 示例 2：使用加法运算计算 2 + 3*5
    {
        int r = 2; // 初始值
        int a = 3; // 底数
        int n = 5; // 指数
        auto add = [](int x, int y) { return x + y; }; // 定义一个加法运算
        int result = power_accumulate_semigroup(r, a, n, add);
        std::cout << "2 + 3*5 = " << result << std::endl; // 输出17
    }

    // 示例 3：使用自定义运算（字符串拼接）计算 "a" + "b"^3
    {
        std::string r = "Result: "; // 初始值
        std::string a = "b"; // 底数
        int n = 3; // 指数
        auto concatenate = [](std::string x, std::string y) { return x + y; }; // 定义一个字符串拼接运算
        std::string result = power_accumulate_semigroup(r, a, n, concatenate);
        std::cout << result << std::endl; // 输出"Result: bbb"
    }

    return 0;
}