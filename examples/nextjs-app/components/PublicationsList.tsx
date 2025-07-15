import React, { useState, useEffect } from 'react';
import {
  PublicationResponse,
  GetAllPublicationsResponse,
  PublicationSummary,
  EducationLevel,
  CategoryInfo,
  PublicationsListProps,
} from '@/types';

const PublicationsList: React.FC<PublicationsListProps> = ({ 
  apiEndpoint = 'https://your-api-gateway-url.amazonaws.com/Prod' 
}) => {
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EducationLevel | 'all'>('all');
  const [summary, setSummary] = useState<PublicationSummary>({
    total: 0,
    byEducationLevel: {
      'K-12': 0,
      'Higher Ed': 0,
      'Adult Learning': 0
    }
  });

  const categories: CategoryInfo[] = [
    { value: 'all', label: 'All Publications', color: '#6366f1' },
    { value: 'K-12', label: 'K-12 Education', color: '#10b981' },
    { value: 'Higher Ed', label: 'Higher Education', color: '#f59e0b' },
    { value: 'Adult Learning', label: 'Adult Learning', color: '#ef4444' }
  ];

  useEffect(() => {
    void fetchPublications();
  }, [selectedCategory]);

  const fetchPublications = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = selectedCategory === 'all' 
        ? `${apiEndpoint}/publications`
        : `${apiEndpoint}/publications?educationLevel=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GetAllPublicationsResponse = await response.json();
      setPublications(data.publications || []);
      setSummary(data.summary || {
        total: 0,
        byEducationLevel: {
          'K-12': 0,
          'Higher Ed': 0,
          'Adult Learning': 0
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAuthors = (authors: string[]): string => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
  };

  const getCategoryColor = (category: EducationLevel): string => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.color : '#6366f1';
  };

  const truncateText = (text: string | undefined, maxLength: number = 300): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value as EducationLevel | 'all';
    setSelectedCategory(value);
  };

  const getSummaryCount = (category: CategoryInfo): number => {
    if (category.value === 'all') {
      return summary.total;
    }
    return summary.byEducationLevel[category.value as EducationLevel] || 0;
  };

  if (loading) {
    return (
      <div className="publications-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publications-container">
        <div className="error-message">
          <h3>Error Loading Publications</h3>
          <p>{error}</p>
          <button onClick={() => void fetchPublications()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="publications-container">
      <header className="publications-header">
        <h1>Research Publications</h1>
        <p className="header-subtitle">
          Categorized research publications from Digital Promise's content management system
        </p>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        {categories.map(category => (
          <div key={category.value} className="summary-card">
            <div className="summary-count" style={{ color: category.color }}>
              {getSummaryCount(category)}
            </div>
            <div className="summary-label">{category.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select 
          id="category-filter"
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="category-filter"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Publications List */}
      <div className="publications-grid">
        {publications.length === 0 ? (
          <div className="empty-state">
            <h3>No Publications Found</h3>
            <p>No publications match the selected criteria.</p>
          </div>
        ) : (
          publications.map(publication => (
            <article key={publication.id} className="publication-card">
              <div className="publication-header">
                <div 
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(publication.educationLevel) }}
                >
                  {publication.educationLevel}
                </div>
                <time className="publication-date">
                  {formatDate(publication.publicationDate || publication.processedAt)}
                </time>
              </div>
              
              <h3 className="publication-title">{publication.title}</h3>
              
              <div className="publication-authors">
                By {formatAuthors(publication.authors)}
              </div>
              
              {publication.abstract && (
                <p className="publication-abstract">
                  {truncateText(publication.abstract)}
                </p>
              )}
              
              {publication.keywords && (
                <div className="publication-keywords">
                  <strong>Keywords:</strong> {publication.keywords}
                </div>
              )}
              
              <div className="publication-footer">
                {publication.sourceUrl && (
                  <a 
                    href={publication.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    View Source
                  </a>
                )}
                <span className="processed-date">
                  Processed: {formatDate(publication.processedAt)}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="refresh-section">
        <button onClick={() => void fetchPublications()} className="refresh-button">
          Refresh Publications
        </button>
      </div>
    </div>
  );
};

export default PublicationsList; 