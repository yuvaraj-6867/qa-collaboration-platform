import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyInvitation();
    } else {
      setError('Invalid invitation link');
      setLoading(false);
    }
  }, [token]);

  const verifyInvitation = async () => {
    try {
      const response = await fetch(`/api/v1/user_invitations/verify?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setInvitation(data.invitation);
      } else {
        setError('Invalid or expired invitation');
      }
    } catch (err) {
      setError('Failed to verify invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/v1/user_invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          user: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
            password_confirmation: formData.confirmPassword
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError('Failed to accept invitation');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Accept Invitation</CardTitle>
          <p className="text-gray-600">
            You've been invited to join as a {invitation?.role?.replace('_', ' ')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={invitation?.email || ''} disabled />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="John"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter password"
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Confirm password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button 
            onClick={handleAcceptInvitation} 
            className="w-full"
            disabled={!formData.firstName || !formData.lastName || !formData.password}
          >
            Accept Invitation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;