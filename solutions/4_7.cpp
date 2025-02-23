#include <iostream>
#include <utility> // 为了使用std::pair

// 定义 line_segment 和 integer 类型
using line_segment = int;
using integer = int;

// quotient_fibonacci 函数：计算商
integer quotient_fibonacci(line_segment a, line_segment b) {
    // 前置条件：b > 0
    if (a < b) return integer(0); // 如果 a < b，商为 0

    // 初始化斐波那契数列
    line_segment c = b;
    integer n(1); // 初始化商为 1

    // 构建斐波那契数列，直到 c 超过 a
    do {
        line_segment tmp = c;
        c = b + c;
        b = tmp;
        n = n + n; // 每次加倍商
    } while (a >= c);

    // 逆向斐波那契数列计算商
    do {
        if (a >= b) {
            a = a - b; // 从 a 中减去 b
            n = n + 1; // 增加商
        }
        line_segment tmp = c - b;
        c = b;
        b = tmp;
    } while (b < c);

    return n; // 返回最终的商
}

// quotient_remainder_fibonacci 函数：同时计算商和余数
std::pair<integer, line_segment> quotient_remainder_fibonacci(line_segment a, line_segment b) {
    // 前置条件：b > 0
    if (a < b) return {integer(0), a}; // 如果 a < b，商为 0，余数为 a

    // 初始化斐波那契数列
    line_segment c = b;
    integer n(1); // 初始化商为 1

    // 构建斐波那契数列，直到 c 超过 a
    do {
        line_segment tmp = c;
        c = b + c;
        b = tmp;
        n = n + n; // 每次加倍商
    } while (a >= c);

    // 逆向斐波那契数列计算商和余数
    do {
        if (a >= b) {
            a = a - b; // 从 a 中减去 b
            n = n + 1; // 增加商
        }
        line_segment tmp = c - b;
        c = b;
        b = tmp;
    } while (b < c);

    return {n, a}; // 返回商和余数
}

int main() {
    // 用户输入
    line_segment a, b;
    std::cout << "请输入被除数 a: ";
    std::cin >> a;
    std::cout << "请输入除数 b: ";
    std::cin >> b;

    // 检查除数是否为 0
    if (b == 0) {
        std::cout << "错误：除数不能为 0！" << std::endl;
        return 1;
    }

    // 调用 quotient_fibonacci 函数
    integer q = quotient_fibonacci(a, b);
    std::cout << "商 (quotient_fibonacci): " << q << std::endl;

    // 调用 quotient_remainder_fibonacci 函数
    auto result = quotient_remainder_fibonacci(a, b);
    std::cout << "商 (quotient_remainder_fibonacci): " << result.first << std::endl;
    std::cout << "余数: " << result.second << std::endl;

    return 0;
}

