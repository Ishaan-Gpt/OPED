# Global Design Rules

## 1. Palette Rules
- **Base Theme**: White (`#ffffff`), Off-White (`#f9fafb`)
- **Accent 1 (Royal Red)**: Primary (`#8B0000`), Accent (`#A71D2A`)
- **Accent 2 (Teal Green)**: Primary (`#005F56`), Accent (`#0D7A70`)
- **Accent 3 (Brown)**: Primary (`#4A3525`), Accent (`#6D4C41`)
- **Rule**: NO OTHER COLORS are permitted. Use varying opacity if needed, but do not introduce new hues.

## 2. Component Independence & Modularity
- Every UI element must be a standalone functional component.
- Props must explicitly define the behavior.
- Avoid passing generic `className` strings deeply if it overrides the base design.
- Components must be in `src/components/ui/` and compose together.

## 3. Styling approach
- We use Tailwind CSS V4 for utilities, governed strictly by the theme variables.
- "Photorealistic" depth is achieved using specific shadows and layered borders, not flat design.

## 4. Animation & Interactivity
- Hover states should use subtle scaling and shadow expansion (`framer-motion` or CSS transitions).
- Scroll-driven animations (`lenis`) should feel frictionless. No jarring pop-ins.
- Staggered reveals on load.
