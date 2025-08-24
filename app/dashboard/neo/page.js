"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DEFAULT_FETCH_SIZE = 50; // how many items to request per API page

const NeoPage = () => {
  const [neoData, setNeoData] = useState(null); // full API payload (may be appended)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNeo, setSelectedNeo] = useState(null);
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' | 'imperial'
  const [filters, setFilters] = useState({
    hazardousOnly: false,
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Helpers
  const safeToFixed = (val, digits = 2) => {
    const n = Number(val);
    return Number.isFinite(n) ? n.toFixed(digits) : 'N/A';
  };
  const fmtNumber = (val, opts) => {
    const n = Number(val);
    return Number.isFinite(n) ? n.toLocaleString(undefined, opts) : 'N/A';
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(dateString);
    return Number.isFinite(d.getTime()) ? d.toLocaleDateString(undefined, options) : 'N/A';
  };

  // Fetchers
  const fetchNeoData = async (page = 0, append = false, size = DEFAULT_FETCH_SIZE) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
      const response = await axios.get('https://api.nasa.gov/neo/rest/v1/neo/browse', {
        params: { api_key: apiKey, page, size },
        signal: controller.signal,
      });
      const data = response.data;
      setError(null);

      if (append && neoData?.near_earth_objects) {
        // Append new objects and update page/links
        const merged = {
          ...data,
          near_earth_objects: [...neoData.near_earth_objects, ...data.near_earth_objects],
        };
        setNeoData(merged);
      } else {
        setNeoData(data);
      }
    } catch (err) {
      if (axios.isCancel?.(err)) return; // request aborted
      const status = err?.response?.status;
      const msg = status ? `Failed to fetch NEO data (HTTP ${status})` : (err?.message || 'Failed to fetch NEO data');
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  useEffect(() => {
    const cleanup = fetchNeoData(0, false, DEFAULT_FETCH_SIZE);
    return () => {
      // Restore scroll if modal was left open and abort inflight
      document.body.style.overflow = 'auto';
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  // Handle NEO selection for detail view
  const handleSelectNeo = (neo) => {
    setSelectedNeo(neo);
    document.body.style.overflow = 'hidden';
  };

  // Close detail view
  const handleCloseDetail = () => {
    setSelectedNeo(null);
    document.body.style.overflow = 'auto';
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  // Derived helpers for units
  const diameterKey = unitSystem === 'metric' ? 'kilometers' : 'miles';
  const distanceKey = unitSystem === 'metric' ? 'kilometers' : 'miles';
  const velocityKey = unitSystem === 'metric' ? 'kilometers_per_second' : 'miles_per_hour';
  const distanceUnitLabel = unitSystem === 'metric' ? 'km' : 'mi';
  const velocityUnitLabel = unitSystem === 'metric' ? 'km/s' : 'mph';
  const diameterUnitLabel = unitSystem === 'metric' ? 'km' : 'mi';

  // Filter and sort NEOs based on current filters
  const getFilteredAndSortedNEOs = () => {
    if (!neoData?.near_earth_objects) return [];
    let result = [...neoData.near_earth_objects];

    // Search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(neo =>
        neo.name?.toLowerCase().includes(query) ||
        neo.neo_reference_id?.includes(query)
      );
    }

    // Hazardous filter
    if (filters.hazardousOnly) {
      result = result.filter(neo => neo.is_potentially_hazardous_asteroid);
    }

    // Sorting
    result.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'size':
          aValue = a.estimated_diameter?.kilometers?.estimated_diameter_max ?? -Infinity;
          bValue = b.estimated_diameter?.kilometers?.estimated_diameter_max ?? -Infinity;
          break;
        case 'date': {
          const ad = a.close_approach_data?.[0]?.close_approach_date;
          const bd = b.close_approach_data?.[0]?.close_approach_date;
          aValue = ad ? new Date(ad) : new Date(0);
          bValue = bd ? new Date(bd) : new Date(0);
          break;
        }
        case 'hazardous':
          aValue = a.is_potentially_hazardous_asteroid ? 1 : 0;
          bValue = b.is_potentially_hazardous_asteroid ? 1 : 0;
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }

      if (typeof aValue === 'string') {
        return filters.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (aValue instanceof Date) {
        return filters.sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else {
        return filters.sortOrder === 'asc' ? (aValue - bValue) : (bValue - aValue);
      }
    });

    return result;
  };

  // Pagination (client-side)
  const getCurrentPageItems = () => {
    const filtered = getFilteredAndSortedNEOs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };
  const getTotalPages = () => {
    const filtered = getFilteredAndSortedNEOs();
    return Math.ceil(filtered.length / itemsPerPage) || 1;
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // API load more (append next NASA page)
  const handleLoadMore = async () => {
    if (!neoData?.page) return;
    const nextPage = (neoData.page.number ?? 0) + 1;
    const totalPages = neoData.page.total_pages ?? 0;
    if (nextPage >= totalPages) return;
    await fetchNeoData(nextPage, true, neoData.page.size || DEFAULT_FETCH_SIZE);
  };

  // Loading
  if (loading && !neoData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl font-light">Loading Near Earth Objects data...</p>
          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2.5 mx-auto">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !neoData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center p-10 bg-red-900 bg-opacity-30 backdrop-blur-sm rounded-xl border border-red-700 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main content
  const filteredNEOs = getFilteredAndSortedNEOs();
  const totalPages = getTotalPages();
  const currentItems = getCurrentPageItems();

  const totalLoaded = neoData?.near_earth_objects?.length || 0;
  const apiTotal = neoData?.page?.total_elements ?? totalLoaded;
  const apiPageNumber = (neoData?.page?.number ?? 0) + 1; // 1-based
  const apiTotalPages = neoData?.page?.total_pages ?? 1;
  const datasetUpdated = neoData?.near_earth_objects?.[0]?.orbital_data?.orbit_determination_date || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Near Earth Objects Browser</h1>
            <p className="text-gray-400">Explore NASA's database of asteroids and comets</p>
          </div>
          <div className="bg-blue-900 bg-opacity-30 px-4 py-2 rounded-lg border border-blue-700">
            <p className="text-sm">
              Total Objects: <span className="font-bold text-blue-400">{fmtNumber(apiTotal)}</span>
            </p>
            <p className="text-xs text-gray-400">Loaded: {fmtNumber(totalLoaded)} • API Page {apiPageNumber}/{apiTotalPages}</p>
            <p className="text-xs text-gray-400">
              Orbit determination updated: {datasetUpdated ? formatDate(datasetUpdated) : 'Unknown'}
            </p>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="mb-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Hazardous Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Filter</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hazardousOnly"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                checked={filters.hazardousOnly}
                onChange={(e) => handleFilterChange('hazardousOnly', e.target.checked)}
              />
              <label htmlFor="hazardousOnly" className="ml-2 text-sm">
                Potentially Hazardous Only
              </label>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
            <div className="flex space-x-2">
              <select
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="date">Closest Approach</option>
                <option value="hazardous">Hazardous</option>
              </select>
              <button
                className="bg-gray-700 border border-gray-600 rounded-lg p-2 hover:bg-gray-600 transition"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                aria-label="Toggle sort order"
                title="Toggle sort order"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Units</label>
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
            >
              <option value="metric">Metric (km, km/s)</option>
              <option value="imperial">Imperial (mi, mph)</option>
            </select>
          </div>

          {/* Items per page */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Items per page</label>
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              {[8, 12, 16, 24, 32, 48].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-4 text-sm text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>
            Showing {filteredNEOs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredNEOs.length)} of {fmtNumber(filteredNEOs.length)} (loaded {fmtNumber(totalLoaded)} / {fmtNumber(apiTotal)})
          </span>
          {filters.hazardousOnly && (
            <span className="text-yellow-400">
              Filter: Potentially Hazardous Asteroids Only
            </span>
          )}
        </div>
      </div>

      {/* NEO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentItems.length > 0 ? (
          currentItems.map((neo) => {
            const diam = neo.estimated_diameter?.[diameterKey];
            const diamMin = diam?.estimated_diameter_min;
            const diamMax = diam?.estimated_diameter_max;
            const approach = neo.close_approach_data?.[0];
            const orbitBody = approach?.orbiting_body || '—';
            const distancePrimary = approach?.miss_distance?.[distanceKey];
            const distanceAU = approach?.miss_distance?.astronomical;
            const velPrimary = approach?.relative_velocity?.[velocityKey];

            return (
              <div
                key={neo.neo_reference_id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg"
                onClick={() => handleSelectNeo(neo)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold truncate" title={neo.name}>{neo.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${neo.is_potentially_hazardous_asteroid ? 'bg-red-600' : 'bg-green-600'}`}>
                      {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-400 text-sm mb-1">Estimated Diameter ({diameterUnitLabel})</p>
                    <p className="font-medium">
                      {safeToFixed(diamMin)} - {safeToFixed(diamMax)} {diameterUnitLabel}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Abs Magnitude (H): {safeToFixed(neo.absolute_magnitude_h, 2)}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-400 text-sm mb-1">Closest Approach</p>
                    <p className="font-medium">
                      {approach?.close_approach_date ? formatDate(approach.close_approach_date) : 'No data'}
                    </p>
                    {approach && (
                      <p className="text-sm text-gray-400 mt-1">
                        Distance: {fmtNumber(distancePrimary)} {distanceUnitLabel} • {safeToFixed(distanceAU, 6)} AU
                      </p>
                    )}
                    {approach && (
                      <p className="text-sm text-gray-400 mt-1">
                        Velocity: {fmtNumber(velPrimary)} {velocityUnitLabel} • Body: {orbitBody}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">ID: {neo.neo_reference_id}</span>
                    <button className="text-blue-400 hover:text-blue-300 flex items-center">
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-5xl mb-4">🌌</div>
            <h3 className="text-xl font-bold mb-2">No Near Earth Objects found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Load more from API (append) */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleLoadMore}
          disabled={loading || (neoData?.page && (neoData.page.number + 1 >= neoData.page.total_pages))}
          className={`px-6 py-2 rounded-lg border ${loading || (neoData?.page && (neoData.page.number + 1 >= neoData.page.total_pages)) ? 'border-gray-700 text-gray-500 cursor-not-allowed' : 'border-blue-600 text-blue-400 hover:bg-gray-800'}`}
        >
          {neoData?.page && (neoData.page.number + 1 < neoData.page.total_pages) ? 'Load More' : 'All Data Loaded'}
        </button>
      </div>

      {/* Pagination (client-side over loaded data) */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-12">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              aria-label="Previous page"
              title="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              aria-label="Next page"
              title="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Detail Modal */}
      {selectedNeo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={handleCloseDetail}>
          <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{selectedNeo.name}</h2>
                <p className="text-gray-400">NASA/JPL Small-Body Database</p>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="Close details"
                title="Close"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Overview Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Reference ID</p>
                    <p className="font-medium">{selectedNeo.neo_reference_id}</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Absolute Magnitude (H)</p>
                    <p className="font-medium">{safeToFixed(selectedNeo.absolute_magnitude_h, 2)}</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Hazard Status</p>
                    <p className={`font-medium ${selectedNeo.is_potentially_hazardous_asteroid ? 'text-red-400' : 'text-green-400'}`}>
                      {selectedNeo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}
                    </p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Sentry Object</p>
                    <p className="font-medium">{String(selectedNeo.is_sentry_object ?? false)}</p>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
                  Physical Characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Estimated Diameter Min</p>
                    <p className="font-medium">{safeToFixed(selectedNeo.estimated_diameter?.[diameterKey]?.estimated_diameter_min)} {diameterUnitLabel}</p>
                    <p className="text-xs text-gray-500 mt-1">{safeToFixed(selectedNeo.estimated_diameter?.meters?.estimated_diameter_min)} m</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Estimated Diameter Max</p>
                    <p className="font-medium">{safeToFixed(selectedNeo.estimated_diameter?.[diameterKey]?.estimated_diameter_max)} {diameterUnitLabel}</p>
                    <p className="text-xs text-gray-500 mt-1">{safeToFixed(selectedNeo.estimated_diameter?.meters?.estimated_diameter_max)} m</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">JPL URL</p>
                    <a
                      href={selectedNeo.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {selectedNeo.nasa_jpl_url}
                    </a>
                  </div>
                </div>
              </div>

              {/* Observation & Classification */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Observation & Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">First Observation</p>
                    <p className="font-medium">{formatDate(selectedNeo.orbital_data?.first_observation_date)}</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Last Observation</p>
                    <p className="font-medium">{formatDate(selectedNeo.orbital_data?.last_observation_date)}</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600 md:col-span-2">
                    <p className="text-gray-400 text-sm">Orbit Class</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.orbit_class?.orbit_class_type || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedNeo.orbital_data?.orbit_class?.orbit_class_description || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Orbital Data */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Orbital Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Semi-Major Axis</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.semi_major_axis} AU</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Eccentricity</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.eccentricity}</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Inclination</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.inclination}°</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Orbital Period</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.orbital_period} days</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Perihelion Distance</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.perihelion_distance} AU</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Aphelion Distance</p>
                    <p className="font-medium">{selectedNeo.orbital_data?.aphelion_distance} AU</p>
                  </div>
                </div>
              </div>

              {/* Close Approach Data */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Close Approach Data
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Body</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Distance ({distanceUnitLabel})</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Distance (AU)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Velocity ({velocityUnitLabel})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {selectedNeo.close_approach_data?.length > 0 ? (
                        selectedNeo.close_approach_data.map((approach, index) => (
                          <tr key={index} className="hover:bg-gray-700 hover:bg-opacity-30">
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(approach.close_approach_date)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{approach.orbiting_body || '—'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{fmtNumber(approach.miss_distance?.[distanceKey])}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{safeToFixed(approach.miss_distance?.astronomical, 6)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{fmtNumber(approach.relative_velocity?.[velocityKey])}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                            No close approach data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Additional Information
                </h3>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                  <p className="text-gray-400 text-sm">NASA JPL URL</p>
                  <a
                    href={selectedNeo.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {selectedNeo.nasa_jpl_url}
                  </a>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 text-center text-sm text-gray-500">
              Data provided by NASA Near Earth Object Web Service (NeoWS)
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Data source: NASA Near Earth Object Web Service (NeoWS)</p>
        <p className="mt-2">© {new Date().getFullYear()} Near Earth Objects Browser</p>
      </footer>
    </div>
  );
};

export default NeoPage;
