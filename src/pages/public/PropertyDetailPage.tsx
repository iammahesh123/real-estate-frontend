import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Compass,
  CheckCircle,
  Share2,
  Heart,
  Scale,
  MessageCircle,
  Phone,
  ShieldCheck,
  Building,
  Check,
  Navigation,
} from 'lucide-react';
import { propertyApi } from '../../api/properties';
import { crmApi } from '../../api/crm';
import { visitsApi } from '../../api/visits';
import { favouriteApi } from '../../api/dashboard';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { formatPrice, buildWhatsAppLink } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  // Selected Gallery Image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Form states
  const [enquiryName, setEnquiryName] = useState(user?.fullName || '');
  const [enquiryEmail, setEnquiryEmail] = useState(user?.email || '');
  const [enquiryPhone, setEnquiryPhone] = useState(user?.phone || '');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00');
  const [visitNotes, setVisitNotes] = useState('');
  const [isVisitSubmitting, setIsVisitSubmitting] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  // Fetch Property
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', slug],
    queryFn: () => propertyApi.getBySlug(slug!),
    enabled: !!slug,
  });

  // Favourites state
  const [isFav, setIsFav] = useState(false);
  useQuery({
    queryKey: ['isFavourite', property?.id],
    queryFn: async () => {
      if (!property?.id || !isAuthenticated) return false;
      const res = await favouriteApi.check(property.id);
      setIsFav(res);
      return res;
    },
    enabled: !!property?.id && isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-96 rounded-3xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm text-slate-500">The requested property listing may have been unlisted or expired.</p>
        <Link to="/properties">
          <Button variant="primary">Browse All Properties</Button>
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(property.id);

  const handleToggleFavourite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      if (isFav) {
        await favouriteApi.remove(property.id);
        setIsFav(false);
      } else {
        await favouriteApi.add(property.id);
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnquirySubmitting(true);
    try {
      await crmApi.createEnquiry({
        propertyId: property.id,
        name: enquiryName,
        email: enquiryEmail,
        phone: enquiryPhone,
        message: enquiryMessage,
        source: 'WEBSITE',
      });
      setEnquirySuccess(true);
      setTimeout(() => {
        setIsEnquiryModalOpen(false);
        setEnquirySuccess(false);
        setEnquiryMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit enquiry. Please check your contact information.');
    } finally {
      setIsEnquirySubmitting(false);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsVisitSubmitting(true);
    try {
      await visitsApi.schedule({
        propertyId: property.id,
        scheduledDate: visitDate,
        scheduledTime: visitTime + ':00',
        notes: visitNotes,
      });
      setVisitSuccess(true);
      setTimeout(() => {
        setIsVisitModalOpen(false);
        setVisitSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to schedule visit. Please verify date and time.');
    } finally {
      setIsVisitSubmitting(false);
    }
  };

  const allImages = property.media && property.media.length > 0
    ? property.media.map((m) => m.url)
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-slate-900">Properties</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 font-medium text-slate-700"
            >
              {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copyFeedback ? 'Copied Link' : 'Share'}
            </button>

            <button
              onClick={() => {
                if (inCompare) {
                  removeFromCompare(property.id);
                } else {
                  addToCompare({
                    id: property.id,
                    propertyCode: property.propertyCode,
                    title: property.title,
                    slug: property.slug,
                    listingType: property.listingType,
                    propertyTypeName: property.propertyTypeName,
                    propertyStatus: property.propertyStatus,
                    approvalStatus: property.approvalStatus,
                    price: property.price,
                    currency: property.currency,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    builtUpArea: property.builtUpArea,
                    areaUnit: property.areaUnit,
                    furnishingStatus: property.furnishingStatus,
                    possessionStatus: property.possessionStatus,
                    city: property.cityName,
                    locality: property.localityName,
                    primaryImageUrl: property.primaryImageUrl || property.media?.[0]?.url,
                    featured: property.featured,
                    verified: property.verified,
                    createdAt: property.createdAt,
                  });
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium ${
                inCompare
                  ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {inCompare ? 'In Comparison' : 'Compare'}
            </button>


            <button
              onClick={handleToggleFavourite}
              className={`p-2 rounded-lg border transition-colors ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={property.listingType === 'RENT' ? 'info' : 'brand'} size="sm" className="uppercase font-bold">
                {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
              </Badge>
              <Badge variant="slate" size="sm">{property.propertyTypeName}</Badge>
              {property.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> RERA Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-900 font-serif tracking-tight">
              {property.title}
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              {property.addressLine1}, {property.localityName ? `${property.localityName}, ` : ''}{property.cityName}, {property.postalCode}
            </p>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-3xl sm:text-4xl font-black text-navy-900 font-serif tracking-tight">
              {formatPrice(property.price, property.listingType)}
            </p>
            {property.pricePerSqft && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ₹ {property.pricePerSqft} / sqft
              </p>
            )}
          </div>
        </div>

        {/* Visual Gallery */}
        <div className="space-y-4 mb-12">
          {/* Main Large Image */}
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-xl">
            <img
              src={allImages[selectedImageIndex] || allImages[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail row */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-brand-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Bedrooms</p>
                  <p className="text-base font-bold text-slate-900">{property.bedrooms > 0 ? property.bedrooms : 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Bathrooms</p>
                  <p className="text-base font-bold text-slate-900">{property.bathrooms}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Built-Up Area</p>
                  <p className="text-base font-bold text-slate-900">{property.builtUpArea} {property.areaUnit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Facing</p>
                  <p className="text-base font-bold text-slate-900">{property.facing || 'East'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-navy-900 font-serif">Property Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Complete Specifications Table */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-navy-900 font-serif">Property Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Property ID</span>
                  <span className="font-semibold text-slate-900">{property.propertyCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Furnishing</span>
                  <span className="font-semibold text-slate-900">{property.furnishingStatus.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Possession</span>
                  <span className="font-semibold text-slate-900">{property.possessionStatus.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Property Age</span>
                  <span className="font-semibold text-slate-900">{property.propertyAge || 'New Construction'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Floor Level</span>
                  <span className="font-semibold text-slate-900">{property.floorNumber} of {property.totalFloors} Floors</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Parking Spaces</span>
                  <span className="font-semibold text-slate-900">{property.parkingSpaces} Reserved</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Carpet Area</span>
                  <span className="font-semibold text-slate-900">{property.carpetArea ? `${property.carpetArea} sqft` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Balconies</span>
                  <span className="font-semibold text-slate-900">{property.balconies}</span>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-navy-900 font-serif">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Map Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-navy-900 font-serif">Location & Vicinity</h3>
              <p className="text-sm text-slate-600">
                {property.addressLine1}, {property.localityName ? `${property.localityName}, ` : ''}{property.cityName}
              </p>

              {/* Map Preview Card */}
              <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                  alt="City Map"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-navy-950/20" />
                <div className="absolute z-10 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white text-center space-y-2">
                  <MapPin className="w-8 h-8 text-brand-600 mx-auto" />
                  <p className="font-bold text-sm text-slate-900">{property.localityName || property.cityName}</p>
                  <p className="text-[11px] text-slate-500">
                    Lat: {property.latitude || 17.4156}, Long: {property.longitude || 78.4350}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${property.latitude || 17.4156},${property.longitude || 78.4350}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 pt-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action & Agent Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-premium sticky top-28 space-y-6">
              {/* Agent Profile Header */}
              {property.agent && (
                <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={property.agent.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'}
                      alt={property.agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-navy-900">{property.agent.name}</h4>
                    <p className="text-xs text-brand-600 font-semibold">{property.agent.agencyName}</p>
                    <p className="text-[11px] text-slate-400">Lic: {property.agent.licenseNumber}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="md"
                  className="w-full font-bold shadow-md"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  Send Enquiry
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  onClick={() => setIsVisitModalOpen(true)}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  Schedule Site Visit
                </Button>

                {property.agent && property.agent.whatsappNumber && (
                  <a
                    href={buildWhatsAppLink(property.agent.whatsappNumber, property.title, property.propertyCode, property.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Chat on WhatsApp
                  </a>
                )}

                {property.agent && property.agent.phone && (
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Call Advisor: {property.agent.phone}
                  </a>
                )}
              </div>

              {/* Safety badge */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Zero spam guarantee. Your contact details are shared only with the verified advisor.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <Modal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        title="Submit Property Enquiry"
      >
        {enquirySuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Enquiry Received!</h4>
            <p className="text-xs text-slate-500">
              The assigned advisor has been notified and will reach out to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitEnquiry} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
              <textarea
                rows={3}
                placeholder="I am interested in this property and would like to receive detailed specifications and pricing details..."
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full font-bold"
              isLoading={isEnquirySubmitting}
            >
              Submit Enquiry
            </Button>
          </form>
        )}
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title="Schedule Private Walkthrough"
      >
        {visitSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Site Visit Requested!</h4>
            <p className="text-xs text-slate-500">
              Your appointment request has been scheduled. The advisor will confirm the time slot with you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleScheduleVisit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time</label>
                <input
                  type="time"
                  required
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes / Requests</label>
              <textarea
                rows={3}
                placeholder="Visiting with family, looking for East-facing high floor unit..."
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold"
              isLoading={isVisitSubmitting}
            >
              Confirm Appointment
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
