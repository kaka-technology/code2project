<div align="center">

# ⚡ Code2Project - Cyber Edition

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/banner.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/banner.svg">
  <img src="./assets/banner.svg" alt="Code2Project Banner" width="100%" />
</picture>

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

### 🚀 Transform Single Files into Complete React Projects - Instantly!

**[English](./README.md)** • **[فارسی](./README.fa.md)**

[🌐 Live Demo](https://c2p.us.ci) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**Code2Project** is a powerful, futuristic web application that converts single JavaScript, TypeScript, JSX, or TSX files into fully functional, production-ready React projects with Vite configuration. Perfect for rapid prototyping, learning, and project initialization.

### ✨ Why Code2Project?

- 🎯 **Zero Configuration**: No setup required - just paste your code
- ⚡ **Lightning Fast**: Powered by Vite for instant HMR
- 🎨 **Beautiful UI**: Stunning glassmorphism design with dark/light themes
- 🌐 **Bilingual**: Full support for English and Persian (RTL)
- 📦 **Smart Detection**: Automatically detects dependencies and imports
- 🔒 **100% Offline**: Works completely offline, no server needed
- 💎 **Production Ready**: Generates optimized, standards-compliant projects

---

## 🎥 Demo

<div align="center">

🌐 **[Try Live Demo](https://c2p.us.ci)**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshot-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshot-light.svg">
  <img src="./assets/screenshot-light.svg" alt="App Demo" width="800" />
</picture>


### 🖼️ Screenshots

| Light Mode | Dark Mode |
|:----------:|:---------:|
| <img src="./assets/screenshot-light.svg" alt="Light Mode" width="400"/> | <img src="./assets/screenshot-dark.svg" alt="Dark Mode" width="400"/> |

</div>

---

## ✨ Features

### 🎨 **Modern & Beautiful Interface**
- Glassmorphism design with smooth animations
- Dark/Light theme with seamless transitions
- Responsive layout for all devices
- Neon glow effects and cyber aesthetics

### 🔧 **Smart Code Analysis**
- Auto-detects NPM dependencies from imports
- Identifies local file imports
- Supports JS, JSX, TS, and TSX files
- Intelligent code parsing

### 📦 **Complete Project Generation**
- Full Vite + React setup
- Pre-configured TypeScript
- ESLint + Prettier ready
- Development and production scripts
- Optimized build configuration

### 🌍 **Internationalization**
- Full English and Persian support
- RTL/LTR automatic switching
- Localized UI elements
- Bilingual documentation

### ⚡ **Performance Optimized**
- Instant file processing
- Efficient ZIP generation
- Minimal bundle size
- Fast development server

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Version | Purpose |
|:----------:|:-------:|:-------:|
| **React** | 19.2.1 | UI Framework |
| **TypeScript** | 5.8.2 | Type Safety |
| **Vite** | 7.2.6 | Build Tool |
| **Lucide React** | 0.556.0 | Icons |
| **JSZip** | 3.10.1 | ZIP Generation |
| **Tailwind CSS** | 3.x | Styling |

</div>

---

## 📥 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kaka-technology/code2project.git

# Navigate to project directory
cd code2project

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

---

## 📖 Usage

### Method 1: Upload File

1. Click the **"Upload"** tab
2. Drag & drop your `.js`, `.jsx`, `.ts`, or `.tsx` file
3. Or click to browse and select a file
4. Click **"Generate"** button
5. Download your ready-to-run project ZIP

### Method 2: Paste Code

1. Click the **"Paste"** tab
2. Paste your React component code
3. The system auto-detects filename (defaults to `App.tsx`)
4. Click **"Generate"** button
5. Download your project ZIP

### Post-Generation Steps

```bash
# Extract the ZIP file
unzip your-project-name.zip

# Navigate to project
cd your-project-name

# Install dependencies
npm install

# Start development
npm run dev
```

---

## 📂 Project Structure


```
code2project/
├── 📁 src/
│   ├── 📄 App.tsx                 # Main application component
│   ├── 📄 index.tsx               # Application entry point
│   ├── 📄 index.css               # Global styles
│   ├── 📄 types.ts                # TypeScript definitions
│   ├── 📄 constants.ts            # Translation constants
│   ├── 📁 components/
│   │   └── 📄 CyberCard.tsx       # Reusable card component
│   ├── 📁 services/
│   │   ├── 📄 analyzer.ts         # Dependency analysis
│   │   └── 📄 zipGenerator.ts    # ZIP file generation
│   └── 📁 utils/
│       ├── 📄 helpers.js          # Utility functions
│       └── 📄 data_processor.py   # Data processing utilities
├── 📁 assets/                     # Images and media
├── 📁 .github/                    # GitHub templates
├── 📄 index.html                  # HTML template
├── 📄 package.json                # Dependencies
├── 📄 tsconfig.json               # TypeScript config
├── 📄 vite.config.ts              # Vite configuration
├── 📄 .gitignore                  # Git ignore rules
├── 📄 LICENSE                     # MIT License
└── 📄 README.md                   # This file
```

---

## 🎯 Generated Project Structure

When you generate a project, it includes:

```
your-project/
├── src/
│   └── YourComponent.tsx          # Your uploaded file
├── public/
├── package.json                   # With all dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite setup
├── index.html                     # Entry HTML
└── README.md                      # Usage instructions
```

---

## ⚙️ Configuration

### Customizing Your Generated Projects

Edit `src/services/zipGenerator.ts` to customize:

- Package.json template
- Vite configuration
- TypeScript settings
- Additional files

### Theme Customization

Modify `src/index.css` to change:
- Color schemes
- Glassmorphism effects
- Neon glow intensities
- Animation timings

---

## 🔧 Development

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `.env.local` for custom configuration:

```env
VITE_APP_NAME=Code2Project
VITE_DEFAULT_THEME=dark
VITE_ENABLE_ANALYTICS=false
```

---

## 🤝 Contributing

We love contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Fork and clone
git clone https://github.com/kaka-technology/code2project.git

# Create branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev

# Commit and push
git add .
git commit -m "feat: add amazing feature"
git push origin feature/my-feature
```

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---

## 💡 Feature Requests

Have an idea? We'd love to hear it!
- Open an issue with the `enhancement` label
- Describe your feature in detail
- Explain the use case
- Provide examples if possible

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Code2Project Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🌟 Acknowledgments


- **Vite** - Amazing build tool
- **React Team** - Incredible framework
- **Lucide** - Beautiful icons
- **Tailwind CSS** - Utility-first CSS
- **Community** - For feedback and support

### Special Thanks

- All contributors who help improve this project
- Users who report bugs and suggest features
- Open source community for inspiration

---

## 📞 Support

Need help? Here's how to get support:

- 📧 Email: kaka-technology@outlook.com
- 💬 Discussions: [GitHub Discussions](https://github.com/kaka-technology/code2project/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/kaka-technology/code2project/issues)
- 📖 Documentation: [Wiki](https://github.com/kaka-technology/code2project/wiki)

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2025)
- [ ] Vue.js support
- [ ] Svelte support
- [ ] Custom templates
- [ ] Plugin system

### Version 1.2 (Q2 2025)
- [ ] Cloud sync
- [ ] Project templates library
- [ ] Advanced code analysis
- [ ] Multi-file projects

### Version 2.0 (Q3 2025)
- [ ] AI-powered code generation
- [ ] Collaborative editing
- [ ] Version control integration
- [ ] Desktop application

---

## 📊 Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/kaka-technology/code2project?style=social)
![GitHub forks](https://img.shields.io/github/forks/kaka-technology/code2project?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/kaka-technology/code2project?style=social)

![GitHub issues](https://img.shields.io/github/issues/kaka-technology/code2project)
![GitHub closed issues](https://img.shields.io/github/issues-closed/kaka-technology/code2project)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kaka-technology/code2project)

</div>

---

## 🌐 Links

- **Live Demo**: [c2p.us.ci](https://c2p.us.ci)
- **GitHub**: [github.com/kaka-technology/code2project](https://github.com/kaka-technology/code2project)
- **Email**: [kaka-technology@outlook.com](mailto:kaka-technology@outlook.com)

---

<div align="center">

### Made with ❤️ by Kaka Technology

**⭐ Star us on GitHub — it motivates us a lot!**

[⬆ back to top](#-code2project---cyber-edition)

</div>
