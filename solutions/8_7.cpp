// 这个程序将输出传递闭包矩阵，显示每个人的社交网络。矩阵中的 1（true）表示存在关系，0（false）表示不存在关系
// 传递闭包矩阵显示了每个人在社交网络中的直接和间接关系。
// 例如，林字的社交网络包括柳雅、陈轩、何琳和叶萱。
// 而周悦和苏逸的社交网络相对独立，只是彼此有关系。

// 输出结果：
/* 传递闭包矩阵：
        林字  柳雅   陈轩  何琳   周悦  叶萱  苏逸
  林字     1     1     1     1     0     1     0
  柳雅     1     1     1     1     0     1     0
  陈轩     1     1     1     1     0     1     0
  何琳     1     1     1     1     0     1     0
  周悦     0     0     0     0     1     0     1
  叶萱     1     1     1     1     0     1     0
  苏逸     0     0     0     0     1     0     1 */

#include <iostream>
#include <vector>
#include <iomanip> // 用于对齐输出

using namespace std;

// 定义半群运算：布尔矩阵乘法
vector<vector<bool>> booleanMatrixMultiply(const vector<vector<bool>>& a, const vector<vector<bool>>& b) {
    int n = a.size();
    vector<vector<bool>> result(n, vector<bool>(n, false));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            for (int k = 0; k < n; ++k) {
                result[i][j] = result[i][j] || (a[i][k] && b[k][j]);
            }
        }
    }
    return result;
}

// 幂函数的累加版本（参见7.6节）
template <typename A, typename N, typename Op>
A power_accumulate_semigroup(A r, A a, N n, Op op) {
    if (n == 0) return r;
    while (true) {
        if (n % 2 != 0) {
            r = op(r, a);
            if (n == 1) return r;
        }
        n = n / 2;
        a = op(a, a);
    }
}

// 计算传递闭包
vector<vector<bool>> transitiveClosure(const vector<vector<bool>>& matrix) {
    int n = matrix.size();
    vector<vector<bool>> result = matrix; // 初始化为原始矩阵
    // 使用power_accumulate_semigroup计算传递闭包
    result = power_accumulate_semigroup(result, matrix, n - 1, booleanMatrixMultiply);
    return result;
}

int main() {
    // 人名列表
    vector<string> names = {"林字", "柳雅", "陈轩", "何琳", "周悦", "叶萱", "苏逸"};

    // 初始化布尔邻接矩阵
    vector<vector<bool>> friendshipMatrix = {
        {true, true, false, true, false, false, false},
        {true, true, false, false, false, true, false},
        {false, false, true, true, false, false, false},
        {true, false, true, true, false, true, false},
        {false, false, false, false, true, false, true},
        {false, true, false, true, false, true, false},
        {false, false, false, false, true, false, true}
    };

    // 计算传递闭包
    vector<vector<bool>> closure = transitiveClosure(friendshipMatrix);

    // 输出传递闭包矩阵
    cout << "传递闭包矩阵：" << endl;

    // 输出列标题
    cout << setw(6) << " ";
    for (const string& name : names) {
        cout << setw(6) << name;
    }
    cout << endl;

    // 输出矩阵内容
    for (int i = 0; i < closure.size(); ++i) {
        cout << setw(6) << names[i]; // 输出行标题
        for (bool val : closure[i]) {
            cout << setw(6) << val;
        }
        cout << endl;
    }

    return 0;
}
