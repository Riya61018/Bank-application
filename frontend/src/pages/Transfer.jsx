import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Transfer() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const idempotencyKey = uuidv4();
      await api.post('/transactions', {
        fromAccount,
        toAccount,
        amount: Number(amount),
        idempotencyKey
      });
      
      setSuccess('Transaction successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2 className="mb-4">Transfer Funds</h2>
        {error && <div className="text-danger mb-4">{error}</div>}
        {success && <div className="text-success mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">From Account ID</label>
            <input 
              type="text" 
              className="form-input" 
              value={fromAccount} 
              onChange={e => setFromAccount(e.target.value)} 
              placeholder="Your Account ID"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">To Account ID</label>
            <input 
              type="text" 
              className="form-input" 
              value={toAccount} 
              onChange={e => setToAccount(e.target.value)} 
              placeholder="Recipient Account ID"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input 
              type="number" 
              min="1"
              step="0.01"
              className="form-input" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading}>
            {loading ? 'Processing...' : 'Send Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
