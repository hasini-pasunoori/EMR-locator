# 📖 How to View EMResource Documentation

## 🌐 Interactive Visualizations (Open in Browser)

### 1. **Data Flow Visualization** 
```bash
open docs/data-flow-visualization.html
```
- Interactive Mermaid diagrams
- Authentication flow
- Resource discovery flow  
- Emergency request flow
- Role-based access control

### 2. **Network Component Diagram**
```bash
open docs/network-diagram.html
```
- Interactive D3.js network graph
- Component relationships
- Drag and drop nodes
- Hover for details
- Adjustable link distances

## 📄 Documentation Files (Read in IDE/Text Editor)

### Core Documentation
- **`REVIEW_DOCUMENTATION.md`** - Complete project overview
- **`ARCHITECTURE_OVERVIEW.md`** - System architecture details
- **`REVIEW_SUMMARY.md`** - Executive summary for review

### Technical Details
- **`ROUTES_DOCUMENTATION.md`** - All API endpoints
- **`ARCHITECTURE_DIAGRAMS.md`** - Mermaid diagram code
- **`route-analysis.json`** - Complete route analysis data
- **`route-map.json`** - Route mapping structure

## 🚀 Quick Start Commands

```bash
# Navigate to docs folder
cd docs

# Open interactive visualizations
open data-flow-visualization.html
open network-diagram.html

# View main documentation
cat REVIEW_DOCUMENTATION.md
cat ARCHITECTURE_OVERVIEW.md
cat REVIEW_SUMMARY.md
```

## 📊 What Each File Contains

| File | Content | Best Viewed In |
|------|---------|----------------|
| `data-flow-visualization.html` | Interactive flow diagrams | **Browser** |
| `network-diagram.html` | Component network graph | **Browser** |
| `REVIEW_DOCUMENTATION.md` | Complete project guide | IDE/Text Editor |
| `ARCHITECTURE_OVERVIEW.md` | System architecture | IDE/Text Editor |
| `ROUTES_DOCUMENTATION.md` | API endpoints | IDE/Text Editor |
| `route-analysis.json` | Technical route data | IDE/JSON Viewer |

## 🎯 For Code Review

**Start with these files in order:**
1. `REVIEW_SUMMARY.md` - Quick overview
2. `data-flow-visualization.html` - Visual understanding
3. `REVIEW_DOCUMENTATION.md` - Detailed analysis
4. `network-diagram.html` - Component relationships

## 💡 Tips

- Use **browser** for `.html` files (interactive features)
- Use **IDE** for `.md` files (better formatting)
- Use **JSON viewer** for `.json` files (structured data)
- All files are in `/docs` folder of your project