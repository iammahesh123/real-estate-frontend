import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favouriteApi } from '../../api/dashboard';
import { PropertySummary } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Skeleton } from '../../components/common/Skeleton';

export const CustomerFavouritesPage: React.FC = () => {
  const [favourites, setFavourites] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const data = await favouriteApi.getFavourites();
      setFavourites(data || []);
    } catch (err) {
      console.error('Failed to load favourites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              Curated Shortlist
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              My Saved Properties ({favourites.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Properties you have bookmarked for quick reference, price comparisons, and private viewings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/compare"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
            >
              Side-by-Side Compare
            </Link>
            <Link
              to="/properties"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
            >
              Find More Properties
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : favourites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your shortlist is currently empty</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our portfolio of verified penthouses, luxury residences, and estates, and click the heart icon on any listing to bookmark it.
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-block bg-slate-950 hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Browse Luxury Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favourites.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onFavouriteToggle={() => fetchFavourites()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
