# Vtryon - Virtual Try-On Studio

A modern web application built with Astro that enables users to virtually try on clothing items with different models. Perfect for e-commerce platforms and fashion tech applications.

![Astro](https://img.shields.io/badge/Astro-5.2.5-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![CSS3](https://img.shields.io/badge/CSS3-Modular-1572B6)

## ✨ Features

- **🎯 Model Selection**: Choose between female and male model types
- **👥 Model Gallery**: Browse and select from available models
- **👔 Clothing Categories**: Organized clothing selection (Tops, Bottoms, One-Piece)
- **🖼️ Virtual Try-On**: Visual overlay of clothing items on selected models
- **⚡ Real-time Processing**: Interactive processing simulation
- **📱 Responsive Design**: Works seamlessly across all device sizes
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/                     # Static assets
├── src/
│   ├── components/            # Astro components
│   │   ├── ClothesSelector.astro
│   │   ├── ClothingCategory.astro
│   │   ├── Header.astro
│   │   ├── ModelGallery.astro
│   │   ├── ModelTypeSelector.astro
│   │   ├── ModelViewer.astro
│   │   ├── ProcessButton.astro
│   │   ├── Sidebar.astro
│   │   └── Welcome.astro
│   ├── layouts/               # Layout components
│   │   └── Layout.astro
│   ├── pages/                 # Route pages
│   │   └── index.astro
│   ├── scripts/               # Client-side TypeScript
│   │   └── components/
│   │       ├── ClothesSelector.ts
│   │       ├── ClothingCategory.ts
│   │       ├── ModelGallery.ts
│   │       ├── ModelTypeSelector.ts
│   │       ├── ModelViewer.ts
│   │       └── ProcessButton.ts
│   └── styles/                # CSS stylesheets
│       ├── components/        # Component-specific styles
│       ├── layouts/           # Layout styles
│       ├── pages/             # Page-specific styles
│       └── global.css         # Global styles
├── astro.config.mjs           # Astro configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🏗️ Architecture

### Technology Stack
- **Framework**: Astro v5.2.5 (Static Site Generation)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Modular CSS
- **Module System**: ES Modules
- **Architecture Pattern**: Island Architecture with SSG

### Key Design Patterns
- **Component Pattern**: Reusable UI components with separated concerns
- **Atomic Design**: Hierarchical component structure
- **Event-Driven Communication**: Custom events for component interaction
- **SSR-Safe Client Scripts**: Browser API access wrapped in environment checks

### Component Interaction Flow
1. **Model Type Selection** → Filters available models
2. **Model Selection** → Enables clothing selection
3. **Category Selection** → Filters clothing items
4. **Clothing Selection** → Activates processing button
5. **Processing** → Simulates virtual try-on result

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Vtryon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage Guide

1. **Select Model Type**: Choose between Female or Male models
2. **Pick a Model**: Select your preferred model from the gallery
3. **Choose Category**: Select clothing category (Tops, Bottoms, One-Piece)
4. **Select Clothing**: Pick a clothing item to try on
5. **Process**: Click the "Process Image" button to see the virtual try-on result
6. **Reset**: Use the reset button to start over

## 🔧 Technical Features

### TypeScript Integration
- Strict mode enabled for enhanced type safety
- Proper type annotations for DOM elements
- Custom event typing for component communication

### Performance Optimizations
- Static Site Generation (SSG) for fast loading
- Minimal JavaScript footprint
- CSS-only animations where possible
- Lazy loading of images

### Browser Compatibility
- Modern browsers (ES2022+ support)
- Responsive design for mobile and desktop
- Progressive enhancement approach

## 🎨 Styling

- **Modular CSS**: Component-scoped stylesheets
- **CSS Variables**: Consistent theming
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Flexbox, Grid, and CSS animations
- **Design System**: Consistent spacing, colors, and typography

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Follow TypeScript strict mode guidelines
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent indentation (2 spaces)
- Use semantic HTML elements

## 🐛 Troubleshooting

### Common Issues

**Scripts not working?**
- Ensure scripts are imported using `<script>` tags in Astro components
- Check browser console for any JavaScript errors

**Styling issues?**
- Verify CSS files are properly imported
- Check for CSS specificity conflicts

**Build errors?**
- Run `npm run astro check` for TypeScript errors
- Ensure all dependencies are installed

## 🚀 Deployment

The project can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `./dist/` folder
- **GitHub Pages**: Configure GitHub Actions workflow
- **AWS S3**: Upload `./dist/` contents to S3 bucket

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Modern CSS](https://web.dev/learn/css/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Astro and TypeScript**
