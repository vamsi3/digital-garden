---
title: Find Loop In Linked List And Delete Alternate Elements Of Loop
---

```cpp
#include <iostream>
#include <print>
#include <ranges>

template<typename T>
class ForwardList {
public:
    class Node {
    public:
        Node* next = nullptr;
        T value;
    };

private:
    Node* beforeBegin = new Node();
    Node* last = beforeBegin;

public:
    Node* const& getBeforeBegin() const {
        return this->beforeBegin;
    }

    Node* const pushBack(T&& element) {
        auto newNode = new Node();
        newNode->value = element;
        this->last->next = newNode;
        this->last = newNode;
        return newNode;
    }

    Node* const pushBack(T&& element, Node* const& next) {
        auto newNode = new Node();
        newNode->value = element;
        this->last->next = newNode;
        this->last = newNode;
        this->last->next = next;
        return newNode;
    }

    Node* const oneSpecifcLoopNode() const {
        auto slowIt = beforeBegin;
        auto fastIt = beforeBegin;
        while (true) {
            slowIt = slowIt->next;
            fastIt = fastIt->next;
            if (!fastIt) break;

            fastIt = fastIt->next;
            if (!fastIt) break;

            if (slowIt == fastIt) break;
        }
        return fastIt;
    }

    class FirstLoopNodeResult {
    public:
        Node* const firstLoopNode;
        int lengthUntilLoop;
    };

    std::optional<FirstLoopNodeResult> firstLoopNode() const {
        auto loopIt = oneSpecifcLoopNode();
        if (!loopIt) return {};

        auto listIt = beforeBegin;
        int lengthUntilLoop = 0;
        while (listIt != loopIt) {
            listIt = listIt->next;
            loopIt = loopIt->next;
            ++lengthUntilLoop;
        }
        return {{
            .firstLoopNode = listIt,
            .lengthUntilLoop = lengthUntilLoop,
        }};
    }
};

int main() {
    auto list = ForwardList<int>();
    list.pushBack(1);
    list.pushBack(2);
    auto node3 = list.pushBack(9);
    list.pushBack(4);
    list.pushBack(5);
    list.pushBack(11);
    list.pushBack(10);
    list.pushBack(8, node3);

    auto result = list.firstLoopNode();
    std::println("firstLoopNode: {}", result->firstLoopNode->value);
    std::println("lengthUntilLoop: {}", result->lengthUntilLoop);
}
```