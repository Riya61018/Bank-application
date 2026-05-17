import { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balances, setBalances] = useState({});

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data.accounts);
      
      // Fetch balance for each account
      res.data.accounts.forEach(async (acc) => {
        const balRes = await api.get(`/accounts/balance/${acc._id}`);
        setBalances(prev => ({ ...prev, [acc._id]: balRes.data.balance }));
      });
    } catch (err) {
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const createAccount = async () => {
    try {
      await api.post('/accounts');
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create account');
    }
  };

  const changeAccountStatus = async (accountId, newStatus) => {
    try {
      await api.patch(`/accounts/${accountId}/status`, { status: newStatus });
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2>Your Accounts</h2>
        <button onClick={createAccount} className="btn btn-primary">
          + Open New Account
        </button>
      </div>

      {error && <div className="text-danger mb-4">{error}</div>}

      {accounts.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <h3 className="text-muted">You don't have any accounts yet.</h3>
          <p className="mt-4">Click the button above to open your first account.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {accounts.map(acc => (
            <div key={acc._id} className="account-card">
              <div className="flex justify-between items-center text-muted">
                <span>Account ID</span>
                <span style={{ fontSize: '0.8rem', background: 'var(--background)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {acc.status}
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {acc._id}
              </div>
              <div className="mt-4">
                <div className="text-muted text-sm">Available Balance ({acc.currency})</div>
                <div className="balance-amount">
                  {balances[acc._id] !== undefined ? `${acc.currency === 'INR' ? '₹' : ''}${balances[acc._id].toFixed(2)}` : '...'}
                </div>
              </div>
              {acc.status === 'ACTIVE' && (
                <div className="mt-4">
                  <button 
                    onClick={() => changeAccountStatus(acc._id, 'CLOSED')}
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: '100%' }}
                  >
                    Close Account
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
