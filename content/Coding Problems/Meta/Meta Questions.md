
# Coding

- https://usaco.guide/CPH.pdf
- https://stackoverflow.com/questions/4373307/is-it-possible-to-do-an-inplace-merge-without-temporary-storage (see the answer)
- https://stackoverflow.com/questions/33973737/how-to-perform-inplace-sorting-of-min-heap-using-heap-sort (see the answer and animation link)

## Problems

### Problem 1

Given a string with duplicate characters sequence, return the maximum length duplicate contiguous characters  
'aaaabbbbccc' => ['a','b']  
'abcd' => ['a','b','c','d']

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <print>

template<typename F>
void iterateContiguousDuplicates(std::string const& s, F func) {
    int n = s.length();
    int currentDuplicateLength = 1;
    for (int i = 1; i < n; ++i) {
        if (s[i] == s[i - 1]) {
            ++currentDuplicateLength;
        } else {
            func(s[i - 1], currentDuplicateLength);
            currentDuplicateLength = 1;
        }
    }
    func(s[n - 1], currentDuplicateLength);
}

std::vector<char> maxLengthDuplicateCharacters(std::string const& s) {
    int maxDuplicateLength = 0;
    iterateContiguousDuplicates(s, [&](char c, int count) {
        maxDuplicateLength = std::max(maxDuplicateLength, count);
    });

    std::vector<char> maxLengthDuplicateCharacters;
    iterateContiguousDuplicates(s, [&](char c, int count) {
        if (count == maxDuplicateLength) {
            maxLengthDuplicateCharacters.push_back(c);
        }
    });
    return maxLengthDuplicateCharacters;
}

int main() {
    auto v = maxLengthDuplicateCharacters("abcd");
    for (auto &c: v) {
        std::print("{} ", c);
    }
    std::println();
}
```



### Problem 2

find the Kth missing item in sequence given longest increasing sequence, ignoring the items before starting element  
[2,3,5,8,10,50,100], k=3 => 7

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>
#include <print>

namespace STLSolution {
    template<std::ranges::forward_range R, typename F>
    std::ranges::borrowed_iterator_t<R> upper_bound(R&& r, F func) {
        return std::ranges::upper_bound(
            r,
            std::make_tuple(0, 0),
            [&](auto, auto elem) {
                return func(elem);
            }
        );
    }

    int kthMissingNumber(std::vector<int> numbers, int k) {
        int firstNumber = numbers.front();

        auto numbersWithIndex = numbers | std::views::enumerate;
        // auto it = std::ranges::upper_bound(
        //     numbersWithIndex,
        //     std::make_tuple(0, 0),
        //     [&](auto, auto numberWithIndex) {
        //         auto [index, number] = numberWithIndex;
        //         return number - firstNumber - index >= k;
        //     }
        // );
        auto it = upper_bound(
            numbersWithIndex,
            [&](auto numberWithIndex) {
                auto [index, number] = numberWithIndex;
                return number - firstNumber - index >= k;
            }
        );

        int upperBoundIndex = std::get<0>(*it);
        return firstNumber + k + upperBoundIndex - 1;
    }
}

namespace SelfImplementedSolution {
    template<typename F>
    int upper_bound(std::vector<std::tuple<long int, int>> numbersWithIndex, F func) {
        int i = -1, j = numbersWithIndex.size();
        while (j - i > 1) {
            int m = i + (j - i) / 2;
            if (func(numbersWithIndex[m])) {
                j = m;
            } else {
                i = m;
            }
        }
        return j;
    }

    int kthMissingNumber(std::vector<int> numbers, int k) {
        int firstNumber = numbers.front();

        auto numbersWithIndex = numbers
            | std::views::enumerate
            | std::ranges::to<std::vector>();

        auto upperBoundIndex = upper_bound(
            numbersWithIndex,
            [&](auto numberWithIndex) {
                auto [index, number] = numberWithIndex;
                return number - firstNumber - index >= k;
            }
        );

        return firstNumber + k + upperBoundIndex - 1;
    }
}

int main() {
    for (int i = 0; i < 150; ++i) {
        auto num = SelfImplementedSolution::kthMissingNumber({2,3,5,8,10,50,100}, i);
        std::println("{}", num);
    }
}
```


### Problem 3

https://leetcode.com/problems/maximum-swap/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <ranges>
#include <print>

int maxValueWithSwap(int number) {
    auto numberStr = std::to_string(number);
    
    std::optional<int> maxDigitIndex;
    std::optional<std::pair<int, int>> swapIndices;

    for (auto const& [index, digit]: numberStr
                                    | std::views::enumerate
                                    | std::views::reverse) {
        if (!maxDigitIndex) {
            maxDigitIndex = index;
        }
        else if (digit > numberStr[*maxDigitIndex]) {
            maxDigitIndex = index;
        }
        else if (digit < numberStr[*maxDigitIndex]) {
            swapIndices = {index, *maxDigitIndex};
        }
    }
    
    if (swapIndices) {
        std::swap(numberStr[swapIndices->first], numberStr[swapIndices->second]);
    }

    return std::stoi(numberStr);
}

int main() {
    auto answer = maxValueWithSwap(99872);
    std::println("{}", answer);
}
```

### Problem 4

https://leetcode.com/problems/word-search-ii/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
#include <print>

class Trie {
private:

public:
    class TrieNode {
    private:
        std::array<TrieNode*, 26> children = {nullptr};

    public:
        bool isWord = false;

        TrieNode* getChild(int charIndex) {
            if (charIndex >= 26) {
                throw std::invalid_argument(std::format("charIndex '{}' should be in [0, 26)", charIndex));
            }
            auto& child = children[charIndex];
            if (!child) {
                child = new TrieNode();
            }
            return child;
        }
    };

    TrieNode* root = new TrieNode();

    void add(std::string const& word) {
        auto currentNode = root;
        for (auto character: word) {
            int charIndex = character - 'a';
            currentNode = currentNode->getChild(charIndex);
        }
        currentNode->isWord = true;
    }
};

std::vector<std::string> findWords(
    std::vector<std::vector<char>>& board,
    std::vector<std::string> const& words
) {
    Trie wordsTrie;
    for (auto const& word: words) {
        wordsTrie.add(word);
    }

    int rowCount = board.size();
    int columnCount = board[0].size();

    std::unordered_set<std::string> wordsFound;

    auto search = [&](this auto const& self, int row, int column, Trie::TrieNode* trieNode, auto&& currentWord) {
        if (row < 0 || row >= rowCount) {
            return;
        }
        if (column < 0 || column >= columnCount) {
            return;
        }

        char c = board[row][column];
        if (c == '#') {
            return;
        }

        int charIndex = c - 'a';
        trieNode = trieNode->getChild(charIndex);

        board[row][column] = '#';
        currentWord.push_back(c);

        if (trieNode->isWord) {
            wordsFound.insert(currentWord);
        }

        self(row - 1, column, trieNode, currentWord);
        self(row + 1, column, trieNode, currentWord);
        self(row, column - 1, trieNode, currentWord);
        self(row, column + 1, trieNode, currentWord);

        currentWord.pop_back();
        board[row][column] = c;
    };

    using namespace std::string_literals;

    for (int row = 0; row < rowCount; ++row) {
        for (int column = 0; column < columnCount; ++column) {
            search(row, column, wordsTrie.root, ""s);
        }
    }
    return std::vector<std::string>(std::begin(wordsFound), std::end(wordsFound));
}

int main() {
    std::vector<std::vector<char>> board = {{'o','a','a','n'},{'e','t','a','e'},{'i','h','k','r'},{'i','f','l','v'}};
    std::vector<std::string> words = {"oath","pea","eat","rain"};
    auto foundWords = findWords(board, words);
    std::println("found {} words", foundWords.size());
    for (auto const& word: foundWords) {
        std::println("{}", word);
    }
}
```

### Problem 5

https://leetcode.com/problems/diameter-of-binary-tree/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <print>


class Graph {
private:
    std::vector<std::vector<int>> adjacencyList;

public:
    void addEdge(int u, int v) {
        if (u >= adjacencyList.size()) {
            adjacencyList.resize(u + 1);
        }
        if (v >= adjacencyList.size()) {
            adjacencyList.resize(v + 1);
        }
        adjacencyList[u].push_back(v);
        adjacencyList[v].push_back(u);
    }

    int diameter() const {
        int diameterVertexCount = 0;

        auto dfs = [&, &adjacencyList = adjacencyList](this auto&& self, int vertex, int parent = -1) -> int {
            std::vector<int> leafPathLengths;

            for (auto const& child: adjacencyList[vertex]) {
                if (child == parent) {
                    continue;
                }
                int longestPathToLeaf = self(child, vertex);
                leafPathLengths.push_back(longestPathToLeaf);
            }

            auto it = std::min(std::end(leafPathLengths), std::next(std::begin(leafPathLengths), 2));
            std::partial_sort(std::begin(leafPathLengths), it, std::end(leafPathLengths));
            int longestPathInSubTree = 1 + std::accumulate(std::begin(leafPathLengths), it, 0);

            diameterVertexCount = std::max(diameterVertexCount, longestPathInSubTree);
            return 1 + (leafPathLengths.empty() ? 0 : leafPathLengths.front());
        };

        dfs(0);
        return diameterVertexCount - 1;
    }
};

int main() {
    Graph graph;
    graph.addEdge(0, 1);
    graph.addEdge(3, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 4);

    std::println("{}", graph.diameter());
}
```

### Problem 6

https://leetcode.com/problems/max-consecutive-ones-iii/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <print>


int maxConsecutiveOnes(std::vector<int> binaryArray, int k) {
    int maxConsecutiveOnes = 0;
    int curConsecutiveOnes = 0;

    int leftIndex = 0, rightIndex = 0;

    while (rightIndex < binaryArray.size()) {
        if (binaryArray[rightIndex]) {
            ++curConsecutiveOnes;
            maxConsecutiveOnes = std::max(maxConsecutiveOnes, curConsecutiveOnes);
            ++rightIndex;
        }
        else if (k > 0) {
            --k;
            ++curConsecutiveOnes;
            maxConsecutiveOnes = std::max(maxConsecutiveOnes, curConsecutiveOnes);
            ++rightIndex;
        }
        else if (leftIndex == rightIndex) {
            curConsecutiveOnes = 0;
            ++leftIndex;
            ++rightIndex;
        }
        else if (binaryArray[leftIndex]) {
            --curConsecutiveOnes;
            ++leftIndex;
        }
        else {
            ++k;
            --curConsecutiveOnes;
            ++leftIndex;
        }
    }

    return maxConsecutiveOnes;
}

int main() {
    int answer = maxConsecutiveOnes({0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1}, 3);
    std::println("{}", answer);
}
```

### Problem 7

https://leetcode.com/problems/merge-sorted-array/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <ranges>
#include <print>

namespace WithReverseIterator {
    void mergeSortedArrays(std::vector<int>& nums1, std::vector<int>& nums2) {
        auto numsIt = std::rbegin(nums1);
        auto nums1It = std::next(numsIt, nums2.size());
        auto nums2It = std::rbegin(nums2);

        while (nums2It != std::rend(nums2)) {
            if (*nums2It >= *nums1It) {
                std::iter_swap(numsIt++, nums2It++);
            }
            else {
                std::iter_swap(numsIt++, nums1It++);
            }
        }
    }
}

namespace WithReverseView {
    void mergeSortedArrays(std::vector<int>& nums1, std::vector<int>& nums2) {
        auto nums1Reverse = nums1 | std::views::reverse;
        auto nums2Reverse = nums2 | std::views::reverse;

        auto numsIt = std::begin(nums1Reverse);
        auto nums1It = std::next(numsIt, nums2.size());
        auto nums2It = std::begin(nums2Reverse);

        while (nums2It != std::end(nums2Reverse)) {
            if (*nums2It >= *nums1It) {
                std::iter_swap(numsIt++, nums2It++);
            }
            else {
                std::iter_swap(numsIt++, nums1It++);
            }
        }
    }
}

int main() {
    auto nums1 = std::vector<int> {1,2,3};
    auto nums2 = std::vector<int> {2,5,6};
    nums1.resize(nums1.size() + nums2.size());
    WithReverseIterator::mergeSortedArrays(nums1, nums2);
    for (auto const& num: nums1) {
        std::print("{} ", num);
    }
    std::println();
}
```

### Problem 8

https://leetcode.com/problems/sum-root-to-leaf-numbers/description/

#### Solution

```cpp
#include <iostream>
#include <vector>
#include <ranges>
#include <print>

template<typename T>
class TreeNode {
public:
    T value;
    std::vector<TreeNode<T>> children;

    TreeNode(T value) : value(value) {}
    TreeNode(T value, std::initializer_list<TreeNode<T>> children) : value(value), children(children) {}
};

int sumOfRootToLeafNumbers(TreeNode<int> root) {
    auto sumOfRootToLeafNumbers = 0;

    auto dfs = [&sumOfRootToLeafNumbers](
        this auto const& dfs,
        TreeNode<int> const& node,
        int currentNumber
    ) -> void {
        currentNumber = 10 * currentNumber + node.value;
        if (node.children.empty()) {
            sumOfRootToLeafNumbers += currentNumber;
            return;
        }
        for (auto const& child: node.children) {
            dfs(child, currentNumber);
        }
    };

    dfs(root, 0);
    return sumOfRootToLeafNumbers;
}

int main() {
    auto root = TreeNode(4, {
        TreeNode(9, {
            TreeNode(5),
            TreeNode(1),
        }),
        TreeNode(0),
    });
    auto answer = sumOfRootToLeafNumbers(root);
    std::println("{}", answer);
}
```

### Problem 9

https://leetcode.com/problems/binary-tree-right-side-view/description/

#### Solution

```cpp
#include <iostream>
#include <print>
#include <queue>
#include <ranges>
#include <stack>
#include <vector>

template<typename T>
class TreeNode {
public:
    T value;
    std::vector<TreeNode<T>> children;

    TreeNode(T value) : value(value) {}
    TreeNode(T value, std::initializer_list<TreeNode<T>> children) : value(value), children(children) {}
};

namespace RecursiveDFS {
    std::vector<int> rightSideView(TreeNode<int> root) {
        std::vector<int> rightSideView;

        auto dfs = [&rightSideView](
            this auto const& dfs,
            TreeNode<int> const& node,
            int level
        ) -> void {
            if (level >= rightSideView.size()) {
                rightSideView.push_back(node.value);
            }
            for (auto const& child: node.children | std::views::reverse) {
                dfs(child, level + 1);
            }
        };

        dfs(root, 0);
        return rightSideView;
    }
}

namespace IterativeDFS {
    std::vector<int> rightSideView(TreeNode<int> root) {
        std::vector<int> rightSideView;

        using DfsStackElement = std::tuple<TreeNode<int>, int>;
        std::stack<DfsStackElement> dfsStack({{root, 0}});

        while (!dfsStack.empty()) {
            auto [node, level] = dfsStack.top();
            dfsStack.pop();

            if (lestd::strong_orderingvel >= rightSideView.size()) {
                rightSideView.push_back(node.value);
            }
            
            for (auto const& child: node.children) {
                dfsStack.emplace(child, level + 1);
            }
        }

        return rightSideView;
    }
}

template<class... Ts>
struct overload : Ts... {
  using Ts::operator()...;

  consteval void operator()(auto) const {
    static_assert(false, "Unsupported type");
  }
};

namespace BFS {
    std::vector<int> rightSideView(TreeNode<int> root) {
        std::vector<int> rightSideView;

        class BfsDepthSeparator {};
        using BfsQueueElement = std::variant<BfsDepthSeparator, TreeNode<int>>;
        std::queue<BfsQueueElement> bfsQueue({root, BfsDepthSeparator()});

        while (!bfsQueue.empty()) {
            auto element = bfsQueue.front();
            bfsQueue.pop();

            std::visit(overload {
                [&](BfsDepthSeparator const& separator) {
                    if (!bfsQueue.empty()) {
                        bfsQueue.emplace(separator);
                    }
                },
                [&](TreeNode<int> const& node) {
                    for (auto const& child: node.children) {
                        bfsQueue.emplace(child);
                    }
                    auto nextElement = bfsQueue.front();
                    if (std::holds_alternative<BfsDepthSeparator>(nextElement)) {
                        rightSideView.push_back(node.value);
                    }
                }
            }, element);
        }

        return rightSideView;
    }
}

int main() {
    using namespace RecursiveDFS;

    auto root = TreeNode(4, {
        TreeNode(9, {
            TreeNode(5),
            TreeNode(1),
        }),
        TreeNode(0),
    });
    auto answer = rightSideView(root);
    for (auto const& vertex: answer) {
        std::print("{} ", vertex);
    }
    std::println();
}
```

### Problem 10

https://leetcode.com/problems/find-median-from-data-stream/description/

#### Solution

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <print>
#include <ranges>
#include <vector>

class MedianTracker {
private:
    std::multiset<int> numbers;
    std::multiset<int>::iterator medianIt = numbers.end();

public:
    void addNumber(int number) {
        numbers.insert(number);

        auto isEvenCount = (numbers.size() % 2) == 0;
        auto numberItLessThanMedianIt = (medianIt == numbers.end()) ? true : number < *medianIt;

        if (!isEvenCount && numberItLessThanMedianIt) {
            --medianIt;
        }
        else if (isEvenCount && !numberItLessThanMedianIt) {
            ++medianIt;
        }
    }

    double getMedian() const {
        auto isEvenCount = (numbers.size() % 2) == 0;
        if (isEvenCount) {
            return static_cast<double>(*std::prev(medianIt) + *medianIt) / 2;
        }
        else {
            return *medianIt;
        }
    }
};

int main() {
    auto medianTracker = MedianTracker();
    auto numbers = std::vector<int> {-1, 1, 3, 2, -1, 10, 5, 3, 2, 1, 1, 2, 0, 10, 10, 10, 10, 10, 10, 10};

    for (auto currentNumbers = std::vector<int> {}; auto const& number: numbers) {
        currentNumbers.push_back(number);
        
        medianTracker.addNumber(number);
        auto median = medianTracker.getMedian();
        
        std::print("{{ ");
        std::ranges::sort(currentNumbers);
        std::ranges::for_each(currentNumbers, [](auto const& number) { std::print("{} ", number); });
        std::println("}} | median: {}", median);
    }
}
```

### Problem 10

https://leetcode.com/problems/random-pick-index/solutions/

#### Solution

```cpp
#include <iostream>
#include <unordered_map>
#include <print>
#include <random>
#include <ranges>
#include <vector>

class RandomPicker {
private:
    std::unordered_map<int, std::vector<int>> numberToIndicesMap;

    static int uniform_int(int a) {
        static std::random_device rd;
        static std::default_random_engine re(rd());
        static std::uniform_int_distribution<int> dis;
        
        using param_t = decltype(dis)::param_type;
        return dis(re, param_t {0, a - 1});
    }

public:
    RandomPicker(std::vector<int> const& numbers) {
        for (auto const& [index, number]: numbers | std::views::enumerate) {
            numberToIndicesMap[number].push_back(index);
        }
    }

    int pick(int number) const {
        auto indicesIt = numberToIndicesMap.find(number);
        if (indicesIt == numberToIndicesMap.end()) {
            throw std::invalid_argument(std::format("number '{}' is not found in data", number));
        }
        auto indices = indicesIt->second;
        auto randomIndex = uniform_int(indices.size());
        return indices[randomIndex];
    }
};

int main() {
    auto randomPicker = RandomPicker({1, 2, 2, 3, -1, 0, 4, 2, 3});
    for (int i = 0; i < 20; ++i) {
        auto index = randomPicker.pick(2);
        std::println("{}", index);
    }
}
```

### Problem 11

https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/description/

#### Solution

```cpp
#include <iostream>
#include <print>
#include <ranges>
#include <string>

std::string minRemoveToMakeValid(std::string const& str) {
    std::string result(str);

    int openParanthesisCount = 0;
    for (auto& c: result) {
        if (c == '(') {
            ++openParanthesisCount;
        }
        else if (c == ')') {
            if (openParanthesisCount > 0) {
                --openParanthesisCount;
            }
            else {
                c = 0;
            }
        }
    }

    int closedParanthesisCount = 0;
    for (auto& c: result | std::views::reverse) {
        if (c == ')') {
            ++closedParanthesisCount;
        }
        else if (c == '(') {
            if (closedParanthesisCount > 0) {
                --closedParanthesisCount;
            }
            else {
                c = 0;
            }
        }
    }

    std::erase(result, 0);
    return result;
}

int main() {
    auto answer = minRemoveToMakeValid("))lee(t(c)o)de)((");
    std::println("{}", answer);
}
```

### Problem 12

(From https://leetcode.com/discuss/interview-question/5199816/Meta-or-E5-or-Onsite)

Given a string, you need to find the first non-repeating character in it. For example, given the string `"aaxabb"`, the output should be `"x"` because `x` is the first character that does not repeat.

Detailed Explanation

1. **Input:**
    - A string, e.g., `"aaxabb"`.
2. **Output:**
    - The first non-repeating character in the string. For the given example, the output is `"x"`.

#### Solution

```cpp
#include <iostream>
#include <print>
#include <ranges>
#include <unordered_map>

std::optional<int> firstNonRepeatingChar(std::string const& input_str) {
    std::unordered_map<char, int> indexOfChar;
    for (auto const& [index, c]: input_str | std::views::enumerate) {
        indexOfChar[c] = index;
    }
    for (auto const& [index, c]: input_str | std::views::enumerate) {
        auto& knownIndex = indexOfChar[c];
        if (index == knownIndex) {
            return index;
        }
        knownIndex = index;
    }

    return {};
}

int main() {
    auto firstNonRepeatingCharIndex = firstNonRepeatingChar("aaxabb");
    std::println("{}", firstNonRepeatingCharIndex.value());
}
```

### Problem 11

https://leetcode.ca/2021-04-14-1762-Buildings-With-an-Ocean-View/

#### Solution

```cpp
#include <algorithm>
#include <iostream>
#include <print>
#include <ranges>
#include <vector>

std::vector<int> buildingsWithOceanView(std::vector<int> const& heights) {
    int maxHeight = 0;
    std::vector<int> buildings;

    for (auto const& [index, height]: heights
            | std::views::enumerate
            | std::views::reverse
    ) {
        if (height > maxHeight) {
            buildings.push_back(index);
        }
        maxHeight = std::max(maxHeight, height);
    }

    std::ranges::reverse(buildings);
    return buildings;
}

int main() {
    auto buildings = buildingsWithOceanView({4, 2, 3, 1});
    for (auto const& building: buildings) {
        std::print("{} ", building);
    }
    std::println();
}
```

### Problem 12

https://leetcode.ca/2020-06-06-1650-Lowest-Common-Ancestor-of-a-Binary-Tree-III/

Followup: He followed up with a constraint that the node might not be part of the current tree, how would you handle that scenario.

#### Solution

##### Original

```cpp
#include <iostream>
#include <print>

class TreeNode {
public:
    int value;
    TreeNode* parent = nullptr;
};

TreeNode* lowestCommonAncestor(TreeNode* const& node1, TreeNode* const& node2) {
    auto node1It = node1, node2It = node2;
    while (node1It != node2It) {
        node1It = (node1It->parent == nullptr) ? node2 : node1It->parent;
        node2It = (node2It->parent == nullptr) ? node1 : node2It->parent;
    }
    return node1It;
}

int main() {
    auto t3 = new TreeNode(3);
    auto t5 = new TreeNode(5, t3);
    auto t1 = new TreeNode(1, t3);
    auto t6 = new TreeNode(6, t5);
    auto t2 = new TreeNode(2, t5);
    auto t0 = new TreeNode(0, t1);
    auto t8 = new TreeNode(8, t1);
    auto t7 = new TreeNode(7, t2);
    auto t4 = new TreeNode(4, t2);

    auto lca = lowestCommonAncestor(t6, t7);
    std::println("{}", lca->value);
}
```

##### Followup

```cpp
#include <iostream>
#include <print>

class TreeNode {
public:
    int value;
    TreeNode* parent = nullptr;
};

TreeNode* lowestCommonAncestor(TreeNode* const& node1, TreeNode* const& node2) {
    auto node1It = node1, node2It = node2;
    for (auto _ = 3; _--;) {
        while (true) {
            if (node1It == nullptr) {
                node1It = node2;
                break;
            }
            if (node2It == nullptr) {
                node2It = node1;
                break;
            }
            if (node1It == node2It) {
                return node1It;
            }
            node1It = node1It->parent;
            node2It = node2It->parent;
        }
    }

    throw std::invalid_argument(std::format(
        "node1 '{}' and node2 '{}' don't have a common ancestor",
        node1->value,
        node2->value
    ));
}

int main() {
    auto t3 = new TreeNode(3);
    auto t5 = new TreeNode(5, t3);
    auto t1 = new TreeNode(1, t3);
    auto t6 = new TreeNode(6, t5);
    auto t2 = new TreeNode(2, t5);
    auto t0 = new TreeNode(0, t1);
    auto t8 = new TreeNode(8, t1);
    auto t7 = new TreeNode(7, t2);
    auto t4 = new TreeNode(4, t2);
    auto t9 = new TreeNode(9);

    auto lca = lowestCommonAncestor(t3, t9);
    std::println("{}", lca->value);
}
```

### Problem 13

https://leetcode.com/discuss/interview-question/5199816/Meta-or-E5-or-Onsite

Given a string with nums "123", convert it into an integer and return. He was looking for type overflow conditions, also discussed about if the input was greater than Long.MAX_VALUE, how would we solve the problem then? Gave a solution with divide and merge approach. He was fine with it, but asked me to only code considering it is a Long input.

#### Solution

```cpp
#include <cassert>
#include <iostream>
#include <limits>
#include <print>

namespace STL {
    std::optional<uint64_t> toInt(std::string const& str) {
        if (str.starts_with('-')) {
            return {};
        }
        try {
            return std::stoull(str);
        } catch (std::out_of_range const&) {
            return {};
        }
    }
}

namespace Implementation {
    std::optional<uint64_t> toInt(std::string const& str) {
        if (str.starts_with('-')) {
            return {};
        }
        uint64_t strAsInt = 0;
        for (auto const& c: str) {
            if (strAsInt > std::numeric_limits<uint64_t>::max() / 10) {
                return {};
            }
            strAsInt *= 10;

            int digit = c - '0';
            if (strAsInt > std::numeric_limits<uint64_t>::max() - digit) {
                return {};
            }
            strAsInt += digit;
        }
        return strAsInt;
    }
}

int main() {
    using namespace Implementation;

    assert(toInt("0") == 0ull);
    assert(toInt("1") == 1ull);
    assert(toInt("18446744073709551614") == 18446744073709551614ull);
    assert(toInt("18446744073709551615") == 18446744073709551615ull);
    assert(toInt("18446744073709551616") == std::nullopt);
    assert(toInt("-1") == std::nullopt);
    assert(toInt("-18446744073709551614") == std::nullopt);
    assert(toInt("-18446744073709551615") == std::nullopt);
    assert(toInt("-18446744073709551616") == std::nullopt);
}
```

### Problem 14

https://leetcode.com/problems/merge-k-sorted-lists/description/

#### Solution

```cpp
#include <forward_list>
#include <iostream>
#include <print>
#include <queue>
#include <vector>

std::forward_list<int> mergeLists(std::vector<std::forward_list<int>> const& lists) {
    using It = std::forward_list<int>::const_iterator;
    using QueueElement = std::tuple<It, It>;

    auto compareQueueElements = [](auto const& a, auto const& b) -> bool {
        return *std::get<0>(a) > *std::get<0>(b);
    };

    std::priority_queue<QueueElement, std::vector<QueueElement>, decltype(compareQueueElements)> queue;
    
    for (auto const& list: lists) {
        queue.emplace(list.cbegin(), list.cend());
    }

    std::forward_list<int> mergedList;
    auto mergedListIt = mergedList.cbefore_begin();

    while (!queue.empty()) {
        auto [curIt, endIt] = queue.top();
        queue.pop();

        mergedListIt = mergedList.insert_after(mergedListIt, *curIt);
        if (++curIt != endIt) {
            queue.emplace(curIt, endIt);
        }
    }

    return mergedList;
}

std::forward_list<int> mergeLists(std::vector<std::forward_list<int>>&& lists) {
    using It = std::forward_list<int>::iterator;
    using QueueElement = std::forward_list<int>;

    auto compareQueueElements = [](auto const& a, auto const& b) -> bool {
        return *a.begin() > *b.begin();
    };

    std::priority_queue<QueueElement, std::vector<QueueElement>, decltype(compareQueueElements)> queue;

    for (auto& list: lists) {
        queue.push(std::move(list));
    }

    std::forward_list<int> mergedList;
    auto mergedListIt = mergedList.cbefore_begin();

    while (!queue.empty()) {
        auto list = queue.top();
        queue.pop();

        mergedList.splice_after(mergedListIt, list, list.cbefore_begin());
        mergedListIt = std::next(mergedListIt);
        if (!list.empty()) {
            queue.push(std::move(list));
        }
    }

    return mergedList;
}

int main() {
    {
        auto lists = std::vector<std::forward_list<int>> {
            {10, 20, 20, 40},
            {0, 30, 70},
            {20, 40, 70, 90, 100}
        };

        auto l = mergeLists(lists);

        for (auto const& x: l) {
            std::print("{} ", x);
        }
        std::println();
    }
    {
        auto l = mergeLists({
            {10, 20, 20, 40},
            {0, 30, 70},
            {20, 40, 70, 90, 100}
        });

        for (auto const& x: l) {
            std::print("{} ", x);
        }
        std::println();
    }
}
```

### Problem 15

https://leetcode.com/problems/swim-in-rising-water/description/

#### Solution

```cpp
#include <iostream>
#include <numeric>
#include <print>
#include <vector>

class DSU {
public:
    std::vector<int> parent;
    
    DSU(int n) {
        parent.resize(n, -1);
    }

    int root(int v) {
        if (parent[v] < 0) return v;

        int root = v;
        while (parent[root] >= 0) {
            root = parent[root];
        }

        while (parent[v] >= 0) {
            int parentV = parent[v];
            parent[v] = root;
            v = parentV;
        }

        return root;
    }

    bool isSame(int u, int v) {
        return root(u) == root(v);
    }

    bool join(int u, int v) {
        std::println("join: {} {}", u, v);
        u = root(u);
        v = root(v);
    
        if (u == v) {
            return false;
        }

        if (parent[u] > parent[v]) {
            std::swap(u, v);
        }

        parent[u] += parent[v];
        parent[v] = u;
        return true;
    }
};

int minimumWaterLevel(std::vector<std::vector<int>> const& island) {
    int rowCount = island.size();
    int colCount = island.front().size();

    auto cellIndexToPosition = [&](int cellIndex) -> std::tuple<int, int> {
        int row = cellIndex / colCount;
        int col = cellIndex - row * colCount;
        return {row, col};
    };

    auto positionToCellIndex = [&](std::tuple<int, int> const& position) -> int {
        auto [row, col] = position;
        return row * colCount + col;
    };

    std::vector<int> cells(rowCount * colCount);
    std::iota(cells.begin(), cells.end(), 0);

    auto startIndex = cells.front();
    auto endIndex = cells.back();

    std::sort(cells.begin(), cells.end(), [&](auto const& a, auto const& b) -> bool {
        auto [aRow, aCol] = cellIndexToPosition(a);
        auto [bRow, bCol] = cellIndexToPosition(b);

        return island[aRow][aCol] < island[bRow][bCol];
    });

    DSU dsu(cells.size());

    auto isValidPosition = [&](std::tuple<int, int> const& position) -> bool {
        auto [row, col] = position;

        if (row < 0 || row >= rowCount) {
            return false;
        }
        if (col < 0 || col >= rowCount) {
            return false;
        }

        return true;
    };


    auto checkAndJoinCell1ToCell2 = [&](
        std::tuple<int, int> const& position1,
        std::tuple<int, int> const& position2
    ) {
        if (!isValidPosition(position1)) {
            return;
        }
        if (!isValidPosition(position2)) {
            return;
        }

        auto [row1, col1] = position1;
        auto [row2, col2] = position2;
        auto waterLevel1 = island[row1][col1];
        auto waterLevel2 = island[row2][col2];


            int cellIndex1 = positionToCellIndex(position1);
            int cellIndex2 = positionToCellIndex(position2);
        std::println("checkAndJoinCell1ToCell2: {} {}", cellIndex1, cellIndex2);


        if (waterLevel2 <= waterLevel1) {

            dsu.join(cellIndex1, cellIndex2);
        }
    };

    for (auto const& cellIndex: cells) {
        auto [row, col] = cellIndexToPosition(cellIndex);

        checkAndJoinCell1ToCell2({row, col}, {row - 1, col});
        checkAndJoinCell1ToCell2({row, col}, {row + 1, col});
        checkAndJoinCell1ToCell2({row, col}, {row, col - 1});
        checkAndJoinCell1ToCell2({row, col}, {row, col + 1});
        
        if (dsu.isSame(startIndex, endIndex)) {
            return island[row][col];
        }
    }
    
    return 0;
}

int main() {
    int answer = minimumWaterLevel({
        {0, 1, 2, 3, 4},
        {24, 23, 22, 21, 5},
        {12, 13, 14, 15, 16},
        {11, 17, 18, 19, 20},
        {10, 9, 8, 7, 6}
    });
    std::println("{}", answer);
}
```

### Problem 16

https://leetcode.com/problems/random-pick-with-weight/description/

#### Solution

Refer to: https://www.keithschwarz.com/darts-dice-coins/

```cpp
#include <functional>
#include <iostream>
#include <print>
#include <random>
#include <ranges>
#include <stack>
#include <vector>

class RandomPicker {
private:
    class Alias {
    public:
        int index;
        double probability;
    };

    inline static thread_local std::default_random_engine re {std::random_device {}()};
    std::vector<Alias> aliases;
    
    static bool bernoulli(double p) {
        static std::bernoulli_distribution bernoulli;
        using param_t = decltype(bernoulli)::param_type;
        return bernoulli(re, param_t {p});
    }

    static int uniform_int(int a) {
        static std::uniform_int_distribution<int> uniform_int;
        using param_t = decltype(uniform_int)::param_type;
        return uniform_int(re, param_t {0, a - 1});
    }


public:
    RandomPicker(std::vector<int> const& weights) {
        int n = weights.size();
        
        auto sum = std::reduce(weights.cbegin(), weights.cend());
        // std::println("sum: {}", sum);

        std::stack<Alias> small, large;

        for (auto const& [index, weight]: weights | std::views::enumerate) {
            auto p = n * static_cast<double>(weight) / sum;
            if (p < 1) {
                small.emplace(index, p);
                // std::println("small add: {}, {}", index, p);
            } else {
                large.emplace(index, p);
                // std::println("large add: {}, {}", index, p);
            }
        }

        aliases.resize(n);

        while (!small.empty() && !large.empty()) {
            auto smallAlias = small.top();
            small.pop();

            auto largeAlias = large.top();
            large.pop();

            aliases[smallAlias.index] = {largeAlias.index, smallAlias.probability};
            // std::println("aliases[{}] = {}, {}", smallAlias.index, largeAlias.index, smallAlias.probability);

            largeAlias.probability = largeAlias.probability + smallAlias.probability - 1;

            if (largeAlias.probability < 1) {
                small.push(largeAlias);
            } else {
                large.push(largeAlias);
            }
        }
        while (!large.empty()) {
            auto largeAlias = large.top();
            large.pop();
            aliases[largeAlias.index] = {-1, 1};
            // std::println("aliases[{}] = -1, 1", largeAlias.index);
        }
        while (!small.empty()) {
            auto smallAlias = small.top();
            small.pop();
            aliases[smallAlias.index] = {-1, 1};
            // std::println("aliases[{}] = -1, 1", smallAlias.index);
        }
    }

    int pickIndex() const {
        int index = uniform_int(aliases.size());
        auto alias = aliases[index];
        if (bernoulli(alias.probability)) {
            return index;
        } else {
            return alias.index;
        }
    }
};

int main() {
    auto weights = std::vector<int> {5, 8, 4, 10, 4, 4, 5};
    auto picker = RandomPicker(weights);

    int n = weights.size();
    std::vector<int> count(n, 0);
    int sampleCount = 100000;
    for (int i = 0; i < sampleCount; ++i) {
        ++count[picker.pickIndex()];
    }
    
    auto weightsSum = std::reduce(weights.cbegin(), weights.cend());

    for (int i = 0; i < n; ++i) {
        std::print("{:.2f} ", double(count[i]) * weightsSum / sampleCount);
    }
    std::println();
}
```

### Problem 17

LRU Cache

#### Solution

```cpp
#include <iostream>
#include <list>
#include <print>
#include <unordered_map>

template<std::forward_iterator It>
class std::hash<It> {
public:
    size_t operator()(It const& it) const noexcept {
        return std::hash<std::iter_value_t<It>*>()(std::addressof(*it));
    }
};

template<typename K, typename V>
class LRUCache {
private:
    using It = std::list<std::tuple<K, V>>::iterator;
    std::list<std::tuple<K, V>> lruElements;
    std::unordered_map<K, It> keyValueMap;
    int maxSize = 2;

public:
    std::optional<V> get(K const& key) {
        auto mapIt = keyValueMap.find(key);
        if (mapIt == keyValueMap.end()) {
            return {};
        }
        auto listIt = mapIt->second;
        lruElements.splice(lruElements.begin(), lruElements, listIt);
        return std::get<1>(*listIt);
    }

    void put(K const& key, V const& value) {
        auto mapIt = keyValueMap.find(key);
        if (mapIt == keyValueMap.end()) {
            if (lruElements.size() == maxSize) {
                auto const& key = std::get<0>(lruElements.back());
                keyValueMap.erase(key);
                lruElements.pop_back();
            }
            lruElements.emplace_front(key, value);
            keyValueMap.emplace(key, lruElements.begin());
        } else {
            auto listIt = mapIt->second;
            std::get<1>(*listIt) = value;
            lruElements.splice(lruElements.begin(), lruElements, listIt);
        }
    }
};

int main() {
    auto cache = LRUCache<std::string, int>();
    cache.put("abc", 1);
    cache.put("def", 4);
    cache.put("gh", 10);
    cache.put("abc", 5);
    std::println("{}", cache.get("def").has_value());
}
```

