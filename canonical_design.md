# THE STACK — COMPLETE DESIGN SYSTEM SPECIFICATION

**Version:** 1.0 — February 9, 2026
**Purpose:** This document is the single source of truth for transforming any presentation, document, or visual asset into The Stack brand identity. Follow every rule exactly. When in doubt, this document is correct.
**Audience:** AI agents (Claude Code, etc.), designers, developers.

---

## TABLE OF CONTENTS

1. Brand Identity Overview
2. Color System (Dark Mode)
3. Color System (Light Mode — Vivid Strata / Cool White)
4. Typography
5. Spacing & Proportions
6. Slide Architecture
7. Chart System
8. Components
9. Logo Specification
10. Do / Don't Rules
11. Implementation Notes for Agents

---

## 1. BRAND IDENTITY OVERVIEW

**Name:** The Stack
**Visual Language:** Dense, data-rich, institutional. Every pixel serves information or hierarchy.
**Palette Name:** Strata
**Font System:** EB Garamond (display) + Inter (body) + JetBrains Mono (data)

---

## 2. COLOR SYSTEM / DARK MODE


### 2.1 Backgrounds & Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0A0A0A` | Primary canvas. Every slide background. NON-NEGOTIABLE. |
| `bg-alt` | `#070707` | Cover slides, section dividers, hero moments |
| `surface-1` | `#111111` | Card backgrounds, chart containers, panels |
| `surface-2` | `#181818` | Hover states, active panels, nested containers |
| `surface-3` | `#1E1E1E` | Table alternate rows, input fields, deepest nesting |
| `border` | `#1E1E1E` | All borders, chart gridlines, separators |
| `border-light` | `#282828` | Subtle separators where `border` is too dark |

### 2.2 Primary — Green (Physical Layer)

The green family is THE identity. It always leads. It always appears first in any chart. It represents the physical infrastructure layer.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-darkest` | `#2D5435` | Pressed states, gradient endpoints |
| `primary-dark` | `#3D6E4A` | Area fills, hover states, secondary emphasis |
| `primary` | `#5A8F6A` | **THE identity color.** Logo, chart series #1, key highlights, CTAs, accent text |
| `primary-light` | `#7BAF8B` | Chart series #3, tags, subtle emphasis, hover |
| `primary-lightest` | `#A3CBAF` | Disabled states, annotations, very subtle accents |
| `primary-muted` | `#5A8F6A40` | 25% opacity. Area chart gradient fills, glow effects, selection highlights. NEVER for text or borders. |

### 2.3 Secondary — Blue (Model / Compute Layer)

It represents the model/compute layer.

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-dark` | `#345E82` | Pressed states, gradient endpoints |
| `secondary` | `#4A7DA8` | Chart series #2, model/compute references, links |
| `secondary-light` | `#6B9DC8` | Chart series #4, hover states |
| `secondary-lightest` | `#92BDE0` | Annotations, 5th option in some contexts |
| `secondary-muted` | `#4A7DA840` | 25% opacity. Area fills, highlights. NEVER for text or borders. |

### 2.4 Extended Palette (5+ chart series only)

These colors exist ONLY for charts that require 5 or 6 series. They are never used for UI, accents, or branding.

| Token | Hex | Usage |
|-------|-----|-------|
| `ext-warm` | `#8B7355` | Chart series #5. Earthy, commodity reference. |
| `ext-warm-light` | `#A0856B` | Paired with ext-warm for hover/light variant |
| `ext-cool` | `#7A7A9B` | Chart series #6. Cool gray. Neutral filler. |

### 2.5 Text Hierarchy — Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F0F0F0` | Headlines, hero numbers, slide titles, key data |
| `text-secondary` | `#C0C0C0` | Body text, descriptions, table data, paragraphs |
| `text-tertiary` | `#999999` | Captions, axis labels, chart titles, source lines, footnotes |
| `text-muted` | `#666666` | Disabled text, placeholders, watermarks, page numbers |
| `text-faint` | `#444444` | Very subtle markers, background text elements |
| `text-inverse` | `#1A1A1A` | Text on light backgrounds (tags, inverted elements) |

### 2.6 Semantic Colors — Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `positive` | `#5A8F6A` | Gains, up arrows, positive changes. Same as primary — intentional. |
| `negative` | `#C45B5B` | Losses, down arrows, negative changes. MUTED red, never bright. |
| `caution` | `#C4A35B` | Alerts, medium-risk indicators. Warm gold. |
| `neutral` | `#999999` | Flat, unchanged, no signal. |

---

## 3. COLOR SYSTEM — LIGHT MODE (VIVID STRATA / COOL WHITE)

Light mode uses DIFFERENT primary/secondary values than dark mode. The hues are the same but pushed to higher saturation and darker values to maintain vibrancy on light backgrounds. The background is Cool White with a very slight blue undertone.

### 3.1 Backgrounds & Surfaces — Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F9FAFB` | Primary canvas. Cool white with very slight blue undertone. |
| `bg-alt` | `#F3F4F6` | Section dividers, hero moments |
| `surface-1` | `#FFFFFF` | Cards, chart containers, panels |
| `surface-2` | `#F6F7F8` | Hover states, nested containers |
| `surface-3` | `#EFF0F2` | Table alternate rows, input fields |
| `border` | `#DDE0E4` | All borders, gridlines, separators |
| `border-light` | `#E6E8EB` | Subtle separators |

### 3.2 Primary — Green (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-dark` | `#065C2D` | Pressed states |
| `primary` | `#0D7A3E` | **Identity color on light.** Logo, series #1, CTAs, accents |
| `primary-light` | `#18A055` | Hover, series #3, tags |
| `primary-muted` | `#0D7A3E18` | ~10% opacity. Area fills, backgrounds. |

### 3.3 Secondary — Blue (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-dark` | `#084A8A` | Pressed states |
| `secondary` | `#0B5EA8` | Series #2, links, model/compute accents |
| `secondary-light` | `#1474C4` | Hover, series #4 |
| `secondary-muted` | `#0B5EA818` | ~10% opacity. Area fills. |

### 3.4 Text Hierarchy — Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#111111` | Headlines, hero numbers, slide titles |
| `text-secondary` | `#2A2A2A` | Body text, descriptions, paragraphs |
| `text-tertiary` | `#585858` | Captions, axis labels, chart titles, sources |
| `text-muted` | `#8A8A8A` | Disabled, placeholders, watermarks |

### 3.5 Semantic Colors — Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `positive` | `#0D7A3E` | Same as primary on light |
| `negative` | `#C43030` | Slightly more saturated than dark mode to read on white |
| `caution` | `#B08415` | Warm gold, darkened for light bg |
| `neutral` | `#8A8A8A` | Same as text-muted |

---

## 4. TYPOGRAPHY

### 4.1 Font Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Display** | EB Garamond | 400 (Regular), 500 (Medium) | Slide titles, cover headlines, hero numbers, big metrics. NEVER below 14px. NEVER for body text. |
| **Body** | Inter | 300 (Light), 400 (Regular), 500 (Medium) | All body copy, descriptions, subtitles, UI labels, captions. The workhorse. |
| **Data** | JetBrains Mono | 300 (Light), 400 (Regular), 500 (Medium) | All numbers in charts/tables, axis labels, hex codes, timestamps, CLI output, financial data. |

**Google Fonts Import:**
```
https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap
```

**CSS Variables:**
```css
--font-display: 'EB Garamond', Georgia, 'Times New Roman', serif;
--font-body: 'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif;
--font-data: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, 'Courier New', monospace;
```

### 4.2 Complete Type Scale

| Level | Font | Size | Weight | Letter-Spacing | Color (Dark) | Color (Light) | Transform | Usage |
|-------|------|------|--------|----------------|--------------|---------------|-----------|-------|
| Display | EB Garamond | 36px | 400 | 0.5px | text-primary | text-primary | none | Cover title, section opener |
| H1 | EB Garamond | 24px | 400 | 0.3px | text-primary | text-primary | none | Slide titles |
| H1-Alt | EB Garamond | 18px | 400 | 0.2px | text-primary | text-primary | none | Dense slide titles (when more content needed) |
| H2 Accent | Inter | 13px | 500 | 1.5px | primary | primary | UPPERCASE | Subtitles, key callouts, section labels |
| H3 | Inter | 12px | 500 | 0.3px | text-secondary | text-secondary | none | Panel headers, card titles |
| Body | Inter | 11px | 400 | 0px | text-secondary | text-secondary | none | All body copy, descriptions |
| Caption | Inter | 10px | 400 | 1.5px | text-tertiary | text-tertiary | UPPERCASE | Chart titles (above chart), source lines |
| Data | JetBrains Mono | 11px | 400 | 0px | text-secondary | text-secondary | none | Numbers, financial values, metrics |
| Axis | JetBrains Mono | 9px | 300 | 0px | text-tertiary | text-tertiary | none | Chart axis labels, small data |
| Micro | JetBrains Mono | 8px | 400 | 2px | text-muted | text-muted | UPPERCASE | Watermarks, page numbers, confidentiality |

### 4.3 Number Formatting Rules

- **Abbreviations:** Always abbreviate large numbers. `$143B` not `$143,000,000,000`. Use B/M/K/T with NO space between number and suffix.
- **Multipliers:** Use `×` (multiplication sign), not "x". Example: `32×`, `5-10×`.
- **Percentages — precision:** One decimal for specific data: `34.1%`. Whole numbers for approximations: `~45%`.
- **Financial prices:** Two decimals for commodity prices: `$4.25/lb`. Zero decimals for large sums: `$600B`.
- **Hero metrics:** Display at 24-36px in EB Garamond, `text-primary` or `primary` color. Maximum ONE hero metric per slide.
- **Change indicators:** Prefix with `+` or `-`. Display in semantic color (positive/negative). Use JetBrains Mono. Size should be ~60% of the hero metric it accompanies.
- **Estimates/Projections:** Suffix with `E` — example: `2025E`, `$600BE`. Display at 60% opacity with dashed underline or border.
- **Date formatting:** `Q1'24`, `Q2'25`, `FY2026`. Use apostrophe for abbreviated year. `Feb 2026` for full months.

### 4.4 Font Usage Decision Tree

```
Is it a title or headline?              → EB Garamond, 18-36px, weight 400
Is it a big number / hero metric?       → EB Garamond, 24-36px, weight 400
Is it body text or a description?       → Inter, 11px, weight 400
Is it a subtitle or accent line?        → Inter, 13px, weight 500, primary color, UPPERCASE
Is it a panel/card header?              → Inter, 12px, weight 500
Is it a number in a chart or table?     → JetBrains Mono, 9-11px, weight 400
Is it an axis label?                    → JetBrains Mono, 8-9px, weight 300
Is it a source line or footnote?        → Inter or JetBrains Mono, 8-9px, text-tertiary
Is it a watermark or page number?       → JetBrains Mono, 8px, weight 400, text-muted, UPPERCASE
Is it a positive/negative change?       → JetBrains Mono, positive or negative semantic color
```

**CRITICAL RULE:** EB Garamond is NEVER used below 14px. Below that size, serifs lose definition on screens. Switch to Inter for anything smaller.

**CRITICAL RULE:** Font weight NEVER exceeds 500 (Medium). There is NO bold (700) in this system. The heaviest weight is Inter 500 for subtitles and accents. EB Garamond uses 400 only.

---

## 5. SPACING & PROPORTIONS


### 5.2 Slide Dimensions

- **Aspect ratio:** 16:9 (standard widescreen)
- **Working area:** The full slide minus margins

### 5.4 Detailed Spacing Values

#### Slide Margins & Padding
| Element | Value | Notes |
|---------|-------|-------|
| Slide outer padding (all sides) | 32px | Consistent on all four sides |
| Header bar height | 40px | Contains logo lockup, wordmark, confidential notice, page number |
| Header-to-separator gap | 0px | Separator sits directly below header content |
| Separator line | 1px solid `border` | Full width within margins |
| Separator-to-title gap | 16px | Space between separator and title text |
| Title block height | 72-88px | Depends on whether subtitle is present |
| Title to subtitle gap | 4px | Tight pairing |
| Title block to content gap | 20px | Primary breathing room between title and charts/content |
| Footer bar height | 24px | Source left, date right |
| Content to footer gap | 16px | Breathing room above footer |


### 5.5 Proportion Rules

- **Top-heavy breathing:** More space between header/title and content (36px total from separator through title to content). Less space at bottom.


### 6.2 Title Block

```
[Slide Title — EB Garamond, 22-24px, weight 400, text-primary, letter-spacing 0.3px]
[4px gap]
[Subtitle — Inter, 11-13px, weight 500, primary color, letter-spacing 1.5px]
```

- Slide title should be a complete, descriptive sentence or phrase. Not just a topic word.

### 6.3 Content Zone

This is where charts, tables, data cards, and body text live. The content zone fills the space between the title block bottom + 20px gap and the footer top - 16px gap.

### 6.4 Footer Bar

```
[Source — "Source: {sources}" Inter or JetBrains Mono, 8px, text-muted]
                                                    [Right-aligned: "{Month Year}" JetBrains Mono, 8px, text-faint]
```

- Source and date share the same y-position, left and right aligned respectively

## 7. CHART SYSTEM

### 7.1 Series Color Assignment — STRICT ORDER

This order is IMMUTABLE. Never skip a step. Never reorder.

| # of Series | Colors (Dark Mode) | Colors (Light Mode) |
|-------------|-------------------|---------------------|
| 1 | `#5A8F6A` | `#0D7A3E` |
| 2 | `#5A8F6A`, `#4A7DA8` | `#0D7A3E`, `#0B5EA8` |
| 3 | `#5A8F6A`, `#4A7DA8`, `#7BAF8B` | `#0D7A3E`, `#0B5EA8`, `#18A055` |
| 4 | `#5A8F6A`, `#4A7DA8`, `#7BAF8B`, `#6B9DC8` | `#0D7A3E`, `#0B5EA8`, `#18A055`, `#1474C4` |
| 5 | + `#8B7355` | + `#8B7355` |
| 6 | + `#7A7A9B` | + `#7A7A9B` |

**MAXIMUM 6 series.** Beyond 6, use small multiples (multiple smaller charts).

**Meaning mapping:** Green = physical layer / primary metric. Blue = model/compute / secondary metric. This is not arbitrary — it encodes thesis meaning.

- **Dashed lines ONLY for:**
  1. Projections/estimates (future data)
  2. Benchmarks (reference lines like S&P 500)
  3. Secondary comparisons (less important context lines)
- **Never dash a primary data series.**
- **Data point dots:** Show only when <8 data points on the line. Primary: 4px radius. Others: 3px radius. No dots on dense time series (monthly data, daily data).

#### Projections
- Projected bars: 60% opacity + 1px dashed border
- Label with "E" suffix (e.g., "2025E", "2026E")
- Projected bars should be visually distinct from historical bars

### 7.6 Chart Titles & Labels

- **Chart title:** Inter, text-tertiary, letter-spacing 1.5px
- **Position:** Above the chart, left-aligned. NEVER centered.
- **Legend:** Inline below chart or to the right. Use colored pointers + label text.
- **Legend font:** JetBrains Mono, 
- **Annotations:** Dashed line in #333333 (dark) / #CCCCCC (light), 0.5px. Max 2 annotations per chart.
- **Key callout:** Highlight ONE number per chart in primary color. Never more than one green-highlighted number per chart.


### 7.8 Chart Container

Every chart sits inside a container:
```
Background: surface-1
Border: 1px solid border
Padding: 16px (all sides)
```
The chart title sits inside the container, at the top-left. The chart SVG/canvas fills the remaining space. The legend sits below the chart within the container.


### 8.4 Separator / Divider Line

- 1px solid `border`
- Full width of content area
- Used between header and content, and optionally between major content sections
- Never use more than 2 separator lines per slide


### 8.6 Footnotes

- Position: Bottom of content zone, above footer
- Font: JetBrains Mono, 8px, text-muted
- Prefix with superscript number: ¹, ², ³
- Separated from content by 12px gap


#### Colors as RGBColor constants
```python
# Dark Mode
BG = RGBColor(0x0A, 0x0A, 0x0A)
SURFACE_1 = RGBColor(0x11, 0x11, 0x11)
SURFACE_2 = RGBColor(0x18, 0x18, 0x18)
SURFACE_3 = RGBColor(0x1E, 0x1E, 0x1E)
BORDER = RGBColor(0x1E, 0x1E, 0x1E)

PRIMARY_DARKEST = RGBColor(0x2D, 0x54, 0x35)
PRIMARY_DARK = RGBColor(0x3D, 0x6E, 0x4A)
PRIMARY = RGBColor(0x5A, 0x8F, 0x6A)
PRIMARY_LIGHT = RGBColor(0x7B, 0xAF, 0x8B)
PRIMARY_LIGHTEST = RGBColor(0xA3, 0xCB, 0xAF)

SECONDARY_DARK = RGBColor(0x34, 0x5E, 0x82)
SECONDARY = RGBColor(0x4A, 0x7D, 0xA8)
SECONDARY_LIGHT = RGBColor(0x6B, 0x9D, 0xC8)
SECONDARY_LIGHTEST = RGBColor(0x92, 0xBD, 0xE0)

EXT_WARM = RGBColor(0x8B, 0x73, 0x55)
EXT_COOL = RGBColor(0x7A, 0x7A, 0x9B)

TEXT_PRIMARY = RGBColor(0xF0, 0xF0, 0xF0)
TEXT_SECONDARY = RGBColor(0xC0, 0xC0, 0xC0)
TEXT_TERTIARY = RGBColor(0x99, 0x99, 0x99)
TEXT_MUTED = RGBColor(0x66, 0x66, 0x66)

POSITIVE = RGBColor(0x5A, 0x8F, 0x6A)
NEGATIVE = RGBColor(0xC4, 0x5B, 0x5B)
CAUTION = RGBColor(0xC4, 0xA3, 0x5B)

# Light Mode (Vivid Strata / Cool White)
LT_BG = RGBColor(0xF9, 0xFA, 0xFB)
LT_SURFACE_1 = RGBColor(0xFF, 0xFF, 0xFF)
LT_SURFACE_2 = RGBColor(0xF6, 0xF7, 0xF8)
LT_SURFACE_3 = RGBColor(0xEF, 0xF0, 0xF2)
LT_BORDER = RGBColor(0xDD, 0xE0, 0xE4)

LT_PRIMARY = RGBColor(0x0D, 0x7A, 0x3E)
LT_PRIMARY_DARK = RGBColor(0x06, 0x5C, 0x2D)
LT_PRIMARY_LIGHT = RGBColor(0x18, 0xA0, 0x55)

LT_SECONDARY = RGBColor(0x0B, 0x5E, 0xA8)
LT_SECONDARY_DARK = RGBColor(0x08, 0x4A, 0x8A)
LT_SECONDARY_LIGHT = RGBColor(0x14, 0x74, 0xC4)

LT_TEXT_PRIMARY = RGBColor(0x11, 0x11, 0x11)
LT_TEXT_SECONDARY = RGBColor(0x2A, 0x2A, 0x2A)
LT_TEXT_TERTIARY = RGBColor(0x58, 0x58, 0x58)
LT_TEXT_MUTED = RGBColor(0x8A, 0x8A, 0x8A)

LT_POSITIVE = RGBColor(0x0D, 0x7A, 0x3E)
LT_NEGATIVE = RGBColor(0xC4, 0x30, 0x30)
LT_CAUTION = RGBColor(0xB0, 0x84, 0x15)

---

## APPENDIX A — COMPLETE HEX REFERENCE (COPY-PASTE)

### Dark Mode
```
Background:     #0A0A0A
BG Alt:         #070707
Surface 1:      #111111
Surface 2:      #181818
Surface 3:      #1E1E1E
Border:         #1E1E1E
Border Light:   #282828

Primary:        #5A8F6A
Primary Dark:   #3D6E4A
Primary Dkst:   #2D5435
Primary Light:  #7BAF8B
Primary Ltst:   #A3CBAF
Primary Muted:  #5A8F6A40

Secondary:      #4A7DA8
Secondary Dark: #345E82
Secondary Lt:   #6B9DC8
Secondary Ltst: #92BDE0
Secondary Mut:  #4A7DA840

Extended Warm:  #8B7355
Extended WmLt:  #A0856B
Extended Cool:  #7A7A9B

Text Primary:   #F0F0F0
Text Secondary: #C0C0C0
Text Tertiary:  #999999
Text Muted:     #666666
Text Faint:     #444444

Positive:       #5A8F6A
Negative:       #C45B5B
Caution:        #C4A35B
Neutral:        #999999
```

### Light Mode (Vivid Strata / Cool White)
```
Background:     #F9FAFB
BG Alt:         #F3F4F6
Surface 1:      #FFFFFF
Surface 2:      #F6F7F8
Surface 3:      #EFF0F2
Border:         #DDE0E4
Border Light:   #E6E8EB

Primary:        #0D7A3E
Primary Dark:   #065C2D
Primary Light:  #18A055
Primary Muted:  #0D7A3E18

Secondary:      #0B5EA8
Secondary Dark: #084A8A
Secondary Lt:   #1474C4
Secondary Mut:  #0B5EA818

Text Primary:   #111111
Text Secondary: #2A2A2A
Text Tertiary:  #585858
Text Muted:     #8A8A8A

Positive:       #0D7A3E
Negative:       #C43030
Caution:        #B08415
Neutral:        #8A8A8A
```

### Chart Series Quick Reference
```
Dark Mode:
  1: #5A8F6A
  2: #4A7DA8
  3: #7BAF8B
  4: #6B9DC8
  5: #8B7355
  6: #7A7A9B

Light Mode:
  1: #0D7A3E
  2: #0B5EA8
  3: #18A055
  4: #1474C4
  5: #8B7355
  6: #7A7A9B
```

### Font Stack
```
Display: 'EB Garamond', Georgia, 'Times New Roman', serif
Body:    'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif
Data:    'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace

Google Fonts URL:
https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap