import { motion } from 'framer-motion'
import { FileText, BookOpen, Code, Settings, Users, Database, Zap, ChevronRight } from 'lucide-react'

const DocsSection = () => {
  const docs = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Getting Started",
      description: "Quick start guides and tutorials",
      items: [
        { name: "QUICKSTART.md", description: "5-minute setup guide" },
        { name: "INSTALLATION.md", description: "Complete installation instructions" },
        { name: "TUTORIAL.md", description: "Step-by-step agent building" }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "API Reference",
      description: "Complete technical documentation",
      items: [
        { name: "API.md", description: "Function signatures and usage" },
        { name: "USAGE.md", description: "CLI patterns and examples" },
        { name: "CONFIGURATION.md", description: "All provider configurations" }
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Advanced Features",
      description: "Deep technical capabilities",
      items: [
        { name: "ADVANCED.md", description: "Forest of Agents & performance" },
        { name: "RAG.md", description: "Retrieval-Augmented Generation" },
        { name: "STREAMING.md", description: "Real-time response streaming" }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Tools & Integration",
      description: "Built-in tools and custom development",
      items: [
        { name: "TOOLS.md", description: "16+ built-in tools guide" },
        { name: "USING_AS_CRATE.md", description: "Rust library integration" },
        { name: "IMPLEMENTATION_SUMMARY.md", description: "Technical implementation" }
      ],
      color: "from-orange-500 to-red-500"
    }
  ]

  const features = [
    { icon: <Users />, label: "Multi-Agent Systems" },
    { icon: <Database />, label: "Vector Stores" },
    { icon: <Zap />, label: "Real-time Streaming" },
    { icon: <Code />, label: "16+ Built-in Tools" },
    { icon: <Settings />, label: "Local Model Support" },
    { icon: <FileText />, label: "OpenAI-Compatible API" }
  ]

  return (
    <section id="docs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Documentation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From quick start guides to advanced technical references, our documentation covers everything
            you need to build powerful AI agents with Helios Engine.
          </p>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white">
                {feature.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{feature.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Documentation Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {docs.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-white flex-shrink-0`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group/item hover:bg-orange-50 transition-colors cursor-pointer">
                    <div>
                      <code className="text-sm font-mono text-orange-600 font-medium">{item.name}</code>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-orange-600 group-hover/item:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Documentation Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-700 font-medium">Documentation Files</div>
              <div className="text-sm text-gray-600 mt-1">Comprehensive coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Always Available</div>
              <div className="text-sm text-gray-600 mt-1">Online documentation</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-700 font-medium">Experience Levels</div>
              <div className="text-sm text-gray-600 mt-1">Beginner to Advanced</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to dive deeper?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our complete documentation library with examples, API references, and advanced guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Browse Documentation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              <Code className="w-5 h-5 inline mr-2" />
              View Examples
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DocsSection
