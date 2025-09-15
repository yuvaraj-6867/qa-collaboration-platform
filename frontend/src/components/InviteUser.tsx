import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('qa_engineer');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/v1/user_invitations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, role })
      });
      
      setEmail('');
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="qa_engineer">QA Engineer</option>
        <option value="qa_manager">QA Manager</option>
        <option value="developer">Developer</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Invitation'}
      </Button>
    </form>
  );
};

export default InviteUser;