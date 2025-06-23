import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'react-qr-code'
import { 
  ChefHat, 
  Clock, 
  Users, 
  Star, 
  Wine, 
  Heart, 
  Play, 
  Share2,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy
} from 'lucide-react'

interface Recipe {
  id: string
  name: string
  description: string
  mainIngredients: string[]
  category: string
  difficulty: string
  cookingTime: string
  servings: number
  image: string
  steps: string[]
  socialMedia: {
    douyin: string
    xiaohongshu: string
  }
  nutrition: {
    calories: string
    protein: string
    fat: string
  }
  winePariring: string
  occasion: string
}

interface Ingredient {
  id: string
  name: string
  category: string
  supplierId: string
  origin: string
  description: string
  nutritionInfo: Record<string, string>
  seasonality: string
  storageCondition: string
  processingMethod: string
  certifications: string[]
  image: string
  priceRange: string
  freshnessIndicator: string
  sustainabilityScore: number
}

interface Props {
  recipes: Recipe[]
  ingredients: Ingredient[]
  selectedIngredient: Ingredient | null
  language: 'zh' | 'en'
}

const RecipeShowcase: React.FC<Props> = ({ recipes, ingredients, selectedIngredient, language }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [showQRCode, setShowQRCode] = useState<'douyin' | 'xiaohongshu' | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  // Filter recipes based on selected ingredient
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // Filter by selected ingredient
    if (selectedIngredient) {
      filtered = filtered.filter(recipe => 
        recipe.mainIngredients.some(ingredientId => {
          const ingredient = ingredients.find(i => i.id === ingredientId)
          return ingredient?.name === selectedIngredient.name
        })
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === categoryFilter)
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === difficultyFilter)
    }

    return filtered
  }, [recipes, ingredients, selectedIngredient, searchQuery, categoryFilter, difficultyFilter])

  // Auto-slide for recipe carousel
  useEffect(() => {
    if (!autoPlay || filteredRecipes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredRecipes.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [autoPlay, filteredRecipes.length])

  // Auto-advance cooking steps
  useEffect(() => {
    if (!selectedRecipe || !autoPlay) return

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % selectedRecipe.steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [selectedRecipe, autoPlay])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredRecipes.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? filteredRecipes.length - 1 : prev - 1
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'text-green-400'
      case '中级': return 'text-yellow-400'
      case '高级': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return '⭐'
      case '中级': return '⭐⭐'
      case '高级': return '⭐⭐⭐'
      default: return '⭐'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const categories = [...new Set(recipes.map(r => r.category))]
  const difficulties = [...new Set(recipes.map(r => r.difficulty))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 mb-2">
                菜谱与应用场景
              </h1>
              {selectedIngredient && (
                <p className="text-gray-300">
                  基于 "{selectedIngredient.name}" 的推荐菜谱
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索菜谱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="all">所有类别</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="all">所有难度</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              {/* Auto-play Toggle */}
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  autoPlay 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-black/40 border border-white/20 text-white'
                }`}
              >
                {autoPlay ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </motion.div>

        {filteredRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white py-20"
          >
            <ChefHat className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-light mb-4">暂无匹配的菜谱</h2>
            <p className="text-gray-400">请尝试调整筛选条件</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Recipe Display */}
            <div className="xl:col-span-2">
              {/* Recipe Carousel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-black/40 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 mb-6"
              >
                <div className="aspect-video relative">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      src={filteredRecipes[currentSlide]?.image}
                      alt={filteredRecipes[currentSlide]?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/wedding-dinner.jpg'
                      }}
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {filteredRecipes.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Recipe Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <motion.h2 
                      key={`title-${currentSlide}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-bold text-white mb-2"
                    >
                      {filteredRecipes[currentSlide]?.name}
                    </motion.h2>
                    <motion.p 
                      key={`desc-${currentSlide}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-gray-300 mb-4"
                    >
                      {filteredRecipes[currentSlide]?.description}
                    </motion.p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-white">{filteredRecipes[currentSlide]?.cookingTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{filteredRecipes[currentSlide]?.servings}人份</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ChefHat className="w-4 h-4 text-green-400" />
                        <span className={getDifficultyColor(filteredRecipes[currentSlide]?.difficulty || '')}>
                          {getDifficultyIcon(filteredRecipes[currentSlide]?.difficulty || '')} {filteredRecipes[currentSlide]?.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide Indicators */}
                {filteredRecipes.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {filteredRecipes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlide === index 
                            ? 'bg-amber-400 w-8'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Detailed Recipe Info */}
              {filteredRecipes[currentSlide] && (
                <motion.div
                  key={`details-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nutrition Info */}
                    <div>
                      <h3 className="text-xl font-bold text-amber-400 mb-4">营养信息</h3>
                      <div className="space-y-3">
                        {Object.entries(filteredRecipes[currentSlide].nutrition).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400">{key}:</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Wine Pairing & Occasion */}
                    <div>
                      <h3 className="text-xl font-bold text-amber-400 mb-4">搭配建议</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Wine className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-400">酒款搭配:</span>
                          <span className="text-white">{filteredRecipes[currentSlide].winePariring}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-400">适用场合:</span>
                          <span className="text-white">{filteredRecipes[currentSlide].occasion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 mt-6">
                    <button
                      onClick={() => setSelectedRecipe(filteredRecipes[currentSlide])}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
                    >
                      查看制作步骤
                    </button>
                    <button
                      onClick={() => setShowQRCode('douyin')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      抖音分享
                    </button>
                    <button
                      onClick={() => setShowQRCode('xiaohongshu')}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      小红书分享
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Recipe Grid */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                  推荐菜谱 ({filteredRecipes.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setCurrentSlide(index)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                        currentSlide === index 
                          ? 'bg-amber-500/20 border border-amber-400/50'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/wedding-dinner.jpg'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{recipe.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{recipe.category}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {recipe.cookingTime}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Ingredients Used */}
              {selectedIngredient && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10"
                >
                  <h3 className="text-xl font-bold text-amber-400 mb-4">主要食材</h3>
                  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <img
                      src={selectedIngredient.image}
                      alt={selectedIngredient.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-white">{selectedIngredient.name}</h4>
                      <p className="text-xs text-gray-400">{selectedIngredient.origin}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Recipe Detail Modal */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto text-white"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-amber-400">{selectedRecipe.name} - 制作步骤</h2>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Step Display */}
                  <div>
                    <div className="bg-black/40 rounded-xl p-4 mb-4">
                      <h3 className="text-lg font-medium text-amber-400 mb-2">
                        步骤 {currentStep + 1} / {selectedRecipe.steps.length}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedRecipe.steps[currentStep]}
                      </p>
                    </div>
                    
                    {/* Step Navigation */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        上一步
                      </button>
                      <div className="flex space-x-1">
                        {selectedRecipe.steps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              currentStep === index 
                                ? 'bg-amber-400' 
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentStep(Math.min(selectedRecipe.steps.length - 1, currentStep + 1))}
                        disabled={currentStep === selectedRecipe.steps.length - 1}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg transition-colors"
                      >
                        下一步
                      </button>
                    </div>
                  </div>

                  {/* All Steps List */}
                  <div>
                    <h3 className="text-lg font-medium text-amber-400 mb-4">完整步骤</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedRecipe.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setCurrentStep(index)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            currentStep === index 
                              ? 'bg-amber-500/20 border border-amber-400/50'
                              : 'bg-black/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                              {index + 1}
                            </span>
                            <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 text-white text-center"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                  {showQRCode === 'douyin' ? '抖音' : '小红书'} 分享
                </h3>
                <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                  <QRCode
                    value={filteredRecipes[currentSlide]?.socialMedia[showQRCode] || ''}
                    size={200}
                  />
                </div>
                <p className="text-gray-300 mb-4">扫码查看菜谱视频教程</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => copyToClipboard(filteredRecipes[currentSlide]?.socialMedia[showQRCode] || '')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>复制链接</span>
                  </button>
                  <button
                    onClick={() => setShowQRCode(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RecipeShowcase