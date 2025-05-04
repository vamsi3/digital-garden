---
title: Double Ended Priority Queue
---

```cpp
/**
 * @author Satti Vamsi Krishna Reddy
 * @brief With love for competitive programming!
 */

#include <compare>
#include <iostream>
#include <ranges>
#include <set>
#include <utility>
#include <vector>

// https://en.wikipedia.org/wiki/Double-ended_priority_queue

template<template<typename> typename DEPQ, typename T>
concept DEPQConcept = requires(DEPQ<T> depq, T&& t) {
    { depq.isEmpty() } -> std::same_as<bool>;
    { depq.size() } -> std::same_as<int>;
    { depq.getMin() } -> std::same_as<T const&>;
    { depq.getMax() } -> std::same_as<T const&>;
    { depq.put(t) };
    { depq.removeMin() };
    { depq.removeMax() };
};

namespace MultiSetSTL {
template<typename T>
class DEPQ {
private:
    std::multiset<int> s;

public:
    bool isEmpty() const { return s.empty(); }
    int size() const { return s.size(); }
    T const& getMin() const { return *s.begin(); }
    T const& getMax() const { return *std::prev(s.end()); }
    void put(T const& t) { s.insert(t); }
    void removeMin() { s.erase(s.begin()); }
    void removeMax() { s.erase(std::prev(s.end())); }

    static_assert(DEPQConcept<DEPQ, T>);
};
}

namespace IntervalHeap {
template<typename T, typename Compare = std::less<T>>
class DEPQ {
private:
    class Node {
    public:
        T left, right;
    };

    Compare compare;
    std::vector<Node> nodes;
    bool isOddSize = false;

public:
    bool isEmpty() const { return nodes.empty(); }
    T const& getMin() const { return nodes.front().left; }
    T const& getMax() const { return nodes.front().right; }

    int size() const {
        int size = 2 * nodes.size();
        if (isOddSize) --size;
        return size;
    }

    void put(T const& t) {
        // TODO
    }

    void removeMin() {
        // TODO
    }

    void removeMax() {
        // TODO
    }

    static_assert(DEPQConcept<DEPQ, T>);
};
}

enum class QueryType : int {
    add = 0,
    removeAndGetMin = 1,
    removeAndGetMax = 2
};

auto main() -> int {
    auto depq = MultiSetSTL::DEPQ<int>();
    int n, q;
    std::cin >> n >> q;
    for (auto const _: std::views::iota(0, n)) {
        int s;
        std::cin >> s;
        depq.put(s);
    }
    for (auto const _: std::views::iota(0, q)) {
        int queryTypeInt;
        std::cin >> queryTypeInt;
        auto queryType = static_cast<QueryType>(queryTypeInt);

        if (queryType == QueryType::add) {
            int x;
            std::cin >> x;
            depq.put(x);
        }
        else if (queryType == QueryType::removeAndGetMin) {
            auto x = depq.getMin();
            depq.removeMin();
            std::cout << x << std::endl;
        }
        else if (queryType == QueryType::removeAndGetMax) {
            auto x = depq.getMax();
            depq.removeMax();
            std::cout << x << std::endl;
        }
        else {
            std::unreachable();
        }
    }
}
```