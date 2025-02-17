#include <iostream>
#include <cmath>

// 递归计算斐波那契数列的第n项（从第0项开始）
int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 递归计算fib0函数所需加法次数
int fib0_addition_count_recursive(int n) {
    if (n == 0 || n == 1) {
        return 0;
    }
    return fib0_addition_count_recursive(n - 1) + fib0_addition_count_recursive(n - 2) + 1;
}

// 根据公式计算加法次数
int fib0_addition_count_formula(int n) {
    double phi = (1 + std::sqrt(5)) / 2; // 黄金分割比
    return static_cast<int>((std::pow(phi, n + 1) - std::pow(-phi, -n - 1)) / std::sqrt(5)) - 1;
}

int main() {
    int n;
    std::cout << "请输入一个大于等于0且小于等于40的整数: ";
    std::cin >> n;

    // 检查输入是否合法
    if (n < 0 || n > 40) {
        std::cerr << "错误：输入值必须大于等于0且小于等于40。" << std::endl;
        return 1; // 返回非零值表示程序异常退出
    }

    // 计算斐波那契数列的第n项
    int fib_value = fibonacci(n);

    // 计算实际加法次数
    int actual_add_count = fib0_addition_count_recursive(n);

    // 计算理论加法次数
    int theoretical_add_count = fib0_addition_count_formula(n);

    // 输出结果
    std::cout << "斐波那契数列的第 " << n << " 项是（第0项是0，第1项是1）: " << fib_value << std::endl;
    std::cout << "原算法执行的加法次数: " << actual_add_count << std::endl;
    std::cout << "用公式计算得到的理论加法次数: " << theoretical_add_count << std::endl;

    return 0;
}