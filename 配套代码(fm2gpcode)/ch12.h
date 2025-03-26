// Copyright (c) 2014 Alexander A. Stepanov and Daniel E. Rose
//
// Permission to use, copy, modify, distribute and sell this software
// and its documentation for any purpose is hereby granted without
// fee, provided that the above copyright notice appear in all copies
// and that both that copyright notice and this permission notice
// appear in supporting documentation. The authors make no
// representations about the suitability of this software for any
// purpose. It is provided "as is" without express or implied
// warranty.
//
// This code accompanies the "fM2GP" book:
//
//	From Mathematics to Generic Programming
//	by Alexander Stepanov and Daniel E. Rose
//	Addison-Wesley Professional, 2015
//
// -------------------------------------------------------------------
// ch12.h -- Functions from Chapter 12 of fM2GP.
// -------------------------------------------------------------------

#include <algorithm>

#define Integer typename
#define BinaryInteger typename
#define EuclideanDomain typename

// Section 12.1

template <Integer N>
bool even(N n) { return !bool(n & 0x1); }

template <BinaryInteger N>
N stein_gcd(N m, N n) {
    if (m < N(0)) m = -m;
    if (n < N(0)) n = -n;
    if (m == N(0)) return n;
    if (n == N(0)) return m;

    // m > 0 && n > 0
  
    int d_m = 0; 
    while (even(m)) { m >>= 1; ++d_m;}

    int d_n = 0;
    while (even(n)) { n >>= 1; ++d_n;}

    // odd(m) && odd(n)
  
    while (m != n) {
      if (n > m) std::swap(n, m);
      m -= n;
      do m >>= 1; while (even(m));
    }
  
    // m == n
  
    return m << std::min(d_m, d_n);
}

// Section 12.4

template <EuclideanDomain E>
E gcd(E a, E b) {
    while (b != E(0)) {
        a = remainder(a, b);
        std::swap(a, b);
    }
    return a;
}

std::pair<int, int>
quotient_remainder(int a, int b) {
  return { a / b, a % b };
}

// 定义一个模板函数，模板参数 E 必须满足欧几里得域（Euclidean Domain）的要求
// 欧几里得域是一种代数结构，支持除法和取余运算
template <EuclideanDomain E>
// 函数 extended_gcd 用于计算两个元素 a 和 b 的扩展最大公约数
// 扩展最大公约数算法不仅计算 a 和 b 的最大公约数，还计算满足 ax + by = gcd(a, b) 的系数 x 和 y
// 这里只返回系数 x 和最大公约数 gcd(a, b)
std::pair<E, E> extended_gcd(E a, E b) {
    // 初始化系数 x0 为 1，x0 表示当前迭代中 a 的系数
    E x0(1);
    // 初始化系数 x1 为 0，x1 表示当前迭代中 b 的系数
    E x1(0);
    // 当 b 不等于 0 时，继续迭代
    while (b != E(0)) {
        // 计算 a 除以 b 的商和余数
        // quotient_remainder 是一个自定义函数，用于返回 a 除以 b 的商和余数组成的 pair
        std::pair<E, E> qr = quotient_remainder(a, b);
        // 根据扩展欧几里得算法的递推公式计算新的系数 x2
        // x2 是下一次迭代中 a 的系数，其计算公式为 x2 = x0 - 商 * x1
        E x2 = x0 - qr.first * x1;
        // 进行系数的移位操作
        // 将 x1 的值赋给 x0，更新 x0 为下一次迭代的前一个系数
        x0 = x1;
        // 将 x2 的值赋给 x1，更新 x1 为当前迭代的系数
        x1 = x2;
        // 进行余数的移位操作
        // 将 b 的值赋给 a，更新 a 为下一次迭代的被除数
        a = b;
        // 将余数 qr.second 赋给 b，更新 b 为下一次迭代的除数
        b = qr.second;
    }
    // 当 b 为 0 时，迭代结束
    // 此时 a 就是 a 和 b 的最大公约数，x0 是满足 ax + by = gcd(a, b) 的系数 x
    // 返回一个包含系数 x0 和最大公约数 a 的 pair
    return {x0, a};
}
