import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category, Page } from '../types';
import ProductCard from '../components/product/ProductCard';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Page<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state from URL
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortDir = searchParams.get('sortDir') || 'asc';
  const page = Number(searchParams.get('page') || 0);

  // Local search input
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    categoriesApi.getAll().then(r => { if (r.success) setCategories(r.data); });
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ search: search || undefined, categoryId, minPrice, maxPrice, sortBy, sortDir, page, size: 12 })
      .then(r => { if (r.success) setProducts(r.data); })
      .finally(() => setLoading(false));
  }, [search, categoryId, minPrice, maxPrice, sortBy, sortDir, page]);

  const setParam = (key: string, value: string | undefined) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam('search', searchInput || undefined);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasFilters = search || categoryId || minPrice || maxPrice;

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">All Products</h1>
            {products && (
              <p className="text-slate-400 mt-1">{products.totalElements} products found</p>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="input pl-9"
              />
            </div>
            <button type="submit" className="btn-primary px-4 py-3">Search</button>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <div className="card sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    <FiX size={12} /> Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setParam('categoryId', undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !categoryId ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >All Categories</button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setParam('categoryId', String(cat.id))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        categoryId === cat.id ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                      <span className="float-right text-xs opacity-60">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹500', min: undefined, max: 500 },
                    { label: '₹500 - ₹2,000', min: 500, max: 2000 },
                    { label: '₹2,000 - ₹10,000', min: 2000, max: 10000 },
                    { label: 'Above ₹10,000', min: 10000, max: undefined },
                  ].map(({ label, min, max }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setParam('minPrice', min ? String(min) : undefined);
                        setParam('maxPrice', max ? String(max) : undefined);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        minPrice === min && maxPrice === max ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Sort By</h4>
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={e => {
                    const [by, dir] = e.target.value.split('-');
                    const p = new URLSearchParams(searchParams);
                    p.set('sortBy', by);
                    p.set('sortDir', dir);
                    setSearchParams(p);
                  }}
                  className="input text-sm"
                >
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="createdAt-desc">Newest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-secondary mb-4 flex items-center gap-2 text-sm"
            >
              <FiFilter size={14} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-72 bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : !products || products.content.length === 0 ? (
              <div className="text-center py-20">
                <FiSearch size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg font-medium">No products found</p>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary mt-6">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.content.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {products.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      disabled={products.first}
                      onClick={() => setParam('page', String(page - 1))}
                      className="btn-secondary p-2 disabled:opacity-40"
                    ><FiChevronLeft size={18} /></button>
                    <span className="text-slate-400 text-sm">
                      Page {products.number + 1} of {products.totalPages}
                    </span>
                    <button
                      disabled={products.last}
                      onClick={() => setParam('page', String(page + 1))}
                      className="btn-secondary p-2 disabled:opacity-40"
                    ><FiChevronRight size={18} /></button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
