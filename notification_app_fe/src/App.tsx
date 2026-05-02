import { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { Log } from './utils/log';
import type { Notification, FilterType } from './types';

const PAGE_SIZE = 10;

const typeOrder: Record<string, number> = {
  Placement: 1,
  Result: 2,
  Event: 3,
};

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      Log.info('Starting to fetch notifications');
      setLoading(true);
      setError(null);
      try {
        const token = import.meta.env.VITE_API_TOKEN || '';
        const response = await fetch('/evaluation-service/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const notificationsList = data.notifications || [];
        Log.info('Successfully fetched notifications', { count: notificationsList.length });
        setNotifications(notificationsList);
      } catch (err: any) {
        Log.error('Failed to fetch notifications', err);
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as FilterType;
    Log.info('User changed filter', { filter: newFilter });
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    Log.info('User changed search query', { search: newSearch });
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    Log.info('User navigated to next page', { page: currentPage + 1 });
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    Log.info('User navigated to previous page', { page: currentPage - 1 });
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...notifications];

    if (filter !== 'All') {
      result = result.filter(n => n.Type === filter);
    }

    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      result = result.filter(n => n.Message.toLowerCase().includes(lowerSearch));
    }

    result.sort((a, b) => {
      const orderA = typeOrder[a.Type] || 4;
      const orderB = typeOrder[b.Type] || 4;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const timeA = new Date(a.Timestamp).getTime();
      const timeB = new Date(b.Timestamp).getTime();
      return timeB - timeA;
    });

    return result;
  }, [notifications, filter, search]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE) || 1;
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="app-container">
      <header className="header">
        <h1>Notifications</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search messages..."
          value={search}
          onChange={handleSearchChange}
        />
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="All">All Types</option>
          <option value="Event">Event</option>
          <option value="Result">Result</option>
          <option value="Placement">Placement</option>
        </select>
      </div>

      {loading && <div className="loading">Loading notifications...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && filteredAndSorted.length === 0 && (
        <div className="empty">No notifications found.</div>
      )}

      {!loading && !error && filteredAndSorted.length > 0 && (
        <>
          <div className="notification-list">
            {paginatedData.map((notif) => (
              <div key={notif.ID} className="notification-item" data-type={notif.Type}>
                <div className="item-header">
                  <span className={`item-type type-${notif.Type}`}>
                    {notif.Type}
                  </span>
                  <span className="item-time">
                    {new Date(notif.Timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="item-message">{notif.Message}</div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="page-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
