import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';

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
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string; firstName?: string; lastName?: string; confirmPassword?: string}>({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    // Basic validation
    const errors: {email?: string; password?: string} = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login(email, password);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage('Login successful! Welcome back.');
      
      // Add login notification
      if ((window as any).addNotification) {
        (window as any).addNotification(
          'Login Successful', 
          `Welcome back, ${data.user.first_name || data.user.email}!`, 
          'success'
        );
      }
      
      setTimeout(() => onLogin(data.token, data.user), 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = getErrorMessage(err);
      console.log('Error message:', errorMessage);
      
      // Show error in snackbar
      showMessage('Invalid email or password. Please try again.');
      
      // Show field errors
      setFieldErrors({ 
        email: 'Please check your email', 
        password: 'Please check your password' 
      });
      
      // Clear password for security
      setPassword('');
      
      // Ensure we stay on signin page
      console.log('Staying on signin page');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    // Basic validation
    const errors: {firstName?: string; lastName?: string; email?: string; password?: string; confirmPassword?: string} = {};
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
        showMessage('Registration successful! Please sign in.');
        setCurrentView('signin');
        // Keep email but clear password fields for security
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setLocation('');
        setAgreeToTerms(false);
        setFieldErrors({});
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showMessage('Account created successfully! Welcome to QA Platform.');
        setTimeout(() => onLogin(data.token, data.user), 1000);
      }
    } catch (err: any) {
      showMessage(getErrorMessage(err));
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
              onClick={() => {
                setCurrentView('signin');
                setFieldErrors({});
                setEmail('');
                setPassword('');
              }}
              className="flex-1 py-3 px-6 rounded-full text-white font-medium transition-all hover:bg-white/20"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setCurrentView('signup');
                setFieldErrors({});
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPhone('');
                setLocation('');
                setAgreeToTerms(false);
              }}
              className="flex-1 py-3 px-6 rounded-full text-purple-600 bg-white font-medium transition-all hover:bg-gray-100"
            >
              Sign up
            </button>
          </div>
        </div>
        
        {/* Custom Snackbar */}
        {showSnackbar && (
          <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{snackbarMessage}</span>
              <button
                onClick={() => setShowSnackbar(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
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
                onClick={() => {
                  setCurrentView('welcome');
                  setFieldErrors({});
                  setEmail('');
                  setPassword('');
                }}
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
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="Email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                )}
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
                onClick={() => {
                  setCurrentView('signup');
                  setFieldErrors({});
                  setEmail('');
                  setPassword('');
                }}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
        
        {/* Custom Snackbar */}
        {showSnackbar && (
          <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{snackbarMessage}</span>
              <button
                onClick={() => setShowSnackbar(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => {
                setCurrentView('welcome');
                setFieldErrors({});
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPhone('');
                setLocation('');
                setAgreeToTerms(false);
              }}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>

            <div>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name *"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Email *"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
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
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password *"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
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
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              onClick={() => {
                setCurrentView('signin');
                setFieldErrors({});
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPhone('');
                setLocation('');
                setAgreeToTerms(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
        
        {/* Custom Snackbar */}
        {showSnackbar && (
          <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{snackbarMessage}</span>
              <button
                onClick={() => setShowSnackbar(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;