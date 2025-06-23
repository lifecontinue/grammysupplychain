import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, MapPin, Award, Leaf, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  type: string
  category: string
  location: {
    lat: number
    lng: number
    address: string
    country: string
  }
  description: string
  certifications: string[]
  supplySince: string
  contactInfo: {
    phone: string
    email: string
  }
  story: {
    title: string
    content: string
    video: string | null
    images: string[]
  }
  ingredients: string[]
  deliveryTime: string
  rating: number
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
  ingredient: Ingredient | null
  supplier: Supplier | null
  language: 'zh' | 'en'
}

const IngredientStoryDisplay: React.FC<Props> = ({ ingredient, supplier, language }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    if (!autoPlay || !supplier?.story.images) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        (prev + 1) % supplier.story.images.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, supplier?.story.images])

  const nextImage = () => {
    if (supplier?.story.images) {
      setCurrentImageIndex(prev => (prev + 1) % supplier.story.images.length)
    }
  }

  const prevImage = () => {
    if (supplier?.story.images) {
      setCurrentImageIndex(prev => 
        prev === 0 ? supplier.story.images.length - 1 : prev - 1
      )
    }
  }

  if (!ingredient || !supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white max-w-2xl"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <Leaf className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-light mb-4">探索食材背后的故事</h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            请从全球供应链地图中选择任意供应商标记，点击详情窗口中的食材按钮，即可查看食材的详细故事、营养信息和供应商背景
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <MapPin className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-medium text-amber-400 mb-2">选择供应商</h3>
              <p className="text-sm text-gray-400">在地图上点击供应商标记</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-medium text-amber-400 mb-2">查看详情</h3>
              <p className="text-sm text-gray-400">在详情窗口中选择食材</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <Leaf className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-medium text-amber-400 mb-2">探索故事</h3>
              <p className="text-sm text-gray-400">了解食材的精彩故事</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full"
        >
          {/* Left Panel - Visual Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Image/Video Display */}
            <div className="relative bg-black/40 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
              <div className="aspect-video relative">
                {supplier.story.video && videoPlaying ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <Play className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                      <p>视频播放功能</p>
                      <p className="text-sm text-gray-400 mt-2">模拟监控画面接入</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <img
                      src={supplier.story.images[currentImageIndex]}
                      alt={supplier.story.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/supply-chain.jpg'
                      }}
                    />
                  </motion.div>
                )}

                {/* Image Navigation */}
                {supplier.story.images.length > 1 && !videoPlaying && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Video/Auto-play Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {supplier.story.video && (
                    <button
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    >
                      {videoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  )}
                  {!videoPlaying && (
                    <button
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`p-3 rounded-full transition-all ${
                        autoPlay 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black'
                          : 'bg-black/50 hover:bg-black/70 text-white'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Image Indicators */}
                {supplier.story.images.length > 1 && !videoPlaying && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {supplier.story.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === index 
                            ? 'bg-amber-400 w-6'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredient Image */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10"
            >
              <div className="aspect-square sm:aspect-video">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/supply-chain.jpg'
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">{ingredient.name}</h3>
                <p className="text-gray-300 text-sm">{ingredient.description}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Story Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Supplier Story */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-amber-400 mb-4"
              >
                {supplier.story.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 leading-relaxed text-lg"
              >
                {supplier.story.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </motion.div>
            </div>

            {/* Supplier Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h3 className="font-medium text-white">供应商信息</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-amber-400">名称:</span> {supplier.name}</p>
                  <p><span className="text-amber-400">地址:</span> {supplier.location.address}</p>
                  <p><span className="text-amber-400">合作时间:</span> {supplier.supplySince}</p>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{supplier.rating}/5.0</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <h3 className="font-medium text-white">配送信息</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-green-400">配送时间:</span> {supplier.deliveryTime}</p>
                  <p><span className="text-green-400">新鲜度:</span> {ingredient.freshnessIndicator}</p>
                  <p><span className="text-green-400">储存条件:</span> {ingredient.storageCondition}</p>
                  <p><span className="text-green-400">加工方式:</span> {ingredient.processingMethod}</p>
                </div>
              </motion.div>
            </div>

            {/* Certifications */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">认证资质</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...supplier.certifications, ...ingredient.certifications])].map((cert, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Nutrition Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Leaf className="w-5 h-5 text-green-400" />
                <h3 className="font-medium text-white">营养信息</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(ingredient.nutritionInfo).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex justify-between"
                  >
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-white font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sustainability Score */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-4 backdrop-blur-sm border border-green-400/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <h3 className="font-medium text-white">可持续性评分</h3>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {ingredient.sustainabilityScore}/10
                </div>
              </div>
              <div className="mt-2 bg-black/40 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ingredient.sustainabilityScore * 10}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default IngredientStoryDisplay