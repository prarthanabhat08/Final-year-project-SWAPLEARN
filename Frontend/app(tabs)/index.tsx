import React, { useState, useEffect } from 'react';
import Home from '../screens/Home';
import About from '../screens/About';
import Discover from '../screens/Discover';
import Match from '../screens/Match';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Profile from '../screens/Profile';
import Messages from '../screens/Messages';
import Requests from '../screens/Requests';

type UserType = {
  user_id: number;
  name: string;
};

export default function Index() {
  const [screen, setScreen] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.userSelect = "none";
      document.body.style.caretColor = "transparent";
    }
  }, []);

  const handleLoginSuccess = (userData: UserType) => {
    setIsLoggedIn(true);
    setUser(userData);
    setScreen('home');
  };

  if (screen === 'login') {
    return (
      <Login
        switchToRegister={() => setScreen('register')}
        onLoginSuccess={handleLoginSuccess}
        goBack={() => setScreen('discover')}
      />
    );
  }

  if (screen === 'register') {
    return (
      <Register
        switchToLogin={() => setScreen('login')}
        goBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'about') {
    return (
      <About
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToProfile={() => setScreen('profile')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  if (screen === 'discover') {
    return (
      <Discover
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToProfile={() => setScreen('profile')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  if (screen === 'match') {
    return (
      <Match
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToProfile={() => setScreen('profile')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }


  if (screen === 'profile') {
    return (
      <Profile
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToProfile={() => setScreen('profile')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  if (screen === 'messages') {
    return (
      <Messages
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToProfile={() => setScreen('profile')}
        goToMessages={() => setScreen('messages')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  if (screen === 'requests') {
    return (
      <Requests
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToProfile={() => setScreen('profile')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  return (
    <Home
      isLoggedIn={isLoggedIn}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToMessages={() => setScreen('messages')}
      goToProfile={() => setScreen('profile')}
      goToRequests={() => setScreen('requests')}
    />
  );
}
