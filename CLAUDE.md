# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Animation Development
```bash
# Compile single animation
gulp animation -i <file>          # Basic compilation
gulp animation -i <file> -w       # Watch mode
gulp animation -i <file> -l       # Use local library

# Compile animation group
gulp animationGroup -i <directory>    # Basic compilation
gulp animationGroup -i <directory> -w # Watch mode
```

### Presentation Development
```bash
# Generate presentation
gulp ppt -i <directory>           # Basic compilation
gulp ppt -i <directory> -w        # Watch mode
gulp ppt -i <directory> -l        # Use local library
```

## Codebase Architecture

### Core Components

1. Animation System (`/SD/Animate/`)
- Actions and transformations
- Context management
- Window system
- Timeline control

2. Node System (`/SD/Node/`)
- Core reactive system (`/Node/Core/Reactive.ts`)
- Shape primitives (Circle, Rect, Polygon)
- UI controls (Button, Input, Slider)
- Path management
- Text rendering

3. Layout System (`/SD/Layout/`)
- Array-based layouts (Stack, Pile)
- Curve-based layouts (Bezier, Brace)
- Graph layouts (DAG, BipartiteGraph)
- Grid layouts
- Two-node layouts (Aside, Background)

4. Rendering System (`/SD/Renderer/`)
- Dual renderer support (HTML and SVG)
- Attribute management
- RenderNode abstraction

### Key Features

1. Presentation Framework
- Built on modified reveal.js
- MathJax integration for mathematical formulas
- Code block highlighting
- Custom syntax extensions

2. Animation Framework
- Action-based animation system
- Interpolation framework
- Complex layout algorithms
- Shape and path primitives

3. Interactive Elements
- Device interaction handling
- Status management
- UI controls library
- Event system

## File Organization

```
/SD/                # Core library
  /Animate/         # Animation system
  /Interact/        # User interaction
  /Layout/          # Layout algorithms
  /Math/            # Math utilities
  /Node/            # Core components
  /Renderer/        # Rendering systems
  /Utility/         # Helper utilities
/Reveal/           # Presentation framework
  /css/            # Styling
  /plugin/         # Plugins
```

## Working with the Codebase

### Key Development Patterns

1. Node-Based Architecture
- All visual elements inherit from `SDNode`
- Specialized into `SDHTMLNode` and `SDSVGNode`
- Uses reactive system for state management

2. Layout System
- Choose appropriate layout based on visualization needs
- Layouts are composable and extensible
- Support for complex arrangements (graphs, grids, arrays)

3. Animation System
- Action-based transformations
- Timeline management
- Window and context system

4. Rendering
- Support for both SVG and HTML outputs
- Consistent attribute management
- Path and shape primitive system

5. Math Integration
- Built-in vector operations
- MathJax for formula rendering
- Mathematical utilities in `/Math/`