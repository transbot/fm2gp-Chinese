#include <iostream>
#include <cmath>

// 判断一个数是否为素数
bool is_prime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}



// 计算最大公约数（GCD）
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}


// 快速幂算法（模幂运算）
long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }
    return result;
}

// 判断一个数是否为卡迈克尔数
bool is_Carmichael(int n) {
    if (is_prime(n)) return false; // 卡迈克尔数必须是合数

    for (int a = 2; a < n; a++) {
        if (gcd(a, n) == 1) { // 检查a是否与n互质
            // 使用快速幂算法计算 a^(n-1) % n
            if (mod_pow(a, n - 1, n) != 1) {
                return false;
            }
        }
    }
    return true;
}

int main() {
    int count = 0; // 记录找到的卡迈克尔数的数量
    int n = 2;     // 从2开始检查

    std::cout << "前7个卡迈克尔数为：" << std::endl;
    while (count < 7) {
        if (is_Carmichael(n)) {
            std::cout << n << std::endl;
            count++;
        }
        n++;
    }

    return 0;
}