import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  LayoutGrid,
  List,
  Building,
} from 'lucide-react';
import { propertyApi } from '../../api/properties';
import { masterApi } from '../../api/master';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || '');
  const [city, setCity] = useState<string>(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState<string>(searchParams.get('propertyType') || '');
  const [listingType, setListingType] = useState<string>(searchParams.get('listingType') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState<string>(searchParams.get('bedrooms') || '');
  const [furnishingStatus, setFurnishingStatus] = useState<string>(searchParams.get('furnishingStatus') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'createdAt');
  const [sortDirection, setSortDirection] = useState<string>(searchParams.get('sortDirection') || 'desc');
  const [page, setPage] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Synchronize URL params with state
  useEffect(() => {
    if (searchParams.get('city')) setCity(searchParams.get('city') || '');
    if (searchParams.get('propertyType')) setPropertyType(searchParams.get('propertyType') || '');
    if (searchParams.get('listingType')) setListingType(searchParams.get('listingType') || '');
    if (searchParams.get('keyword')) setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  // Master Data Queries
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => masterApi.getCities(),
  });

  const { data: propertyTypes = [] } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: () => masterApi.getPropertyTypes(),
  });

  const { data: amenities = [] } = useQuery({
    queryKey: ['amenities'],
    queryFn: () => masterApi.getAmenities(),
  });

  // Properties Query
  const { data: propertiesPage, isLoading, isFetching } = useQuery({
    queryKey: [
      'properties',
      keyword,
      city,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      furnishingStatus,
      selectedAmenities,
      sortBy,
      sortDirection,
      page,
    ],
    queryFn: () =>
      propertyApi.search({
        keyword: keyword || undefined,
        city: city || undefined,
        propertyType: propertyType || undefined,
        listingType: listingType || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        furnishingStatus: furnishingStatus || undefined,
        amenityIds: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        page,
        size: 12,
        sortBy,
        sortDirection,
      }),
  });

  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setPropertyType('');
    setListingType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setFurnishingStatus('');
    setSelectedAmenities([]);
    setSortBy('createdAt');
    setSortDirection('desc');
    setPage(0);
    setSearchParams({});
  };

  const toggleAmenity = (id: number) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const properties = propertiesPage?.content || [];
  const totalElements = propertiesPage?.totalElements || 0;
  const totalPages = propertiesPage?.totalPages || 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-navy-900 font-serif tracking-tight">
            Explore Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified luxury listings across prime residential and commercial corridors
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, location, landmark..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileFilterOpen(true)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [by, dir] = e.target.value.split('-');
                  setSortBy(by);
                  setSortDirection(dir);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="createdAt-desc">Newest Listings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="builtUpArea-desc">Area: Largest First</option>
              </select>
            </div>

            {/* Grid/List View */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Listing Type</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {['', 'SALE', 'RENT'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setListingType(type);
                      setPage(0);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      listingType === type ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === '' ? 'All' : type === 'SALE' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">City</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map((pt) => (
                  <option key={pt.id} value={pt.name}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Bedrooms</label>
              <div className="flex gap-2">
                {['', '1', '2', '3', '4'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBedrooms(b);
                      setPage(0);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      bedrooms === b
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b === '' ? 'Any' : b === '4' ? '4+' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Furnishing</label>
              <select
                value={furnishingStatus}
                onChange={(e) => {
                  setFurnishingStatus(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Any Furnishing</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Key Amenities</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {amenities.map((amenity) => (
                  <label key={amenity.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>{amenity.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Properties Grid Area */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-900">{properties.length}</strong> of{' '}
                <strong className="text-slate-900">{totalElements}</strong> properties
              </span>
              {isFetching && <span className="text-brand-600 animate-pulse">Updating...</span>}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                    <Skeleton className="aspect-[16/10] rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No properties match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your budget, location, or bedrooms filters to discover available residences.
                </p>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              /* Grid of properties */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      page === i
                        ? 'bg-navy-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
