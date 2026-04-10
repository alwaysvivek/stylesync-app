# StyleSync

StyleSync is a high-fidelity design discovery platform that transforms any website into a fully interactive design system. Built for engineers and designers, it automates the extraction of brand colors, typography, scaling systems, and assets, allowing for real-time visual inspection and synchronization.

## 🚀 Key Features

- **Intelligent Extraction**: Uses Playwright and custom heuristics to identify brand-accurate design tokens.
- **Time Machine (Undo/Redo)**: Full backend-backed version history for all token edits.
- **Token Locking**: Protect specific values (e.g., brand primary color) while experimenting with others.
- **Typography Inspector**: Comprehensive editor for font families, sizes, weights, and line-heights with live specimen previews.
- **Multi-Format Export**: Export your design system as CSS variables, JSON tokens, or Tailwind configuration.

## 🧠 Philosophy: Why Desktop-First?

StyleSync is intentionally optimized for **desktop engineering workstations**. 

As a professional design tool, StyleSync prioritizes:
1. **Visual Precision**: High-fidelity inspection of brand assets requires large-screen estate to prevent visual clutter.
2. **Complex Workflows**: The side-by-side comparison of original sites and extracted tokens is an inherently multi-window desktop activity.
3. **Engineering Efficiency**: The extraction/editing workflow is built for professional monitors where developers spend 99% of their design-to-code time.

While the final exported tokens can be consumed on any platform (Mobile, Tablet, Web), the **StyleSync Dashboard** is a desktop-first productivity hub.

## 🛠️ Tech Stack

- **Backend**: FastAPI with SQLAlchemy 2.0 (Async) & PostgreSQL (Neon DB).
- **Extraction**: Playwright (Headless Browser) & ColorThief (Visual Analysis).
- **Frontend**: Next.js 16 (App Router), Zustand (State), Framer Motion (Animations).
- **Styling**: Vanilla CSS Variables for maximum flexibility.

## 📦 Getting Started

### Local Development

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker (Single Container)

To run the entire platform in a single container:

```bash
docker build -t stylesync .
docker run -p 3000:3000 -p 8000:8000 stylesync
```

## 🌐 Deployment to Render

To deploy StyleSync to Render as a single Web Service:

1. **Create a New Web Service**: Link your GitHub repository.
2. **Select Runtime**: Choose **Docker**.
3. **Configure Environment Variables**:
   - `DATABASE_URL`: Set this to your Neon connection string. (Format: `postgresql+asyncpg://user:pass@host/db?sslmode=require`)
   - `PORT`: Set this to `80` (This is the port Nginx listens on).
4. **Deploy**: Render will build the container using the root-level `Dockerfile` and serve both the frontend and API through a single URL.

---
**Crafted for the Vibe Coder Assessment.**
