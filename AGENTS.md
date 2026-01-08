# Agent Guidelines for Onitama Clone

## Development Commands

### Building & Development
- `npm start` - Start dev server on http://localhost:3000
- `npm run build` - Build for production (outputs to `build/`)
- `npm test` - Run Jest tests in watch mode
- `npm test -- --watchAll=false` - Run all tests once (non-watch mode)

### Running Single Tests
```bash
# Run a specific test file
npm test -- path/to/file.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="testName"

# Run tests without watch mode with coverage
npm test -- --watchAll=false --coverage
```

### Linting
- ESLint is configured via react-scripts (no explicit lint script)
- Lint errors appear in console during development
- Extends: `react-app` and `react-app/jest`

## Code Style Guidelines

### Imports
- Group imports: 1) Third-party, 2) Internal types, 3) Internal modules
- Use named imports for React hooks: `import { useState, useEffect } from "react"`
- Type imports can be mixed with regular imports
- Use relative paths: `import { GameState } from "../types/index"`

### File Organization
- `src/types/` - All TypeScript type definitions
- `src/components/` - React components
- `src/pages/` - Page-level components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/reducers/` - Reducer functions and game logic
- `src/classes/` - Class definitions

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig.json)
- Use readonly types for immutability: `readonly Move[]`, `ReadonlyMap<string, Piece>`
- Explicit return types on public functions
- Use readonly tuples for fixed-length arrays: `readonly [MovementCard, MovementCard]`
- Prefer const assertions: `ALL_CARDS` defined with `as const`

### Naming Conventions
- **Components**: PascalCase - `GameBoard`, `MoveCardElement`
- **Functions**: camelCase - `getValidMoves`, `handlePieceSelect`
- **Constants**: UPPER_SNAKE_CASE - `ALL_CARDS`, `DEFAULT_BOARD`
- **Types/Interfaces**: PascalCase - `GameState`, `Position`, `Piece`
- **Enums**: PascalCase - `PieceAlias`
- **Private/internal**: No special prefix (use module-level privacy)

### Component Patterns
- Functional components with hooks only (no class components)
- Use `useReducer` for complex state (see `GamePage.tsx`)
- Props should be typed with interfaces
- Use destructuring for props: `function Component({ prop1, prop2 }: Props)`
- Separate UI state from game state (see `UIState` vs `GameState`)

### Styling
- MUI components via `@mui/material` for UI elements
- Inline styles for component-specific styling: `const flexStyle: React.CSSProperties = { ... }`
- External CSS files for grid layouts: `import "../styles/grid.css"`
- Use `sx` prop for MUI responsive styling

### Error Handling
- Use null checks before accessing optional values
- Use non-null assertion `!` only when value is guaranteed to exist
- Type guards for runtime validation
- Return `null` for "no result" cases (not undefined)

### Game Logic
- Board is a `ReadonlyMap<string, Piece>` with keys as `"row,col"`
- Position keys via `posKey({ row, col })` → `"0,1"`
- Use `readonly` for all game state to prevent mutations
- Reducer pattern for state transitions: `commitMove(state, action)`
- AI uses minimax with alpha-beta pruning in `utils/index.ts`

### Testing
- Use Jest + React Testing Library
- Test setup in `src/setupTests.ts`
- No test files currently in repo (add tests for new features)
- Follow TDD when adding new game mechanics

### Formatting
- No explicit formatter configured (Prettier not in package.json)
- Follow existing code style (4-space indentation)
- Use semicolons consistently
- Max line length ~100 characters (based on existing code)

### Key Patterns
1. **Immutability**: Always return new state, never mutate existing state
2. **Separation**: Separate game logic (reducers) from UI (components)
3. **Type Safety**: Use TypeScript for all functions, avoid `any` except where necessary
4. **Readonly**: Use readonly types to enforce immutability at compile time
5. **Position Keys**: Use `posKey()` to convert Position objects to string keys
