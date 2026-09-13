import React, { useState, useEffect } from 'react';
import { masterDataApi, City, PropertyType, Amenity } from '../../api/master';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminMasterDataPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'types' | 'amenities' | 'cities'>('types');
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setLoading(true);
        const [types, amens, c] = await Promise.all([
          masterDataApi.getPropertyTypes(),
          masterDataApi.getAmenities(),
          masterDataApi.getCities(),
        ]);
        setPropertyTypes(types);
        setAmenities(amens);
        setCities(c);
      } catch (err) {
        console.error('Failed to load master data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaster();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
            System Taxonomy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Master Data &amp; Classification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global taxonomies defining marketplace property categories, lifestyle amenities, and geographic hubs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8 pb-1">
          <button
            onClick={() => setActiveTab('types')}
            className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition ${
              activeTab === 'types'
                ? 'bg-white border-t border-x border-slate-200 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Property Types ({propertyTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition ${
              activeTab === 'amenities'
                ? 'bg-white border-t border-x border-slate-200 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Amenities ({amenities.length})
          </button>
          <button
            onClick={() => setActiveTab('cities')}
            className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition ${
              activeTab === 'cities'
                ? 'bg-white border-t border-x border-slate-200 text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tier-1 Cities ({cities.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : activeTab === 'types' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {propertyTypes.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: #{t.id}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2">{t.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{t.description || 'Verified classification.'}</p>
              </div>
            ))}
          </div>
        ) : activeTab === 'amenities' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{a.name}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{a.category}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-100 overflow-hidden">
                  <img
                    src={c.imageUrl || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.stateName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
