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
import ChatScreen from '../screens/ChatScreen';
import Availability from '../screens/Availability';

type UserType = {
  user_id: number;
  name: string;
  username?: string;
};

export default function Index() {
  const [screen, setScreen] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [previousScreen, setPreviousScreen] = useState<string>('home');


  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");

  console.log("CURRENT SCREEN:", screen);
  console.log("USER IN INDEX:", user);
  
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.userSelect = "none";
      document.body.style.caretColor = "transparent";
    }
  }, []);

  const handleLoginSuccess = (userData: UserType) => {
    console.log("✅ LOGIN SUCCESS:", userData);

    setUser(userData);
    setIsLoggedIn(true);

    setTimeout(() => {
      setScreen('home');
    }, 100); // small delay ensures state update
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setScreen('login');
  };


  const goTo = (next: string) => {
    setPreviousScreen(screen);
    setScreen(next);
  };

  const openChat = (roomId: string, name: string) => {
    console.log("OPEN CHAT CLICKED:", roomId);

    if (!roomId) {
      console.log(" ROOM ID MISSING");
      return;
    }

    setSelectedRoom(roomId);
    setSelectedName(name);
    setScreen('chat');
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
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToLogin={() => goTo('login')}
        goToRegister={() => goTo('register')}
        goToProfile={() => goTo('profile')}
        goToRequests={() => goTo('requests')}
        goToMessages={() => goTo("messages")}
      />
    );
  }

  if (screen === 'discover') {
    return (
      <Discover
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToLogin={() => goTo('login')}
        goToRegister={() => goTo('register')}
        goToProfile={() => goTo('profile')}
        goToRequests={() => goTo('requests')}
        goToMessages={() => goTo("messages")}
      />
    );
  }

  if (screen === 'match') {
    return (
      <Match
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToLogin={() => goTo('login')}
        goToRegister={() => goTo('register')}
        goToProfile={() => goTo('profile')}
        goToRequests={() => goTo('requests')}
        goToMessages={() => goTo("messages")}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <Profile
        user={user}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        previousScreen={previousScreen}
        setScreen={setScreen}
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToProfile={() => goTo('profile')}
        goToRequests={() => goTo('requests')}
        goToMessages={() => goTo("messages")}
      />
    );
  }

  if (screen === 'messages') {
    if (!user) {
      console.log(" BLOCKED: user is null");
      return (
        <Login
          switchToRegister={() => setScreen('register')}
          onLoginSuccess={handleLoginSuccess}
          goBack={() => setScreen('home')}
        />
      );
    }

    return (
      <Messages
        user={user}
        isLoggedIn={isLoggedIn}
        openChat={openChat}
        screen={screen}
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToProfile={() => goTo('profile')}
        goToMessages={() => goTo('messages')}
        goToLogin={() => goTo('login')}
        goToRegister={() => goTo('register')}
        goToRequests={() => goTo('requests')}
      />
    );
  }
  

  if (screen === 'availability') {
    return (
      <Availability
        user={user}
        goBack={() => setScreen('profile')}
      />
    );
  }

  if (screen === 'chat') {
    return (
      <ChatScreen
        roomId={selectedRoom}
        user={user}
        name={selectedName}
        goBack={() => setScreen('messages')}
      />
    );
  }

  if (screen === 'requests') {
    return (
      <Requests
        user={user}
        isLoggedIn={isLoggedIn}
        previousScreen={previousScreen}
        setScreen={setScreen}
        goToHome={() => goTo('home')}
        goToAbout={() => goTo('about')}
        goToDiscover={() => goTo('discover')}
        goToMatch={() => goTo('match')}
        goToProfile={() => goTo('profile')}
        goToRequests={() => goTo('requests')}
        goToMessages={() => goTo("messages")}
      />
    );
  }

  return (
    <Home
      isLoggedIn={isLoggedIn}
      goToLogin={() => goTo('login')}
      goToRegister={() => goTo('register')}
      goToHome={() => goTo('home')}
      goToAbout={() => goTo('about')}
      goToDiscover={() => goTo('discover')}
      goToMatch={() => goTo('match')}
      goToMessages={() => goTo('messages')}
      goToProfile={() => goTo('profile')}
      goToRequests={() => goTo('requests')}
    />
  );
}
