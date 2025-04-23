'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, MapPin, DollarSign, Maximize2, Home } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { useSearchParams, useNavigate } from 'react-router-dom'

import Page, { Header, HeaderTitle } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import supabase from 'src/lib/supabase'
import { LandSaleProperty } from 'src/types'
import { useTranslate } from '@tolgee/react'

export default function RealEstatePage() {
  const { t } = useTranslate()
  const isLargeScreen = useMediaQuery("(min-width: 768px)")
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const filters = {
    type: searchParams.get('type') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000000,
    minSize: Number(searchParams.get('minSize')) || 0,
    maxSize: Number(searchParams.get('maxSize')) || 10000,
  }

  const { data: properties, isLoading, error } = useQuery<LandSaleProperty[]>({
    queryKey: ['lands-sale', filters],
    queryFn: async () => {
      const query = supabase
        .from('lands_sale')
        .select('*')
        .eq('is_available', true)
        .gte('price', filters.minPrice)
        .lte('price', filters.maxPrice)
        .gte('size', filters.minSize)
        .lte('size', filters.maxSize)
      if (filters.type) {
        query.eq('type', filters.type)
      }


      const { data, error } = await query
      if (error) throw error
      return data
    },
  })

  const handleFilterChange = (key: string, value: any) => {
    setSearchParams(prev => {
      if (value === '' || value === undefined) {
        prev.delete(key)
      } else {
        prev.set(key, value.toString())
      }
      return prev
    })
  }

  useEffect(() => {
    // Update URL when filters change
    navigate(`?${searchParams.toString()}`, { replace: true })
  }, [searchParams, navigate])

  return (
    <Page>
      <ScrollArea className="h-screen">
        <div className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mt-4 w-full"
          >
            <Header>
              <HeaderTitle>
                {t('Land Sales')}
              </HeaderTitle>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />

            </Header>
          </motion.div>
          <div className="h-5" />
          <div className="flex flex-col h-full">
            {isLoading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-lg"
              >
                {t('Loading...')}
              </motion.p>
            ) : error ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-lg text-red-500"
              >
                {t('Error loading properties')}
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {properties?.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </ScrollArea>
    </Page>
  )
}

function FilterBar({ filters, onFilterChange }) {
  const { t } = useTranslate()

  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-4 w-full mb-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {t('Filters')}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              <h3 className="text-2xl font-semibold">{t('Filters')}</h3>
              <div className="space-y-4">
                <Label htmlFor="type">{t('Property Type')}</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => onFilterChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={t('Select type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>{t('All')}</SelectItem>
                    <SelectItem value="Residential">{t('Residential')}</SelectItem>
                    <SelectItem value="Commercial">{t('Commercial')}</SelectItem>
                    <SelectItem value="Agricultural">{t('Agricultural')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label>{t('Price Range')}</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => onFilterChange('minPrice', Number(e.target.value))}
                    placeholder={t('Min')}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
                    placeholder={t('Max')}
                    className="w-1/2"
                  />
                </div>
                <Slider
                  min={0}
                  max={1000000}
                  step={1000}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => {
                    onFilterChange('minPrice', min)
                    onFilterChange('maxPrice', max)
                  }}
                />
              </div>
              <div className="space-y-4">
                <Label>{t('Size Range (sqm)')}</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={filters.minSize}
                    onChange={(e) => onFilterChange('minSize', Number(e.target.value))}
                    placeholder={t('Min')}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    value={filters.maxSize}
                    onChange={(e) => onFilterChange('maxSize', Number(e.target.value))}
                    placeholder={t('Max')}
                    className="w-1/2"
                  />
                </div>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minSize, filters.maxSize]}
                  onValueChange={([min, max]) => {
                    onFilterChange('minSize', min)
                    onFilterChange('maxSize', max)
                  }}
                />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PropertyCard({ property }: { property: LandSaleProperty }) {
  const { t } = useTranslate()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      {!property?.image ? null : <div className="relative h-48">
        <img
          src={property.image || 'https://via.placeholder.com/400x200'}
          alt={property.title}
          className="w-full h-full object-cover"
        />

      </div>}
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-semibold line-clamp-1">{property.title}</h2>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <p className="text-sm line-clamp-1">{property.location}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-green-500" />
            <p className="font-semibold">${property.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center">
            <Maximize2 className="w-4 h-4 mr-1 text-blue-500" />
            <p>{property.size} m2</p>
          </div>
        </div>
        <div className="flex items-center">
          <Home className="w-4 h-4 mr-1 text-purple-500" />
          <p>{t(property.type)}</p>
        </div>
        <div>
          <strong className="text-sm">{t('Features')}:</strong>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {property.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="line-clamp-1">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

