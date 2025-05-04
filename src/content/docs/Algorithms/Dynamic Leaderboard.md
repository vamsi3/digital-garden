---
title: Dynamic Leaderboard
---

> [!todo]
> Generalize this code

> [!info]
> Inspired from https://leetcode.com/discuss/interview-question/5057509/Google-or-L5-or-coding-round-or-design-mini-leaderboard

```cpp
#include <iostream>
#include <format>
#include <ranges>
#include <print>
#include <set>
#include <vector>
#include <unordered_map>

auto cmp = [](auto const& entry1, auto const& entry2) -> bool {
    if (auto cmp = entry1.rank <=> entry2.rank; std::is_neq(cmp)) {
        return std::is_gt(cmp);
    }
    if (auto cmp = entry1.id <=> entry2.id; std::is_neq(cmp)) {
        return std::is_lt(cmp);
    }
    return 0;
};

class Leaderboard {
private:
    class Entry {
    public:
        int id;
        int rank;
    };

    std::set<Entry, decltype(cmp)> entries;
    using It = decltype(entries)::iterator;
    std::unordered_map<int, It> userToEntryMap;

public:
    void insert(int id) {
        auto const& [mapIt, isInserted] = userToEntryMap.try_emplace(id);
        if (!isInserted) {
            throw std::invalid_argument(std::format(
                "argument id `{}` already exists in leaderboard",
                id
            ));
        }
        auto const& [entryIt, _] = entries.emplace(id, 0);
        mapIt->second = entryIt;
    }

    void update(int id, int rank) {
        auto mapIt = userToEntryMap.find(id);
        if (mapIt == userToEntryMap.end()) {
            throw std::invalid_argument(std::format(
                "argument id `{}` doesn't exist in leaderboard",
                id
            ));
        }
        auto entryIt = mapIt->second;
        
        auto nodeHandle = entries.extract(entryIt);
        nodeHandle.value().rank = rank;
        mapIt->second = entries.insert(std::move(nodeHandle)).position;
    }

    std::vector<int> top(int k) const {
        return entries
            | std::views::take(k)
            | std::views::transform([](auto const& entry) { return entry.id; })
            | std::ranges::to<std::vector>();
    }

    std::vector<int> nearbyUsers(int id, int k) const {
        auto mapIt = userToEntryMap.find(id);
        if (mapIt == userToEntryMap.end()) {
            throw std::invalid_argument(std::format(
                "argument id `{}` doesn't exist in leaderboard",
                id
            ));
        }
        auto entryIt = mapIt->second;

        auto endIt = std::ranges::next(entryIt, (k + 1) / 2, entries.end());
        auto startIt = std::ranges::prev(endIt, k, entries.begin());

        return std::ranges::subrange {startIt, entries.end()}
            | std::views::take(k)
            | std::views::transform([](auto const& entry) { return entry.id; })
            | std::ranges::to<std::vector>();
    }
};

int main() {
    auto leaderboard = Leaderboard {};
    auto print_vector = [](auto const& vec) {
        for (auto const& element: vec) {
            std::print("{} ", element);
        }
        std::println();
    };

    leaderboard.insert(2);
    leaderboard.insert(3);
    leaderboard.update(2, 3);
    leaderboard.insert(1);
    leaderboard.insert(6);
    leaderboard.update(1, 5);
    print_vector(leaderboard.top(1));
    print_vector(leaderboard.top(2));
    print_vector(leaderboard.top(3));
    print_vector(leaderboard.top(4));
    leaderboard.update(2, 9);
    print_vector(leaderboard.top(5));
    leaderboard.update(3, 11);
    print_vector(leaderboard.top(5));
    leaderboard.update(6, 8);
    print_vector(leaderboard.top(5));
    print_vector(leaderboard.nearbyUsers(6, 1));
    print_vector(leaderboard.nearbyUsers(6, 2));
    print_vector(leaderboard.nearbyUsers(6, 3));
    print_vector(leaderboard.nearbyUsers(6, 4));
    print_vector(leaderboard.nearbyUsers(6, 5));
    print_vector(leaderboard.nearbyUsers(6, 6));
    leaderboard.update(6, 2);
    print_vector(leaderboard.top(4));
    print_vector(leaderboard.nearbyUsers(6, 1));
    print_vector(leaderboard.nearbyUsers(6, 2));
    print_vector(leaderboard.nearbyUsers(6, 3));
    print_vector(leaderboard.nearbyUsers(6, 4));
    print_vector(leaderboard.nearbyUsers(6, 5));
    print_vector(leaderboard.nearbyUsers(6, 6));
}
```
