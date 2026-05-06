#include <iostream>
#include <vector>
#include <algorithm> // for std::rotate

int main() {
    // 定义初始序列
    std::vector<char> vec = {'A', 'B', 'C', 'D', 'E'};


    // 输出初始序列
    std::cout << "初始序列: ";
    for (char ch : vec) {
        std::cout << ch << " ";
    }
    std::cout << std::endl;

    // 定义迭代器
    auto f = vec.begin(); // 起始迭代器
    auto l = vec.end();   // 结束迭代器
    auto m = l - 2;       // 中间迭代器，指向 'C'

    // 执行旋转操作
    std::rotate(f, m, l);

    // 输出旋转后的序列
    std::cout << "旋转后的序列: ";
    for (char ch : vec) {
        std::cout << ch << " ";
    }
    std::cout << std::endl;

    return 0;
}