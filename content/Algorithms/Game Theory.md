### Simulation

```cpp
#include <optional>
#include <print>
#include <ranges>
#include <unordered_map>
#include <vector>

enum class GameState: int {
    losing = 0,
    winning = 1
};

template<typename GamePosition>
std::unordered_map<GamePosition, GameState> gameStateMemo;

template<typename GamePosition>
auto evaluateGameState(GamePosition position, auto const& getNextGamePositions, auto const& getKnownStates) -> GameState {
    auto& memo = gameStateMemo<GamePosition>;
    if (auto it = memo.find(position); it != memo.end()) {
        return it->second;
    }
    auto& gameState = memo[position];

    if (auto stateOpt = getKnownStates(position); stateOpt) {
        gameState = *stateOpt;
        return gameState;
    }

    gameState = GameState::losing;

    getNextGamePositions(position, [&](auto const& nextGamePosition) {
        auto nextGameState = evaluateGameState(nextGamePosition, getNextGamePositions, getKnownStates);
        if (nextGameState == GameState::losing) {
            gameState = GameState::winning;
            return false;
        }
        return true;
    });

    return gameState;
}

auto main() -> int {
    using GamePosition = std::vector<int>;
    auto getKnownStates = [](GamePosition& position) -> std::optional<GameState> {

    };
    auto getNextGamePositions = [](GamePosition& position, auto const& callback) {
 
    };
	evaluateGameState(position, getNextGamePositions, getKnownStates)
}
```