#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <type_traits>

// 判断是否为偶数
template <typename N>
bool even(N n) {
    return (n & 1) == 0;
}

// 交换两个数
template <typename N>
void swap(N& a, N& b) {
    N temp = a;
    a = b;
    b = temp;
}

// Stein 算法（二进制 GCD 算法）
template <typename N>
N stein_gcd(N m, N n) {
    static_assert(std::is_integral<N>::value, "N must be an integral type");

    // 如果m为负数，将其取反，确保处理的是正整数
    if (m < N(0)) m = -m;
    // 如果n为负数，将其取反，确保处理的是正整数
    if (n < N(0)) n = -n;
    // 如果m为0，直接返回n作为最大公约数
    if (m == N(0)) return n;
    // 如果n为0，直接返回m作为最大公约数
    if (n == N(0)) return m;

    // 记录m中因子2的个数
    int d_m = 0;
    while (even(m)) { m >>= 1; ++d_m; }

    // 记录n中因子2的个数
    int d_n = 0;
    while (even(n)) { n >>= 1; ++d_n; }

    // 此时m和n都为奇数
    while (m != n) {
        // 如果n大于m，交换m和n的值
        if (n > m) swap(n, m);
        // 从m中减去n
        m -= n;
        // 去除m中的所有因子2，直到m变为奇数
        while (even(m)) { m >>= 1; }
    }

    // 返回结果，将m左移min(d_m, d_n)位
    return m << std::min(d_m, d_n);
}

// 欧几里得算法
template <typename N>
N euclid_gcd(N a, N b) {
    static_assert(std::is_integral<N>::value, "N must be an integral type");

    while (b != N(0)) {
        N temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 生成随机数
template <typename N>
N generate_random_number(N range) {
    thread_local std::random_device rd;
    thread_local std::mt19937_64 gen(rd());
    std::uniform_int_distribution<N> dis(0, range - 1);
    return dis(gen);
}

// 测试性能
template <typename N>
void test_performance(const std::string& range_name, N range) {
    const int num_tests = 90000; // 测试次数
    auto start = std::chrono::high_resolution_clock::now();

    // 测试 Euclid 算法
    for (int i = 0; i < num_tests; ++i) {
        N a = generate_random_number(range);
        N b = generate_random_number(range);
        euclid_gcd(a, b);
    }
    auto end_euclid = std::chrono::high_resolution_clock::now();

    // 测试 Stein 算法
    for (int i = 0; i < num_tests; ++i) {
        N a = generate_random_number(range);
        N b = generate_random_number(range);
        stein_gcd(a, b);
    }
    auto end_stein = std::chrono::high_resolution_clock::now();

    // 计算时间
    auto euclid_time = std::chrono::duration_cast<std::chrono::milliseconds>(end_euclid - start).count();
    auto stein_time = std::chrono::duration_cast<std::chrono::milliseconds>(end_stein - end_euclid).count();

    // 输出结果
    std::cout << "Range: " << range_name << "\n";
    std::cout << "Euclid Algorithm Time: " << euclid_time << " ms\n";
    std::cout << "Stein Algorithm Time: " << stein_time << " ms\n";
    std::cout << "-------------------------\n";
}

int main() {
    // 测试不同范围
    test_performance<uint16_t>("[0, 2^16)", 1ULL << 16);
    test_performance<uint32_t>("[0, 2^32)", 1ULL << 32);
    // 修正范围为 uint64_t 的最大值
    test_performance<uint64_t>("[0, 2^64 - 1)", std::numeric_limits<uint64_t>::max());

    return 0;
}