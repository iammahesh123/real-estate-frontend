import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Scale, ArrowRight, Check, X } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy-900 font-serif">Comparison Matrix is Empty</h2>
        <p className="text-sm text-slate-500">
          You haven't added any properties to compare yet. Browse properties and click the compare icon to inspect side-by-side.
        </p>
        <Link to="/properties">
          <Button variant="primary">Explore Properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-navy-900 font-serif tracking-tight">
              Compare Properties
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side matrix comparing price, dimensions, specifications, and amenities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={clearCompare} icon={<Trash2 className="w-4 h-4" />}>
              Clear All ({compareList.length})
            </Button>
            <Link to="/properties">
              <Button variant="primary" size="sm">
                Add More Properties
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 w-48 sticky left-0">
                  Feature
                </th>
                {compareList.map((prop) => (
                  <th key={prop.id} className="p-4 w-72 align-top">
                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2">
                        <img
                          src={prop.primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromCompare(prop.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link to={`/properties/${prop.slug}`} className="block font-bold text-sm text-navy-900 line-clamp-1 hover:text-brand-600">
                        {prop.title}
                      </Link>
                      <p className="text-base font-extrabold text-brand-600">
                        {formatPrice(prop.price, prop.listingType)}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Listing Type</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-navy-900">{p.listingType}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Property Type</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">{p.propertyTypeName}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Location</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">{p.locality ? `${p.locality}, ` : ''}{p.city}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Bedrooms</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700 font-semibold">{p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Bathrooms</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700 font-semibold">{p.bathrooms}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Built-Up Area</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700 font-semibold">{p.builtUpArea} {p.areaUnit}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Furnishing</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">{p.furnishingStatus?.replace('_', ' ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Possession</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">{p.possessionStatus?.replace('_', ' ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 sticky left-0">Action</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <Link to={`/properties/${p.slug}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
