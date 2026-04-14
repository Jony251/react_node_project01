import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyRoutes from './components/MyRoutes/MyRoutes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        <AuthProvider>
          <BrowserRouter>
            <MyRoutes />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
