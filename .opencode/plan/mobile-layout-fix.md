# Implementation Plan for Mobile Layout Fixes (< 375px)

## Approved Changes

### CSS Updates (grid.css)
- Add media query for screens < 375px
- Reduce game board cell size to 50px (--cell-max-size)
- Make movement cards smaller: 6px cell size (--move-card-cell-size) - APPROVED FOR BOTH BLUE AND RED CARDS
- Reduce fonts, padding, gaps for compactness
- Keep Next card visible but compact

### GameBoard.tsx Updates
- Change both blue and red card Grids to flexWrap: "nowrap" to prevent stacking
- Reduce spacing to 0.25 for tighter packing
- Ensure no overflow with overflow: hidden

### Expected Outcome
- All movement cards stay side by side without stacking on <375px screens
- Game fits entirely on screens < 375px without scrolling
- Next card always visible but compact
- Cards are very small (6px cells) but functional