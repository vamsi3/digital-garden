
## Problems

### Problem 1

https://leetcode.com/discuss/interview-question/2346914/Google-or-L5-or-Phone-Screening
#### Solution

```cpp
#include <iostream>
#include <numeric>
#include <print>
#include <ranges>
#include <span>
#include <vector>

template<typename F>
requires requires(F func, int const arg) {
    { func(arg) } -> std::same_as<bool>;
}
int upper_bound(int l, int r, F func) {
    --l; ++r;
    while (r - l > 1) {
        int m = std::midpoint(l, r);
        if (func(m)) {
            r = m;
        } else {
            l = m;
        }
    }
    return r;
}

template<typename F>
requires requires(F doFail, std::span<int const> const testNumbers) {
    { doFail(testNumbers) } -> std::same_as<bool>;
}
std::pair<int, int> badTests(std::vector<int> const& testNumbers, F&& doFail) {
    int count = testNumbers.size();
    auto testNumbersSpan = std::span {testNumbers};
    
    auto l = upper_bound(1, count, [&](int index) -> bool {
        return doFail(testNumbersSpan.last(index));
    });

    auto r = upper_bound(1, count, [&](int index) -> bool {
        return doFail(testNumbersSpan.first(index));
    });

    return {testNumbers[count - l], testNumbers[r - 1]};
}

int main() {
    std::vector<int> testNumbers = {5, 6, 7, 8, 11, 12, 14, 15, 16, 17, 20, 24, 31};

    auto badPair = badTests(testNumbers, [](std::span<int const> const& testNumbers) -> bool {
        if (testNumbers.front() > 7) return false;
        if (testNumbers.back() < 15) return false;
        return true;
    });
    
    std::println("badPair: {}, {}", badPair.first, badPair.second);
}
```

### Problem 2

https://leetcode.com/discuss/interview-question/5068774/Google-or-L5-or-interview-question-April-2024
#### Solution

```cpp
#include <iostream>
#include <print>
#include <ranges>
#include <vector>

class Candidate {
public:
    std::string word;
    int score;
};

template<std::ranges::constant_range R>
constexpr std::vector<int> prefixFunction(R&& r) {
    auto v = r | std::ranges::to<std::vector>();
    int n = static_cast<int>(v.size());
    std::vector<int> p(n);
    p[0] = 0;
    for (int i = 1; i < n; ++i) {
        int j = p[i - 1];
        while (j > 0 && v[j] != v[i]) {
            j = p[j - 1];
        }
        p[i] = (v[i] == v[j]) ? j + 1 : j;
    }
    return p;
}

template<std::ranges::constant_range R>
constexpr int computeCommonJoinLength(R&& r1, R&& r2) {
    using namespace std::literals;
    auto delimiter = "#"s;
    auto joinRangeElements = {r2, delimiter, r1};
    auto const joinedRange = joinRangeElements | std::views::join;
    
    auto p = prefixFunction(joinedRange);
    auto length = p.back();
    if (length == std::ranges::size(r2)) {
        length = p[length - 1];
    }
    return length;
}

int maxScore(int maxLength, std::vector<Candidate> const& candidates) {
    int n = static_cast<int>(candidates.size());

    auto commonJoinLengths = std::vector<std::vector<int>>(n, std::vector<int>(n, 0));

    for (auto const& [candidate1Idx, candidate1]: candidates | std::views::enumerate) {
        for (auto const& [candidate2Idx, candidate2]: candidates | std::views::enumerate) {
            commonJoinLengths[candidate1Idx][candidate2Idx] = computeCommonJoinLength(candidate1.word, candidate2.word);
        }
    }

    class DfsState {
    public:
        int candidateIdx;
        int length;
        int score;
    };

    int bestScore = 0;
    auto dfs = [&](this auto const& self, DfsState const& curState) -> void {
        if (curState.length > maxLength) {
            return;
        }
        std::println("call dfs | {} {} {}", curState.candidateIdx, curState.length, curState.score);
        for (auto const& [nextCandidateIdx, nextCandidate]: candidates | std::views::enumerate) {
            bestScore = std::max(bestScore, curState.score);
            auto commonJoinLength = commonJoinLengths[curState.candidateIdx][nextCandidateIdx];
            self({
                .candidateIdx = nextCandidateIdx,
                .length = curState.length + static_cast<int>(nextCandidate.word.length()) - commonJoinLength,
                .score = curState.score + nextCandidate.score
            });
        }
        std::println("exit dfs | {} {} {}", curState.candidateIdx, curState.length, curState.score);
    };

    for (auto const& [candidateIdx, candidate]: candidates | std::views::enumerate) {
        dfs({
            .candidateIdx = candidateIdx,
            .length = static_cast<int>(candidate.word.length()),
            .score = candidate.score
        });
    }

    return bestScore;
}

int main() {
    auto answer = maxScore(13, {
        {"pack", 2},
        {"acknowledge", 12},
        {"edged", 3}
    });

    std::println("answer: {}", answer);
}
```

### Problem 3

https://leetcode.com/discuss/interview-question/924141/google-phone-screen-new-grad

#### Solution

```cpp
#include <iostream>
#include <list>
#include <print>
#include <unordered_map>

class Log {
public:
    enum class Type {
        start,
        end
    };

    int requestId;
    int time;
    Type type;
};

template<typename TimeoutCallback>
class RequestLogProcessor {
private:
    int timeout;
    TimeoutCallback timeoutCallback;

    std::list<Log> activeRequestLogs;
    using It = decltype(activeRequestLogs)::iterator;
    std::unordered_map<int, It> requestIdToLogMap;

    void addRequestLog(Log const& log) {
        activeRequestLogs.push_back(log);
        auto listIt = std::prev(activeRequestLogs.end());
        requestIdToLogMap[log.requestId] = listIt;
    }

    void removeRequest(int requestId) {
        auto mapIt = requestIdToLogMap.find(requestId);
        if (mapIt == requestIdToLogMap.end()) {
            return;
        }
        auto listIt = mapIt->second;
        activeRequestLogs.erase(listIt);
        requestIdToLogMap.erase(mapIt);
    }

public:
    RequestLogProcessor(int timeout, TimeoutCallback const& timeoutCallback):
        timeout(timeout),
        timeoutCallback(timeoutCallback) {}

    void log(Log const& log) {
        if (log.type == Log::Type::start) {
            addRequestLog(log);
        }
        else {
            removeRequest(log.requestId);
        }
        
        auto currentTime = log.time;
        while (!activeRequestLogs.empty()) {
            auto listIt = activeRequestLogs.begin();
            if (currentTime - listIt->time >= timeout) {
                auto requestId = listIt->requestId;
                removeRequest(requestId);
                timeoutCallback(requestId, currentTime);
            }
            else {
                break;
            }
        }
    }
};

int main() {
    auto logProcessor = RequestLogProcessor(3, [](auto const& requestId, auto const& time) {
        std::println("timed-out | requestId: {} | time: {}", requestId, time);
    });

    logProcessor.log({0, 0, Log::Type::start});
    logProcessor.log({1, 1, Log::Type::start});
    logProcessor.log({0, 2, Log::Type::end});
    logProcessor.log({2, 6, Log::Type::start});
    logProcessor.log({1, 7, Log::Type::end});
}
```

### Problem 4

https://leetcode.com/discuss/interview-question/4574669/Google-or-Onsite-or-Find-partitions/

#### Solution

```cpp
#include <iostream>
#include <optional>
#include <print>
#include <ranges>
#include <vector>

namespace DP {
    int negativeContainingPartitionsCount(std::vector<int> const& nums) {
        std::tuple<int, int> dp = {1, 0};
        for (auto const& num: nums) {
            auto const& [x, y] = dp;
            if (num < 0) {
                dp = {0, x + 2 * y};
            } else {
                dp = {x + y, y};
            }
        }
        return std::get<1>(dp);
    }
}

namespace Math {
    int negativeContainingPartitionsCount(std::vector<int> const& nums) {
        int count = 1;
        auto prevNegIdx = std::optional<int> {};
        for (auto const& [idx, num]: nums | std::views::enumerate) {
            if (num >= 0) {
                continue;
            }
            if (prevNegIdx) {
                count *= idx - *prevNegIdx + 1;
            }
            prevNegIdx = idx;
        }
        return count;
    }
}

int main() {
    using namespace Math;
    auto nums = std::vector<int> {10, 0, -1, 2, 3, -4, 5, 7, 8, -6, 5, 2, -9, 6};
    std::println("answer: {}", negativeContainingPartitionsCount(nums));
}
```

### Problem 5


#### Solution


### Problem 6


#### Solution


