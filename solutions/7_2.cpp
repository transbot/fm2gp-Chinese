#include <iostream>
#include <vector>

// 定义矩阵乘法函数
std::vector<std::vector<long long>> matrixMultiply(const std::vector<std::vector<long long>>& a, const std::vector<std::vector<long long>>& b) {
    int rowsA = a.size();
    int colsA = a[0].size();
    int colsB = b[0].size();
    std::vector<std::vector<long long>> result(rowsA, std::vector<long long>(colsB, 0));

    for (int i = 0; i < rowsA; ++i) {
        for (int j = 0; j < colsB; ++j) {
            for (int k = 0; k < colsA; ++k) {
                result[i][j] += a[i][k] * b[k][j]; 
            }
        }
    }
    return result;
}

// 定义矩阵快速幂函数
std::vector<std::vector<long long>> matrixPower(const std::vector<std::vector<long long>>& matrix, int n) {
    int size = matrix.size();
    std::vector<std::vector<long long>> result(size, std::vector<long long>(size, 0));
    // 初始化结果矩阵为单位矩阵
    for (int i = 0; i < size; ++i) {
        result[i][i] = 1;
    }
    std::vector<std::vector<long long>> base = matrix;

    while (n > 0) {
        if (n % 2 == 1) {
            result = matrixMultiply(result, base);
        }
        base = matrixMultiply(base, base);
        n /= 2;
    }
    return result;
}

// 计算第n个斐波那契数的函数
long long fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    std::vector<std::vector<long long>> fibMatrix = {{1, 1}, {1, 0}};
    std::vector<std::vector<long long>> resultMatrix = matrixPower(fibMatrix, n - 1);

    return resultMatrix[0][0];
}

int main() {
    int n;
    std::cout << "输入要计算的斐波那契数的序号n(n>=0): ";
    std::cin >> n;

    long long result = fibonacci(n);
    std::cout << "第" << n << "个斐波那契数是: " << result << std::endl;

    return 0;
}