import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Users,
  Package,
  BookOpen,
  Home
} from 'lucide-react'

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

interface Props {
  suppliers: Supplier[]
  ingredients: Ingredient[]
  recipes: Recipe[]
  stores: Store[]
  showFlowEffect: boolean
  onDataUpdate: (type: 'suppliers' | 'ingredients' | 'recipes' | 'stores' | 'settings', data: any) => void
}

const AdminPanel: React.FC<Props> = ({ suppliers, ingredients, recipes, stores = [], showFlowEffect, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'ingredients' | 'recipes' | 'stores' | 'settings'>('suppliers')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSupplierName, setNewSupplierName] = useState('')
  const [newSupplierLat, setNewSupplierLat] = useState(0)
  const [newSupplierLng, setNewSupplierLng] = useState(0)
  const [newStoreName, setNewStoreName] = useState('')
  const [newStoreLat, setNewStoreLat] = useState(0)
  const [newStoreLng, setNewStoreLng] = useState(0)
  const [newStoreAddress, setNewStoreAddress] = useState('')
  const [newStoreDescription, setNewStoreDescription] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)

  const tabs = [
    { key: 'suppliers', label: '供应商管理', icon: Users, count: suppliers.length },
    { key: 'ingredients', label: '食材管理', icon: Package, count: ingredients.length },
    { key: 'recipes', label: '菜谱管理', icon: BookOpen, count: recipes.length },
    { key: 'stores', label: '门店管理', icon: Home, count: stores.length },
    { key: 'settings', label: '系统设置', icon: Settings, count: 0 }
  ]

  const handleEdit = (item: any) => {
    setEditingItem({
      ...item,
      location: item.location || { lat: 0, lng: 0, address: '', city: '', country: '' }
    });
  }

  const handleSave = () => {
    if (!editingItem) return
    let updatedData: any[]
    switch (activeTab) {
      case 'suppliers':
        updatedData = suppliers.map(s => s.id === editingItem.id ? editingItem : s)
        onDataUpdate('suppliers', updatedData)
        break
      case 'ingredients':
        updatedData = ingredients.map(i => i.id === editingItem.id ? editingItem : i)
        onDataUpdate('ingredients', updatedData)
        break
      case 'recipes':
        updatedData = recipes.map(r => r.id === editingItem.id ? editingItem : r)
        onDataUpdate('recipes', updatedData)
        break
      case 'stores':
        updatedData = stores.map(st => st.id === editingItem.id ? editingItem : st)
        onDataUpdate('stores', updatedData)
        break
    }
    setEditingItem(null)
  }

  const handleDelete = (id: string) => {
    let updatedData: any[]
    switch (activeTab) {
      case 'suppliers':
        updatedData = suppliers.filter(s => s.id !== id)
        onDataUpdate('suppliers', updatedData)
        break
      case 'ingredients':
        updatedData = ingredients.filter(i => i.id !== id)
        onDataUpdate('ingredients', updatedData)
        break
      case 'recipes':
        updatedData = recipes.filter(r => r.id !== id)
        onDataUpdate('recipes', updatedData)
        break
      case 'stores':
        updatedData = stores.filter(st => st.id !== id)
        onDataUpdate('stores', updatedData)
        break
    }
    setShowConfirmDelete(null)
  }

  const handleAdd = () => {
    const newId = `${activeTab.slice(0, -1)}-${Date.now()}`
    let newItem: any
    switch (activeTab) {
      case 'suppliers':
        newItem = {
          id: newId,
          name: newSupplierName,
          type: 'meat',
          category: '肉类',
          location: { lat: newSupplierLat, lng: newSupplierLng, address: '', country: '' },
          description: '',
          certifications: [],
          supplySince: new Date().getFullYear().toString(),
          contactInfo: { phone: '', email: '' },
          story: { title: '', content: '', video: null, images: [] },
          ingredients: [],
          deliveryTime: '48小时',
          rating: 5.0
        }
        onDataUpdate('suppliers', [...suppliers, newItem])
        setNewSupplierName('')
        setNewSupplierLat(0)
        setNewSupplierLng(0)
        break
      case 'ingredients':
        newItem = {
          id: newId,
          name: '新食材',
          category: '肉类',
          supplierId: suppliers[0]?.id || '',
          origin: '',
          description: '',
          nutritionInfo: {},
          seasonality: '全年',
          storageCondition: '',
          processingMethod: '',
          certifications: [],
          image: '/images/supply-chain.jpg',
          priceRange: '',
          freshnessIndicator: '',
          sustainabilityScore: 8.0
        }
        onDataUpdate('ingredients', [...ingredients, newItem])
        break
      case 'recipes':
        newItem = {
          id: newId,
          name: '新菜谱',
          description: '',
          mainIngredients: [],
          category: '主菜',
          difficulty: '中级',
          cookingTime: '30分钟',
          servings: 2,
          image: '/images/wedding-dinner.jpg',
          steps: [],
          socialMedia: { douyin: '', xiaohongshu: '' },
          nutrition: { calories: '', protein: '', fat: '' },
          winePariring: '',
          occasion: ''
        }
        onDataUpdate('recipes', [...recipes, newItem])
        break
      case 'stores':
        newItem = {
          id: newId,
          name: newStoreName,
          location: { lat: newStoreLat, lng: newStoreLng, address: newStoreAddress },
          description: newStoreDescription
        }
        onDataUpdate('stores', [...stores, newItem])
        setNewStoreName('')
        setNewStoreLat(0)
        setNewStoreLng(0)
        setNewStoreAddress('')
        setNewStoreDescription('')
        break
    }
    setShowAddModal(false)
  }

  const getFilteredData = () => {
    let data: any[]
    switch (activeTab) {
      case 'suppliers':
        data = suppliers
        break
      case 'ingredients':
        data = ingredients
        break
      case 'recipes':
        data = recipes
        break
      case 'stores':
        data = stores
        break
      default:
        return []
    }
    if (!searchQuery) return data
    return data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const exportData = () => {
    const data = { suppliers, ingredients, recipes, stores }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grammy-supply-chain-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 mb-2">管理后台</h1>
              <p className="text-gray-300">数据管理与系统配置</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                />
              </div>
              
              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>导出数据</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>添加新项</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full p-4 rounded-xl transition-all flex items-center space-x-3 ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-black'
                    : 'bg-black/40 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-medium">{tab.label}</div>
                  {tab.count > 0 && (
                    <div className="text-sm opacity-70">{tab.count} 项</div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            {activeTab === 'settings' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
              >
                <h2 className="text-2xl font-bold text-amber-400 mb-6">系统设置</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <label className="text-white text-lg font-medium">显示供应链流向</label>
                    <input
                      type="checkbox"
                      checked={showFlowEffect}
                      onChange={e => onDataUpdate('settings', { showFlowEffect: e.target.checked })}
                      className="w-6 h-6 accent-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white mb-4">显示设置</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-gray-300">启用动画效果</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-gray-300">自动轮播功能</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white mb-4">数据管理</h3>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          备份数据
                        </button>
                        <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                          恢复数据
                        </button>
                        <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                          重置数据
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-4">系统信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-amber-400">{suppliers.length}</div>
                        <div className="text-sm text-gray-400">供应商</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{ingredients.length}</div>
                        <div className="text-sm text-gray-400">食材</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{recipes.length}</div>
                        <div className="text-sm text-gray-400">菜谱</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">100%</div>
                        <div className="text-sm text-gray-400">系统健康</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden"
              >
                {/* Table Header */}
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-amber-400">
                    {tabs.find(t => t.key === activeTab)?.label}
                  </h2>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left p-4 text-gray-300 font-medium">名称</th>
                        <th className="text-left p-4 text-gray-300 font-medium">类别</th>
                        <th className="text-left p-4 text-gray-300 font-medium">描述</th>
                        <th className="text-right p-4 text-gray-300 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-sm text-gray-400">ID: {item.id}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                              {item.category || item.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-300 max-w-xs truncate">
                              {item.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(item.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingItem && (
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
                className="bg-slate-800 rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto text-white w-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-amber-400">编辑 {editingItem.name}</h2>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">名称</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'suppliers' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">评分</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editingItem.rating}
                          onChange={(e) => setEditingItem({...editingItem, rating: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">配送时间</label>
                        <input
                          type="text"
                          value={editingItem.deliveryTime}
                          onChange={(e) => setEditingItem({...editingItem, deliveryTime: e.target.value})}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'suppliers' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">纬度</label>
                        <input
                          type="number"
                          value={editingItem.location.lat}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            location: {
                              ...editingItem.location,
                              lat: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">经度</label>
                        <input
                          type="number"
                          value={editingItem.location.lng}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            location: {
                              ...editingItem.location,
                              lng: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'ingredients' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">产地</label>
                        <input
                          type="text"
                          value={editingItem.origin}
                          onChange={(e) => setEditingItem({...editingItem, origin: e.target.value})}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">可持续性评分</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={editingItem.sustainabilityScore}
                          onChange={(e) => setEditingItem({...editingItem, sustainabilityScore: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'recipes' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">烹饪时间</label>
                          <input
                            type="text"
                            value={editingItem.cookingTime}
                            onChange={(e) => setEditingItem({...editingItem, cookingTime: e.target.value})}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">服务人数</label>
                          <input
                            type="number"
                            value={editingItem.servings}
                            onChange={(e) => setEditingItem({...editingItem, servings: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* 菜谱步骤编辑区域 */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">菜谱步骤</label>
                        {editingItem.steps && editingItem.steps.length > 0 ? (
                          editingItem.steps.map((step: string, idx: number) => (
                            <div key={idx} className="flex items-center mb-2">
                              <input
                                type="text"
                                value={step}
                                onChange={e => {
                                  const newSteps = [...editingItem.steps]
                                  newSteps[idx] = e.target.value
                                  setEditingItem({ ...editingItem, steps: newSteps })
                                }}
                                className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none mr-2"
                                placeholder={`步骤 ${idx + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newSteps = editingItem.steps.filter((_: string, i: number) => i !== idx)
                                  setEditingItem({ ...editingItem, steps: newSteps })
                                }}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                              >删除</button>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 mb-2">暂无步骤，请添加。</div>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, steps: [...(editingItem.steps || []), ""] })}
                          className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg"
                        >添加步骤</button>
                      </div>
                      {/* 小红书和抖音链接输入区域 */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">小红书链接</label>
                          <input
                            type="text"
                            value={editingItem.socialMedia?.xiaohongshu || ''}
                            onChange={e => setEditingItem({
                              ...editingItem,
                              socialMedia: {
                                ...editingItem.socialMedia,
                                xiaohongshu: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                            placeholder="粘贴小红书链接"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">抖音链接</label>
                          <input
                            type="text"
                            value={editingItem.socialMedia?.douyin || ''}
                            onChange={e => setEditingItem({
                              ...editingItem,
                              socialMedia: {
                                ...editingItem.socialMedia,
                                douyin: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                            placeholder="粘贴抖音链接"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'stores' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">门店名称</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">纬度</label>
                          <input
                            type="number"
                            value={editingItem.location.lat}
                            onChange={e => setEditingItem({
                              ...editingItem,
                              location: { ...editingItem.location, lat: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">经度</label>
                          <input
                            type="number"
                            value={editingItem.location.lng}
                            onChange={e => setEditingItem({
                              ...editingItem,
                              location: { ...editingItem.location, lng: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">地址</label>
                        <input
                          type="text"
                          value={editingItem.location.address}
                          onChange={e => setEditingItem({
                            ...editingItem,
                            location: { ...editingItem.location, address: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
                        <textarea
                          value={editingItem.description}
                          onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
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
                className="bg-slate-800 rounded-2xl p-6 text-white w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                  添加新的{tabs.find(t => t.key === activeTab)?.label}
                </h3>
                <div className="space-y-4">
                  {activeTab === 'suppliers' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">名称</label>
                        <input
                          type="text"
                          value={newSupplierName}
                          onChange={(e) => setNewSupplierName(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="供应商名称"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">纬度</label>
                        <input
                          type="number"
                          value={newSupplierLat}
                          onChange={(e) => setNewSupplierLat(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="纬度"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">经度</label>
                        <input
                          type="number"
                          value={newSupplierLng}
                          onChange={(e) => setNewSupplierLng(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="经度"
                        />
                      </div>
                    </>
                  )}
                  {activeTab === 'stores' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">门店名称</label>
                        <input
                          type="text"
                          value={newStoreName}
                          onChange={e => setNewStoreName(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="门店名称"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">纬度</label>
                          <input
                            type="number"
                            value={newStoreLat}
                            onChange={e => setNewStoreLat(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                            placeholder="纬度"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">经度</label>
                          <input
                            type="number"
                            value={newStoreLng}
                            onChange={e => setNewStoreLng(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                            placeholder="经度"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">地址</label>
                        <input
                          type="text"
                          value={newStoreAddress}
                          onChange={e => setNewStoreAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="门店地址"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
                        <textarea
                          value={newStoreDescription}
                          onChange={e => setNewStoreDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          placeholder="门店描述"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors"
                  >
                    确定添加
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showConfirmDelete && (
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
                <h3 className="text-xl font-bold text-red-400 mb-4">确认删除</h3>
                <p className="text-gray-300 mb-6">
                  确定要删除此项目吗？此操作无法撤销。
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowConfirmDelete(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDelete(showConfirmDelete)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    确定删除
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

export default AdminPanel