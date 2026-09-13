import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propertyApi } from '../../api/properties';
import { masterDataApi, City, Locality, PropertyType, Amenity } from '../../api/master';

export const AgentCreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();

  // Master Data
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState('SALE');
  const [propertyTypeId, setPropertyTypeId] = useState<number>(1);
  const [price, setPrice] = useState<number>(15000000);
  const [builtUpArea, setBuiltUpArea] = useState<number>(1850);
  const [carpetArea, setCarpetArea] = useState<number>(1520);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [floorNumber, setFloorNumber] = useState<number>(14);
  const [totalFloors, setTotalFloors] = useState<number>(32);
  const [furnishingStatus, setFurnishingStatus] = useState('SEMI_FURNISHED');
  const [possessionStatus, setPossessionStatus] = useState('READY_TO_MOVE');
  const [facing, setFacing] = useState('EAST');
  const [parkingSpaces, setParkingSpaces] = useState<number>(2);

  // Location
  const [cityId, setCityId] = useState<number>(1);
  const [localityId, setLocalityId] = useState<number>(1);
  const [addressLine1, setAddressLine1] = useState('');
  const [postalCode, setPostalCode] = useState('400050');

  // Amenities & Images
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([1, 2, 3, 4]);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadMaster = async () => {
      try {
        const [typesData, amensData, citiesData] = await Promise.all([
          masterDataApi.getPropertyTypes(),
          masterDataApi.getAmenities(),
          masterDataApi.getCities(),
        ]);
        setPropertyTypes(typesData);
        if (typesData.length > 0) setPropertyTypeId(typesData[0].id);
        setAmenities(amensData);
        setCities(citiesData);
        if (citiesData.length > 0) {
          setCityId(citiesData[0].id);
          const locs = await masterDataApi.getLocalities(citiesData[0].id);
          setLocalities(locs);
          if (locs.length > 0) setLocalityId(locs[0].id);
        }
      } catch (err) {
        console.error('Failed to load master metadata:', err);
      }
    };
    loadMaster();
  }, []);

  const handleCityChange = async (newCityId: number) => {
    setCityId(newCityId);
    try {
      const locs = await masterDataApi.getLocalities(newCityId);
      setLocalities(locs);
      if (locs.length > 0) setLocalityId(locs[0].id);
    } catch (err) {
      console.error('Failed to load localities for city:', err);
    }
  };

  const toggleAmenity = (id: number) => {
    if (selectedAmenityIds.includes(id)) {
      setSelectedAmenityIds(selectedAmenityIds.filter((a) => a !== id));
    } else {
      setSelectedAmenityIds([...selectedAmenityIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const payload = {
        title,
        description,
        listingType,
        propertyTypeId: Number(propertyTypeId),
        price: Number(price),
        builtUpArea: Number(builtUpArea),
        carpetArea: Number(carpetArea),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        floorNumber: Number(floorNumber),
        totalFloors: Number(totalFloors),
        furnishingStatus,
        possessionStatus,
        facing,
        parkingSpaces: Number(parkingSpaces),
        cityId: Number(cityId),
        localityId: localityId ? Number(localityId) : undefined,
        addressLine1: addressLine1 || 'Prime Luxury Boulevard',
        postalCode,
        amenityIds: selectedAmenityIds,
        imageUrls: imageUrl ? [imageUrl] : [],
      };

      await propertyApi.create(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/agent/properties');
      }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to submit property listing. Please review the inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              Listing Creator
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Publish New Property Listing
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide complete architectural, pricing, and location details for admin review and marketplace publishing.
            </p>
          </div>

          <Link
            to="/agent/properties"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl bg-white"
          >
            &larr; Cancel &amp; Back
          </Link>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-6 rounded-3xl mb-8 text-center font-bold">
            ✓ Property listing created successfully! Redirecting to your portfolio...
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-700 border border-rose-200 p-4 rounded-2xl mb-6 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Basic Overview &amp; Pricing
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Imperial Sea-Facing Penthouse at Worli Sea Face"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Type *
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent / Lease</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyTypeId}
                  onChange={(e) => setPropertyTypeId(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {propertyTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe architectural highlights, interior specifications, designer fittings, ceiling height, panoramic vistas, and neighborhood connectivity..."
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Area & Floor Plan Specifications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Dimensions &amp; Configuration
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Built-up Area (sq ft) *</label>
                <input
                  type="number"
                  required
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carpet Area (sq ft)</label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Balconies</label>
                <input
                  type="number"
                  value={balconies}
                  onChange={(e) => setBalconies(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Level</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Building Floors</label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Covered Car Parks</label>
                <input
                  type="number"
                  value={parkingSpaces}
                  onChange={(e) => setParkingSpaces(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing</label>
                <select
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Possession Status</label>
                <select
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="READY_TO_MOVE">Ready to Move</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vastu / Facing</label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="EAST">East</option>
                  <option value="NORTH_EAST">North-East</option>
                  <option value="NORTH">North</option>
                  <option value="WEST">West</option>
                  <option value="SOUTH">South</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              3. Micro-Market &amp; Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <select
                  value={cityId}
                  onChange={(e) => handleCityChange(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.stateName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Locality / Neighborhood
                </label>
                <select
                  value={localityId}
                  onChange={(e) => setLocalityId(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {localities.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="e.g. 1401 Tower B, Palais Royale, Worli Sea Face"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              4. Features &amp; Lifestyle Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center space-x-2 p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedAmenityIds.includes(amenity.id)
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenityIds.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 5: Showcase Media */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              5. High-Resolution Showcase Image
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {imageUrl && (
              <div className="mt-2 h-44 w-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link
              to="/agent/properties"
              className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Creating Listing...' : 'Submit Listing for Admin Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
