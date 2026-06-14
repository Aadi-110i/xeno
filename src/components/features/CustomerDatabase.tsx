'use client';

import { Search, X, Mail, Phone, ExternalLink } from 'lucide-react';
import styles from './CustomerDatabase.module.css';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSpent: number;
  customFields: string;
  createdAt: string;
}

interface CustomerDatabaseProps {
  customers: Customer[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortOption: string;
  setSortOption: (val: string) => void;
  onViewDetails: (customer: Customer) => void;
}

export default function CustomerDatabase({
  customers,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  onViewDetails
}: CustomerDatabaseProps) {
  const filteredCustomers = customers
    .filter(c => {
      const full = `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase();
      return full.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === 'totalSpent-desc') return b.totalSpent - a.totalSpent;
      if (sortOption === 'totalSpent-asc') return a.totalSpent - b.totalSpent;
      if (sortOption === 'name-asc') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      return 0;
    });

  return (
    <div className="animated-fade-in">
      <div className={styles.tableToolbar}>
        <div className={styles.searchContainer}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text"
            className={styles.searchInput}
            placeholder="Search shoppers by identity or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className={styles.select}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="totalSpent-desc">Sort: Highest Spends</option>
          <option value="totalSpent-asc">Sort: Lowest Spends</option>
          <option value="name-asc">Sort: Name (A-Z)</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Identity</th>
              <th>Contact Node</th>
              <th>Value</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No shopper records found matching the active filters.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(cust => (
                <tr key={cust.id} className={styles.row}>
                  <td>
                    <div className={styles.identityCell}>
                      <span className={styles.name}>{cust.firstName} {cust.lastName}</span>
                      <span className={styles.id}>ID: {cust.id.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactCell}>
                      <div className={styles.contactItem}><Mail size={12} /> {cust.email}</div>
                      <div className={styles.contactItem}><Phone size={12} /> {cust.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.valueCell}>
                      <span className={styles.amount}>${cust.totalSpent.toFixed(0)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.statusBadge}>Verified</span>
                  </td>
                  <td className={styles.actionCell}>
                    <button className={styles.actionBtn} onClick={() => onViewDetails(cust)}>
                      Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CustomerModal({ 
  customer, 
  history, 
  loading, 
  onClose 
}: { 
  customer: Customer | null; 
  history: any; 
  loading: boolean; 
  onClose: () => void; 
}) {
  if (!customer) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <h2>{customer.firstName} {customer.lastName}</h2>
            <span className={styles.modalId}>System Identity: {customer.id}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loader}>Fetching behavioral history...</div>
          ) : (
            <div className={styles.detailsGrid}>
              {/* Summary Cards */}
              <div className={styles.summaryRow}>
                <div className={styles.summaryCard}>
                  <label className={styles.cardLabel}>Contact Matrix</label>
                  <div className={styles.cardValue}>{customer.email}</div>
                  <div className={styles.cardSubValue}>{customer.phone}</div>
                </div>
                <div className={styles.summaryCard}>
                  <label className={styles.cardLabel}>Lifetime Attribution</label>
                  <div className={`${styles.cardValue} text-silver`}>${customer.totalSpent.toFixed(2)}</div>
                  <div className={styles.cardSubValue}>Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Transactions */}
              <div className={styles.historySection}>
                <h3 className={styles.sectionTitle}>Transactional Ledger ({history?.orders?.length || 0})</h3>
                <div className={styles.historyTableWrapper}>
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Execution Date</th>
                        <th>Payload Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history?.orders?.map((ord: any) => (
                        <tr key={ord.id}>
                          <td>#{ord.id.slice(-6).toUpperCase()}</td>
                          <td>{new Date(ord.purchaseDate).toLocaleDateString()}</td>
                          <td className="text-silver font-mono">${ord.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      {(!history?.orders || history.orders.length === 0) && (
                        <tr><td colSpan={3} className={styles.emptyTable}>No transactions recorded.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Communication Logs */}
              <div className={styles.historySection}>
                <h3 className={styles.sectionTitle}>Engagement Callback Logs ({history?.commLogs?.length || 0})</h3>
                <div className={styles.historyTableWrapper}>
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Node</th>
                        <th>Status</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history?.commLogs?.map((log: any) => (
                        <tr key={log.id}>
                          <td style={{ fontWeight: 600 }}>{log.campaign?.name}</td>
                          <td className={styles.channelBadge}>{log.channel}</td>
                          <td><span className={styles.statusBadgeSmall}>{log.status}</span></td>
                          <td className={styles.timeLogs}>
                            {log.sentAt && <div>TX: {new Date(log.sentAt).toLocaleTimeString()}</div>}
                            {log.convertedAt && <div className="text-silver">CV: {new Date(log.convertedAt).toLocaleTimeString()}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
