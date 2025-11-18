"use client"
import { Button } from '@/components/ui/button';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';



// const Button = ({ children, className, disabled, style, ...props }) => {
//   // Apply base styling and merge with custom props
//   const baseClasses = `w-40 py-2 border text-white text-lg rounded-full transition duration-300 shadow-xl ${className || ''}`;
  
//   return (
//     <button
//       className={baseClasses}
//       disabled={disabled}
//       style={style}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };




const MemberLogin = () => {
  // 1. State for form data and submission status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: 'hidden', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 2. Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    setIsLoading(true);
    setStatusMessage({ type: 'loading', text: 'Logging in...' });

    // Simulate an API call delay
    setTimeout(() => {
      // In a real application, you would send { email, password } to your backend here.
      console.log('Attempting login with:', { email, password });

      // Example: Simple validation/mock success
      if (email === 'user@example.com' && password === 'password') {
        setStatusMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      } else {
        setStatusMessage({ type: 'error', text: 'Invalid email or password.' });
      }

      setIsLoading(false);
    }, 1500);
  };

 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-8">
        
        {/* Title */}
        <h1 className="md:text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-8">
          Member Login
        </h1>
        
        {/* Login Form - Attached handleSubmit */}
        <form className="space-y-12" onSubmit={handleSubmit}>
          
          {/* Email Input - Now using the Input component */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* Password Input - Now using the Input component */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Login Button - Now using the Button component */}
          <div className="pt-1 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading 
                  ? 'border-gray-600 bg-gray-900 cursor-not-allowed' 
                  : 'border-white hover:bg-white hover:text-black'
              }`}
            >
              {isLoading ? 'Processing...' : 'Login'}
            </Button>
          </div>

        </form>

        {/* Forgot Password Link */}
        <div className="text-center pt-2">
          <a
            href="#"
            className="text-sm text-white/70 hover:text-white transition duration-300"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;