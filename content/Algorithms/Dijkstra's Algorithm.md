
```cpp
#include <compare>
#include <iostream>
#include <optional>
#include <print>
#include <ranges>
#include <set>
#include <vector>

class Edge {
public:
    int toIdx;
    int weight;
};

std::vector<std::optional<int>> shortestPaths(std::vector<std::vector<Edge>> const& graph, int startIdx) {
    class DijkstraState {
    public:
        int idx;
        int distance;
    };

    auto compareState = [](auto const& state1, auto const& state2) -> bool {
        if (auto cmp = state1.distance <=> state2.distance; std::is_neq(cmp)) {
            return std::is_lt(cmp);
        }
        if (auto cmp = state1.idx <=> state2.idx; std::is_neq(cmp)) {
            return std::is_lt(cmp);
        }
        return 0;
    };

    std::vector<std::optional<int>> distances(graph.size(), std::nullopt);
    distances[startIdx] = 0;

    std::set<DijkstraState, decltype(compareState)> states {{startIdx, 0}};
    
    while (!states.empty()) {
        auto curState = *states.begin();
        states.erase(states.begin());

        for (auto const& outEdge: graph[curState.idx]) {
            auto& currentBestDistance = distances[outEdge.toIdx];
            int potentialDistance = curState.distance + outEdge.weight;

            if (!currentBestDistance) {
                states.emplace(outEdge.toIdx, potentialDistance);
                currentBestDistance = potentialDistance;
            }
            else if (*currentBestDistance > potentialDistance) {
                auto nodeHandle = states.extract({outEdge.toIdx, *currentBestDistance});
                currentBestDistance = potentialDistance;
                nodeHandle.value().distance = potentialDistance;
                states.insert(std::move(nodeHandle)).position;
            }
        }
    }

    return distances;
}

int main() {
    auto graph = std::vector<std::vector<Edge>> {
        {{3, 3}},
        {{0, 5}, {2, 1}},
        {{0, 2}, {3, 10}},
        {},
        {}
    };

    auto distances = shortestPaths(graph, 1);
    for (auto const& [idx, distance]: distances | std::views::enumerate) {
        std::println("{}'s distance is {}", idx, distance ? *distance : -1);
    }
}
```

