import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectApi, ProjectDetail } from '../../api/projects';
import { masterDataApi, City } from '../../api/master';
import { Skeleton } from '../../components/common/Skeleton';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const c = await masterDataApi.getCities();
        setCities(c);
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getAll(0, 30, selectedCityId);
        setProjects(data.content || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCityId]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Mega Townships & Developments
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Premier Builder Developments
          </h1>
          <p className="text-slate-600 mt-3 text-base">
            Explore world-class residential communities, high-rise architectural marvels, and mixed-use luxury developments with RERA approvals.
          </p>

          {/* City filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedCityId(undefined)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCityId === undefined
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCityId(city.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  selectedCityId === city.id
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-200 space-y-4">
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">No projects found in this location</h3>
            <p className="text-slate-500 text-sm mt-1">Try switching to &quot;All Cities&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={proj.bannerImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                      alt={proj.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {proj.reraNumber && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-emerald-600/95 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                          RERA Approved
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                        {proj.developerName}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-amber-600 transition">
                      <Link to={`/projects/${proj.slug}`}>{proj.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {proj.locality?.name}, {proj.city?.name}
                    </p>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {proj.description || 'Master-planned development offering luxury residences with lifestyle clubhouses, landscaped gardens, and high-speed elevators.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium">Towers</span>
                        <span className="font-bold text-slate-800 text-xs">{proj.totalTowers || 4} Towers</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium">Possession</span>
                        <span className="font-bold text-slate-800 text-xs">{proj.completionDate || 'Dec 2027'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
                  >
                    Explore Project Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
