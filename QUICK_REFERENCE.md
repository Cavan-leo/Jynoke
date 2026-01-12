# Jynoke - Quick Reference Guide

## 🎯 Project Overview

**Jynoke** is a personal tools utility with a modern dark theme. Currently includes:
- 💰 Weight-Price Converter
- 🎲 Dice Roller

**Tech Stack**: React 18 + TypeScript + Tailwind CSS + Vite

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test -- --run

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app, navigation, dark theme
├── components/
│   ├── DiceRoller.tsx        # Dice component
│   ├── WeightPriceConverter.tsx
│   ├── ErrorBoundary.tsx
│   └── index.ts
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    ├── validation.ts         # Input validation
    ├── animation.ts          # Animation helpers
    └── *.test.ts            # Tests
```

---

## 🎨 Design System

### Colors
- **Background**: `from-slate-950 via-slate-900 to-slate-800`
- **Accent**: Blue, Cyan, Purple gradients
- **Glass**: `backdrop-blur-xl bg-white/10 border-white/20`

### Components
- **Buttons**: Gradient backgrounds, hover scale effects
- **Inputs**: Semi-transparent with focus rings
- **Cards**: Glassmorphic with backdrop blur
- **Text**: Gradient text for headings

### Animations
- **Fade In**: 0.5s ease-out on component mount
- **Spin**: 0.5s rotation on dice roll
- **Pulse**: Animated background blobs

---

## 💰 Weight-Price Converter

**What it does**: Calculates price per 500g (per 斤)

**Formula**: `(price / weight) * 500`

**Key Files**:
- `src/components/WeightPriceConverter.tsx` - Component
- `src/utils/validation.ts` - Validation logic
- `src/utils/validation.test.ts` - Tests

**Features**:
- ✅ Real-time validation
- ✅ Error messages
- ✅ Clear button
- ✅ Responsive design

**Example**:
- Input: 500g, 100 yuan
- Output: 100.00 元/斤

---

## 🎲 Dice Roller

**What it does**: Interactive 6-sided dice with click-to-roll

**Key Files**:
- `src/components/DiceRoller.tsx` - Component
- `src/components/DiceRoller.test.ts` - Tests
- `src/utils/animation.ts` - Animation utilities

**Features**:
- ✅ Click to roll
- ✅ 360° rotation animation
- ✅ Animation lock (prevents concurrent rolls)
- ✅ Responsive sizing (60px mobile, 80px desktop)

**Dice Faces**:
- 1: Center dot
- 2: Diagonal corners
- 3: Diagonal line
- 4: Four corners
- 5: Four corners + center
- 6: Two columns of 3

---

## 🧪 Testing

### Run Tests
```bash
npm test -- --run          # Run once
npm test                   # Watch mode
```

### Test Coverage
- **Unit Tests**: 7 tests (specific examples)
- **Property Tests**: 7 tests (100+ iterations each)
- **Total**: 14 tests, all passing

### Test Files
- `src/components/DiceRoller.test.ts`
- `src/utils/validation.test.ts`

---

## 🔧 Common Tasks

### Add a New Tool
1. Create component in `src/components/NewTool.tsx`
2. Add type to `src/types/index.ts`
3. Import in `src/App.tsx`
4. Add tab to navigation
5. Add conditional render in main content area

### Add a Feature
1. Implement in component or utility
2. Add tests in `.test.ts` file
3. Run `npm test -- --run` to verify
4. Run `npm run build` to check bundle size

### Update Styling
1. Edit Tailwind classes in component
2. No CSS files needed (all in JSX)
3. Use `@apply` in `src/index.css` for reusable styles

### Fix a Bug
1. Identify the issue
2. Write a test that reproduces it
3. Fix the code
4. Verify test passes
5. Run full test suite

---

## 📊 Build Info

| Metric | Value |
|--------|-------|
| JS Bundle | 152.27 kB (48.90 kB gzipped) |
| CSS Bundle | 18.93 kB (3.99 kB gzipped) |
| Build Time | 782ms |
| Test Time | 2.69s |

---

## 🎯 Feature Ideas

**Quick Wins** (1-2 hours):
- Copy-to-clipboard
- Light/Dark theme toggle
- Keyboard shortcuts

**Core Features** (2-3 hours):
- History & statistics
- Unit conversion modes
- Settings panel

**Advanced** (3+ hours):
- Batch converter
- Custom dice options
- Favorites/bookmarks

See `FEATURE_SUGGESTIONS.md` for details.

---

## 🐛 Troubleshooting

### Build fails
```bash
npm install              # Reinstall dependencies
npm run build           # Try again
```

### Tests fail
```bash
npm test -- --run       # Run tests
# Check error messages and fix code
```

### Dev server won't start
```bash
npm run dev             # Check for port conflicts
# Default: http://localhost:5173
```

### TypeScript errors
```bash
npm run build           # Shows all errors
# Fix errors in code
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, navigation, theme |
| `src/components/DiceRoller.tsx` | Dice component |
| `src/components/WeightPriceConverter.tsx` | Converter component |
| `src/utils/validation.ts` | Input validation logic |
| `src/utils/animation.ts` | Animation helpers |
| `src/types/index.ts` | TypeScript interfaces |
| `tailwind.config.js` | Tailwind configuration |
| `vite.config.ts` | Vite build configuration |
| `vitest.config.ts` | Test configuration |

---

## 🚀 Deployment

### Build for Production
```bash
npm run build           # Creates dist/ folder
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel                  # Follow prompts
```

### Deploy to Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

---

## 💡 Tips

1. **Use TypeScript**: Catch errors before runtime
2. **Write Tests**: Ensure features work correctly
3. **Check Bundle Size**: Keep it under 200KB
4. **Test Responsive**: Check mobile and desktop
5. **Use Tailwind**: No custom CSS needed
6. **Keep Components Small**: Easier to test and maintain

---

## 📞 Need Help?

- Check `PROJECT_STATUS.md` for overview
- See `FEATURE_SUGGESTIONS.md` for ideas
- Review test files for examples
- Check component comments for logic

---

**Ready to enhance Jynoke?** Pick a feature and let's build! 🎉
