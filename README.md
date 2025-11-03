# Helios Engine Website

[![Crates.io](https://img.shields.io/crates/v/helios-engine.svg)](https://crates.io/crates/helios-engine)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The official website for **Helios Engine**, a powerful and flexible Rust framework for building LLM-powered agents with tool support, streaming chat capabilities, and easy configuration management.

## 🔥 About Helios Engine

Helios Engine is a comprehensive Rust framework that enables developers to:

- **Build Intelligent Agents**: Create conversational AI agents with memory and context awareness
- **Multi-Agent Collaboration**: Implement "Forest of Agents" for complex task delegation and communication
- **RAG Systems**: Integrate Retrieval-Augmented Generation with vector stores (InMemory and Qdrant)
- **Real-time Streaming**: Experience true real-time response streaming for both remote and local models
- **16+ Built-in Tools**: Access extensive tool suite including web scraping, file I/O, HTTP requests, and more
- **Local Model Support**: Run models offline using llama.cpp with HuggingFace integration
- **OpenAI-Compatible API**: Expose OpenAI-compatible API endpoints with full parameter support

## 🚀 Quick Start

```bash
# Install Helios Engine
cargo install helios-engine

# Initialize configuration
helios-engine init

# Start chatting with your agent
helios-engine chat
```

## 🛠️ Development

This website is built with modern web technologies:

- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ammar-Alnagar/Helios-Engine-Website.git
   cd Helios-Engine-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── DocsSection.tsx  # Documentation links section
│   └── ExamplesSection.tsx # Code examples (removed from website)
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Performance**: Fast loading with optimized assets
- **Accessibility**: Semantic HTML and ARIA attributes
- **SEO Friendly**: Proper meta tags and structured content

## 📚 Documentation

For detailed documentation about Helios Engine itself, visit:

- [Official Documentation](https://docs.rs/helios-engine/0.3.7/helios_engine/)
- [GitHub Repository](https://github.com/Ammar-Alnagar/Helios-Engine)
- [Crates.io](https://crates.io/crates/helios-engine)

## 🤝 Contributing

Contributions to the website are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Rust
- Icons by [Lucide](https://lucide.dev/)
- Fonts and styling inspired by modern design trends
