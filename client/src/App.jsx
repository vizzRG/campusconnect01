// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Questions from './pages/Questions';
import QuestionPage from './pages/QuestionPage';
import AskQuestionPage from './pages/AskQuestionPage';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Tags from './pages/Tags';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/questions/:id" element={<QuestionPage />} />
                <Route path="/ask" element={<AskQuestionPage />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: 'dark:bg-dark-800 dark:text-white',
                style: {
                  background: '#1e293b',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;