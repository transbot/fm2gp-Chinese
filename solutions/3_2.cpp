#include <iostream>
#include <vector>
#include <chrono>
#include <cmath>

// 通用的托色尼筛法
template<typename T>
void sieveOfEratosthenes(T* isPrime, size_t size) {
    for (size_t i = 2; i * i < size; ++i) {
        if (isPrime[i]) {
            for (size_t j = i * i; j < size; j += i) {
                isPrime[j] = false;
            }
        }
    }
}

// 专门为 std::vector<bool> 编写的筛法函数
void sieveOfEratosthenesBool(std::vector<bool>& isPrime) {
    size_t size = isPrime.size();
    for (size_t i = 2; i * i < size; ++i) {
        if (isPrime[i]) {
            for (size_t j = i * i; j < size; j += i) {
                isPrime[j] = false;
            }
        }
    }
}

// 通用的计时函数
template<typename T>
void timeSieve(size_t size, const std::string& typeName) {
    T* isPrime = new T[size];
    for (size_t i = 0; i < size; ++i) {
        isPrime[i] = true;
    }
    isPrime[0] = isPrime[1] = false;

    auto start = std::chrono::high_resolution_clock::now();
    sieveOfEratosthenes(isPrime, size);
    auto end = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double, std::milli> duration = end - start;
    std::cout << typeName << ": " << duration.count() << " ms" << std::endl;

    delete[] isPrime;
}

int main() {
    const size_t SIZE = 1000000; // 这里可以调整大小以测试不同的数据规模
    
    // 使用 std::vector<bool>
    std::vector<bool> isPrimeBool(SIZE, true);
    isPrimeBool[0] = isPrimeBool[1] = false;
    auto start = std::chrono::high_resolution_clock::now();
    sieveOfEratosthenesBool(isPrimeBool);
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration = end - start;
    std::cout << "std::vector<bool>: " << duration.count() << " ms" << std::endl;

    // 使用 uint8_t
    timeSieve<uint8_t>(SIZE, "uint8_t");
    
    // 使用 uint16_t
    timeSieve<uint16_t>(SIZE, "uint16_t");
    
    // 使用 uint32_t
    timeSieve<uint32_t>(SIZE, "uint32_t");
    
    // 使用 uint64_t
    timeSieve<uint64_t>(SIZE, "uint64_t");

    return 0;
}