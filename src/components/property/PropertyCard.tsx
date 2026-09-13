import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize2, MapPin, CheckCircle, Scale, MessageCircle } from 'lucide-react';
import { PropertySummary } from '../../types';
import { Badge } from '../common/Badge';
import { formatPrice, buildWhatsAppLink } from '../../utils/format';
import { favouriteApi } from '../../api/dashboard';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

interface PropertyCardProps {
  property: PropertySummary;
  initialFavourite?: boolean;
  onFavouriteToggle?: (id: number, isFav: boolean) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  initialFavourite = false,
  onFavouriteToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isFav, setIsFav] = useState<boolean>(initialFavourite);
  const [isFavLoading, setIsFavLoading] = useState<boolean>(false);

  const inCompare = isInCompare(property.id);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setIsFavLoading(true);
      if (isFav) {
        await favouriteApi.remove(property.id);
        setIsFav(false);
        onFavouriteToggle?.(property.id, false);
      } else {
        await favouriteApi.add(property.id);
        setIsFav(true);
        onFavouriteToggle?.(property.id, true);
      }
    } catch (err) {
      console.error('Failed to toggle favourite', err);
    } finally {
      setIsFavLoading(false);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.primaryImageUrl || fallbackImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <Badge
            variant={property.listingType === 'RENT' ? 'info' : 'brand'}
            size="sm"
            className="font-semibold tracking-wide uppercase shadow-sm"
          >
            {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
          </Badge>
          {property.featured && (
            <Badge variant="warning" size="sm" className="font-semibold shadow-sm">
              Featured
            </Badge>
          )}
          {property.verified && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200 shadow-sm">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleToggleCompare}
            title={inCompare ? 'Remove from compare' : 'Compare property'}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              inCompare
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-brand-600'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFavourite}
            disabled={isFavLoading}
            title={isFav ? 'Remove from saved' : 'Save property'}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isFav
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Property Type Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
            {property.propertyTypeName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xl font-extrabold text-navy-900 tracking-tight">
              {formatPrice(property.price, property.listingType)}
            </span>
            <span className="text-xs text-slate-500">
              {property.propertyCode}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.slug}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-bold text-slate-900 line-clamp-1 text-base leading-snug mb-1.5">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            {property.locality ? `${property.locality}, ` : ''}{property.city}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{property.bedrooms}</span> Beds
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Bed className="w-4 h-4 text-slate-300" />
                <span>Open</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">{property.bathrooms}</span> Baths
            </div>

            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{property.builtUpArea}</span> {property.areaUnit}
            </div>
          </div>
        </div>

        {/* Agent Info & WhatsApp CTA */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 uppercase overflow-hidden">
              {property.agentName ? property.agentName.charAt(0) : 'A'}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800 line-clamp-1 leading-tight">
                {property.agentName || 'Premier Agent'}
              </p>
              <p className="text-[11px] text-slate-400">Verified Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {property.agentWhatsapp && (
              <a
                href={buildWhatsAppLink(property.agentWhatsapp, property.title, property.propertyCode, property.slug)}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}

            <Link
              to={`/properties/${property.slug}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-900 text-white hover:bg-brand-600 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
