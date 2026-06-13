# Design Spec: Xeno Landing Page - Industrial Monolith Redesign

## Goal
Redesign the Xeno landing page to be "refreshing, unique, and not looking like it was built by AI." 
Moving away from the "Minimalist Obsidian" default toward a "Cold Luxury / Industrial Monolith" aesthetic that implies precision, scale, and high-end engineering.

## Aesthetic Direction: Industrial Monolith
- **Palette**: Cold Metals (Silver, Chrome, Smoke, Charcoal).
  - Background: Zinc-950 (`#09090b`) as the foundation, with Zinc-900 (`#18181b`) panels.
  - Accents: Chrome (`#e4e4e7`) and Silver (`#a1a1aa`).
  - Text: High-contrast Off-white (`#fafafa`) for headlines, Muted Silver (`#71717a`) for body.
- **Typography**: Geist Display (Next.js font).
  - Headlines: `tracking-tighter`, `leading-none`, `font-bold`.
  - Mono: Geist Mono for technical labels and status indicators.
- **Materiality**: 1px "etched" lines, brushed metal textures (simulated via subtle gradients/noise), and zero drop-shadows (using inset borders for depth instead).

## Layout & Sections

### 1. Hero: The Precision Opening
- **Anchor**: Asymmetric Split (60/40).
- **Left**: Headline "Precision Audience Orchestration." (`text-7xl`). Subtext (max 20 words) focused on the "Industrial Scale" of the data processing.
- **Right**: A "Steel Monolith" visual—an abstract 3D-like block with 1px etched lines representing node connections.
- **CTA**: Single "Open Workspace" button in Chrome-finish (solid white with silver hover).

### 2. Proof: The Global Node Cluster
- **Visual**: Logo wall of "Simple Icons" in monotone silver. 
- **Rule**: Logo only, no labels. Rendered with 50% opacity, 100% on hover.

### 3. Feature: Architectural Segments
- **Anchor**: Editorial side-image (Left Text / Right Asset).
- **Visual**: A technical wireframe diagram of shopper clusters. No "AI glow"—just sharp, precise black-on-silver lines.
- **Copy**: Focus on "Neural Node Parsing."

### 4. Workflow: The Logic Gate
- **Anchor**: Vertical staggered list.
- **Visual**: 3 steps connected by 1px vertical hairlines. 
- **Icons**: Phosphor Icons (Thin weight) in Chrome finish.

### 5. Pricing: The Tiers
- **Anchor**: 3-column inset grid.
- **Visual**: Cards look like "inset panels" in a machine casing (using `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`).
- **Contrast**: "Pro" tier is highlighted with a brushed-silver background.

### 6. Closing: The Final Core
- **Anchor**: Stacked center, massive type.
- **Visual**: Full-bleed background of brushed charcoal metal with a single 1px silver border around the whole viewport.

## Motion Specs (GSAP & Motion/React)
- **Entrance**: Staggered "Slide Up + Fade" for hero elements.
- **Scroll**: "Scroll-reveal" for section headlines using a 1px silver line that "draws itself" horizontally.
- **Tactile**: Buttons use `scale-[0.98]` on click to feel like a physical metal push.

## Pre-Flight Checks
- [x] ZERO em-dashes (`—`).
- [x] ONE accent color (Chrome/Silver).
- [x] Viewport stability: `min-h-[100dvh]`.
- [x] No "AI-purple" or "mesh gradients".
