import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, MapPin, Star, Clock, Shield } from 'lucide-react'
// 使用高德地图 Web API JavaScript SDK
import AMapLoader from '@amap/amap-jsapi-loader';
import { Map, Marker, InfoWindow, Polyline } from '@uiw/react-amap';

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
  stores: Store[]
  showFlowEffect: boolean
  onIngredientSelect: (ingredient: Ingredient) => void
  language: 'zh' | 'en'
}

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)'
}

const center: [number, number] = [0, 20]; // [经度, 纬度]

// 移除以下 Google Maps 特有的 mapOptions 对象
// const mapOptions = {
//   styles: [
//     {
//       featureType: 'all',
//       elementType: 'geometry',
//       stylers: [{ color: '#1a1a2e' }]
//     },
//     {
//       featureType: 'all',
//       elementType: 'labels.text.fill',
//       stylers: [{ color: '#ffffff' }]
//     },
//     {
//       featureType: 'all',
//       elementType: 'labels.text.stroke',
//       stylers: [{ color: '#000000' }, { lightness: 13 }]
//     },
//     {
//       featureType: 'administrative',
//       elementType: 'geometry.fill',
//       stylers: [{ color: '#000000' }]
//     },
//     {
//       featureType: 'administrative',
//       elementType: 'geometry.stroke',
//       stylers: [{ color: '#144b53' }, { lightness: 14 }, { weight: 1.4 }]
//     },
//     {
//       featureType: 'landscape',
//       elementType: 'all',
//       stylers: [{ color: '#08304b' }]
//     },
//     {
//       featureType: 'poi',
//       elementType: 'geometry',
//       stylers: [{ color: '#0c4152' }, { lightness: 5 }]
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry.fill',
//       stylers: [{ color: '#000000' }]
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry.stroke',
//       stylers: [{ color: '#0b434f' }, { lightness: 25 }]
//     },
//     {
//       featureType: 'road.arterial',
//       elementType: 'geometry.fill',
//       stylers: [{ color: '#000000' }]
//     },
//     {
//       featureType: 'road.arterial',
//       elementType: 'geometry.stroke',
//       stylers: [{ color: '#0b3d51' }, { lightness: 16 }]
//     },
//     {
//       featureType: 'road.local',
//       elementType: 'geometry',
//       stylers: [{ color: '#000000' }]
//     },
//     {
//       featureType: 'transit',
//       elementType: 'all',
//       stylers: [{ color: '#146474' }]
//     },
//     {
//       featureType: 'water',
//       elementType: 'all',
//       stylers: [{ color: '#021019' }]
//     }
//   ],
//   disableDefaultUI: true,
//   zoomControl: true,
//   mapTypeControl: false,
//   scaleControl: false,
//   streetViewControl: false,
//   rotateControl: false,
//   fullscreenControl: true
// }

const getSupplierIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    meat: '🥩',
    seafood: '🦞',
    vegetables: '🥬',
    wine: '🍷'
  }
  return iconMap[type] || '📦'
}

const getSupplierColor = (type: string) => {
  const colorMap: Record<string, string> = {
    meat: '#ef4444',
    seafood: '#06b6d4',
    vegetables: '#22c55e',
    wine: '#a855f7'
  }
  return colorMap[type] || '#f59e0b'
}

const GlobalSupplyChainMap: React.FC<Props> = ({ suppliers, ingredients, stores, showFlowEffect, onIngredientSelect, language }) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [animationActive, setAnimationActive] = useState(true)
  const [mapLoadError, setMapLoadError] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false); // 新增状态，用于控制地图是否加载完成

  // Set a timeout to fallback to alternative display if maps don't load
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Amap might not have loaded, using fallback display')
      setMapLoadError(true)
    }, 8000) // 8 second timeout

    // 使用 AMapLoader 加载高德地图 API
    AMapLoader.load({
      key: "d50ec7ef9221a5f02a7098af0e56ec38", // 您的高德地图 Key
      version: "2.0",
      plugins: ['AMap.ToolBar', 'AMap.Driving'], // 根据需要加载插件
    }).then((AMap) => {
      console.log('Amap loaded successfully');
      setMapLoaded(true); // 设置地图加载完成状态
      setMapLoadError(false);
      clearTimeout(timeout); // 清除超时
    }).catch((e) => {
      console.error('Amap loading error:', e);
      setMapLoadError(true);
      clearTimeout(timeout); // 清除超时
    });

    return () => clearTimeout(timeout)
  }, [])

  // 检测地图加载错误 (Amap does not have gm_authFailure, you might need to implement custom error handling)
  useEffect(() => {
    // 移除 Google Maps 相关的错误处理，因为我们已经切换到高德地图
    // const handleError = () => {
    //   console.warn('Amap loading error detected, switching to fallback')
    //   setMapLoadError(true)
    // }
    
    // return () => {
    // }
  }, [])

  const filteredSuppliers = activeFilters.length > 0
    ? suppliers.filter(supplier => activeFilters.includes(supplier.type))
    : suppliers

  const handleMarkerClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
  }

  const handleCloseClick = () => {
    setSelectedSupplier(null)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )
  }

  // 移除 handleMapLoad 和 handleMapError，因为加载逻辑已移至 useEffect
  // const handleMapLoad = () => {
  //   console.log('Amap loaded successfully')
  //   setMapLoadError(false)
  // }

  // const handleMapError = (error: any) => {
  //   console.error('Amap loading error:', error)
  //   setMapLoadError(true)
  // }

  return (
    <div className="relative w-full h-full">
      {mapLoaded && !mapLoadError ? (
        <Map
          style={mapContainerStyle}
          center={center}
          zoom={3}
        >
          {/* 供应商Marker */}
          {filteredSuppliers.map(supplier => (
            <Marker
              key={`supplier-${supplier.id}`}
              position={[supplier.location.lng, supplier.location.lat]}
              title={supplier.name}
              icon={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><text x='0' y='28' font-size='28'>${encodeURIComponent(getSupplierIcon(supplier.type))}</text></svg>`}
              onClick={() => { setSelectedSupplier(supplier); setSelectedStore(null); }}
            />
          ))}
          {/* 门店Marker */}
          {stores.map(store => (
            <Marker
              key={`store-${store.id}`}
              position={[store.location.lng, store.location.lat]}
              title={store.name}
              icon={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><text x='0' y='28' font-size='28'>🏠</text></svg>`}
              onClick={() => { setSelectedStore(store); setSelectedSupplier(null); }}
            />
          ))}
          {/* 流向特效 */}
          {showFlowEffect && filteredSuppliers.map(supplier =>
            stores.map(store => (
              <Polyline
                key={`flow-${supplier.id}-${store.id}`}
                path={[
                  [supplier.location.lng, supplier.location.lat],
                  [store.location.lng, store.location.lat]
                ]}
                strokeColor="#f59e0b"
                strokeWeight={2}
                strokeOpacity={0.7}
                showDir={true}
              />
            ))
          )}
          {/* 供应商弹窗 */}
          {selectedSupplier && (
            <InfoWindow
              position={[selectedSupplier.location.lng, selectedSupplier.location.lat]}
              visible={true}
              isCustom={true}
            >
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm relative">
                <button
                  onClick={handleCloseClick}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  {getSupplierIcon(selectedSupplier.type)} {selectedSupplier.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {selectedSupplier.location.address}, {selectedSupplier.location.country}
                </p>
                <p className="text-sm mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" /> {selectedSupplier.rating} ({language === 'zh' ? '评分' : 'Rating'})
                </p>
                <p className="text-sm mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {selectedSupplier.deliveryTime} ({language === 'zh' ? '送货时间' : 'Delivery Time'})
                </p>
                <p className="text-sm mb-4 flex items-center">
                  <Shield className="w-4 h-4 mr-1" /> {selectedSupplier.certifications.join(', ')}
                </p>
                <h4 className="font-semibold mb-2">{language === 'zh' ? '主要食材' : 'Key Ingredients'}:</h4>
                <ul className="list-disc list-inside text-sm mb-4">
                  {ingredients
                    .filter(ing => ing.supplierId === selectedSupplier.id)
                    .map(ing => (
                      <li key={ing.id} className="cursor-pointer hover:text-blue-400" onClick={() => onIngredientSelect(ing)}>
                        {ing.name}
                      </li>
                    ))}
                </ul>
                <button
                  onClick={() => {
                    // Implement navigation to supplier details page or similar
                    alert(`${language === 'zh' ? '查看更多关于' : 'View more about'} ${selectedSupplier.name}`)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                >
                  {language === 'zh' ? '查看详情' : 'View Details'}
                </button>
              </div>
            </InfoWindow>
          )}
          {/* 门店弹窗 */}
          {selectedStore && (
            <InfoWindow
              position={[selectedStore.location.lng, selectedStore.location.lat]}
              visible={true}
              isCustom={true}
            >
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm relative">
                <button
                  onClick={() => setSelectedStore(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-2 flex items-center">🏠 {selectedStore.name}</h3>
                <p className="text-sm text-gray-400 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {selectedStore.location.address}
                </p>
                <p className="text-sm text-gray-400 mb-2">{selectedStore.description}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      ) : null} {/* 当地图未加载或加载失败时，不渲染地图组件 */}

      {/* Filter and other UI elements remain the same */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Toggle Filters"
        >
          <Filter className="w-5 h-5" />
        </button>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h4 className="text-white font-semibold mb-2">{language === 'zh' ? '筛选供应商类型' : 'Filter Supplier Type'}:</h4>
              {['meat', 'seafood', 'vegetables', 'wine'].map(type => (
                <label key={type} className="flex items-center text-white text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(type)}
                    onChange={() => handleFilterChange(type)}
                    className="mr-2"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mapLoadError && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-20">
          <div className="text-white text-center p-4 rounded-lg bg-red-600">
            <p className="text-lg font-bold mb-2">{language === 'zh' ? '地图加载失败' : 'Map Loading Failed'}</p>
            <p>{language === 'zh' ? '请检查您的网络连接或稍后再试。' : 'Please check your network connection or try again later.'}</p>
            <p>{language === 'zh' ? '正在显示替代内容。' : 'Displaying alternative content.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GlobalSupplyChainMap