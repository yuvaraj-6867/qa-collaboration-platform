import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useGlobalSnackbar } from '@/components/SnackbarProvider';
import { getErrorMessage } from '@/utils/errorHandler';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface LoginProps {
  onLogin: (token: string, user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [currentView, setCurrentView] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const { showError, showSuccess } = useGlobalSnackbar();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showSuccess('Login successful! Welcome back.');
      setTimeout(() => onLogin(data.token, data.user), 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = getErrorMessage(err);
      console.log('Error message:', errorMessage);
      showError(errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showError('Password and confirmation do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
        phone,
        location
      });
      const data = response.data;

      if (data.redirect_to_signin) {
        showSuccess('Registration successful! Please sign in.');
        setCurrentView('signin');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showSuccess('Account created successfully! Welcome to QA Platform.');
        setTimeout(() => onLogin(data.token, data.user), 1000);
      }
    } catch (err: any) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-60 blur-xl"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-purple-500 rounded-full opacity-50 blur-xl"></div>

        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-purple-200 text-lg mb-12">
            Enter personal details to your<br />
            employee account
          </p>

          <div className="flex bg-white/20 rounded-full p-2 max-w-sm mx-auto backdrop-blur-lg">
            <button
              onClick={() => setCurrentView('signin')}
              className="flex-1 py-3 px-6 rounded-full text-white font-medium transition-all hover:bg-white/20"
            >
              Sign in
            </button>
            <button
              onClick={() => setCurrentView('signup')}
              className="flex-1 py-3 px-6 rounded-full text-purple-600 bg-white font-medium transition-all hover:bg-gray-100"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'signin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentView('welcome')}
                className="flex items-center text-purple-600 hover:text-purple-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-blue-600 mb-2">Welcome back</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <button
                onClick={() => setCurrentView('signup')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('welcome')}
              className="flex items-center text-purple-600 hover:text-purple-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              BACK
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Get Started</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name *"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name *"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password *"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password *"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the processing of{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Personal data</a>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary mt-6"
              disabled={loading || !agreeToTerms}
            >
              {loading ? 'Signing up...' : 'SIGN UP'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              onClick={() => setCurrentView('signin')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;