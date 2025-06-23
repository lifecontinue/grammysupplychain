import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlobalSupplyChainMap from './components/GlobalSupplyChainMap'
import IngredientStoryDisplay from './components/IngredientStoryDisplay'
import RecipeShowcase from './components/RecipeShowcase'
import AdminPanel from './components/AdminPanel'
import './App.css'

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

interface Store {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
    city?: string
    country?: string
  }
  description: string
}

function App() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [currentView, setCurrentView] = useState<'map' | 'story' | 'recipe' | 'admin'>('map')
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [isLoading, setIsLoading] = useState(true)
  const [showFlowEffect, setShowFlowEffect] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersRes, ingredientsRes, recipesRes, storesRes] = await Promise.all([
          fetch('/data/suppliers.json'),
          fetch('/data/ingredients.json'),
          fetch('/data/recipes.json'),
          fetch('/data/stores.json')
        ])
        
        const suppliersData = await suppliersRes.json()
        const ingredientsData = await ingredientsRes.json()
        const recipesData = await recipesRes.json()
        const storesData = await storesRes.json()
        
        setSuppliers(suppliersData)
        setIngredients(ingredientsData)
        setRecipes(recipesData)
        setStores(storesData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 监听来自地图组件的食材选择事件
  useEffect(() => {
    const handleIngredientStorySwitch = (event: CustomEvent) => {
      const { ingredient, supplier } = event.detail
      console.log('Switching to ingredient story:', ingredient.name, supplier.name)
      setSelectedIngredient(ingredient)
      setCurrentView('story')
    }

    window.addEventListener('switchToIngredientStory', handleIngredientStorySwitch as EventListener)
    
    return () => {
      window.removeEventListener('switchToIngredientStory', handleIngredientStorySwitch as EventListener)
    }
  }, [])

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setCurrentView('story')
  }

  const handleViewChange = (view: 'map' | 'story' | 'recipe' | 'admin') => {
    setCurrentView(view)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-xl font-light">加载中...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
            >
              格莱美供应链大屏
            </motion.h1>
            <div className="text-amber-400 text-sm font-light">
              全球优质食材 · 品质保证
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex space-x-2">
              {[
                { key: 'map', label: '供应链地图' },
                { key: 'story', label: '食材故事' },
                { key: 'recipe', label: '菜谱展示' },
                { key: 'admin', label: '管理后台' }
              ].map(({ key, label }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange(key as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === key
                      ? 'bg-amber-500 text-black font-medium'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </nav>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
            >
              {language === 'zh' ? 'EN' : '中'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative">
        {currentView === 'map' && (
          <GlobalSupplyChainMap
            suppliers={suppliers}
            ingredients={ingredients}
            stores={stores}
            showFlowEffect={showFlowEffect}
            onIngredientSelect={handleIngredientSelect}
            language={language}
          />
        )}
        
        {currentView === 'story' && (
          <IngredientStoryDisplay
            ingredient={selectedIngredient}
            supplier={selectedIngredient ? suppliers.find(s => s.id === selectedIngredient.supplierId) : null}
            language={language}
          />
        )}
        
        {currentView === 'recipe' && (
          <RecipeShowcase
            recipes={recipes}
            ingredients={ingredients}
            selectedIngredient={selectedIngredient}
            language={language}
          />
        )}
        
        {currentView === 'admin' && (
          <AdminPanel
            suppliers={suppliers}
            ingredients={ingredients}
            recipes={recipes}
            stores={stores}
            showFlowEffect={showFlowEffect}
            onDataUpdate={(type, data) => {
              if (type === 'suppliers') setSuppliers(data)
              else if (type === 'ingredients') setIngredients(data)
              else if (type === 'recipes') setRecipes(data)
              else if (type === 'stores') setStores(data)
              else if (type === 'settings') setShowFlowEffect(data.showFlowEffect)
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
