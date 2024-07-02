```cpp
#include <iostream>
#include <print>
#include <vector>

template<typename LowestPrime>
void sieve(int n, LowestPrime&& lowestPrime) {
    std::vector<bool> isPrime(n + 1, true);

    int i = 2;
    for (; i * i <= n; ++i) {
        if (!isPrime[i]) continue;
        lowestPrime(i, i);
        for (auto j = static_cast<int64_t>(i) * i; j <= n; j += i) {
            if (isPrime[j]) {
                lowestPrime(j, i);
                isPrime[j] = false;
            }
        }
    }
    for (; i <= n; ++i) {
        if (!isPrime[i]) continue;
        lowestPrime(i, i);
    } 
}

template<typename LowestPrime>
void linearSieve(int n, LowestPrime&& lowestPrime) {
    std::vector<int> primes;
    std::vector<int> lowestPrimes(n + 1, 0);
    for (int i = 2; i <= n; ++i) {
        if (!lowestPrimes[i]) {
            primes.push_back(i);
            lowestPrimes[i] = i;
            lowestPrime(i, i);
        }
        for (auto const& p: primes) {
            if (p > lowestPrimes[i]) break;
            if (auto j = static_cast<int64_t>(i) * p; j <= n) {
                lowestPrimes[j] = p;
                lowestPrime(j, p);
            }
        }
    }
}

std::vector<int> computeMobius(int n) {
    std::vector<int> lowestPrimes(n + 1);
    sieve(n, [&](int i, int lowestPrime) {
        std::println("lowestPrimes[{}] = {}", i, lowestPrime);
        lowestPrimes[i] = lowestPrime;
    });

    std::vector<int> mobius(n + 1);
    mobius[1] = 1;
    for (int i = 2; i <= n; ++i) {
        if (i == lowestPrimes[i]) {
            mobius[i] = -1;
        } else if (int j = i / lowestPrimes[i]; lowestPrimes[j] != lowestPrimes[i]) {
            mobius[i] = -mobius[j];
        } else {
            mobius[i] = 0;
        }
    };
    return mobius;
}

#include <chrono>

int main() {
    int n = 100;
    std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();
    auto mobius = computeMobius(n);
    std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();
    std::cout << "Time difference = " << std::chrono::duration_cast<std::chrono::microseconds>(end - begin).count() << "[µs]" << std::endl;
}
```