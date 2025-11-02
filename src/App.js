import React from 'react';
import ResourceFinder from './components/ResourceFinder';
import DonorRegistration from './components/DonorRegistration';
import UserDashboard from './components/UserDashboard';

function App() {
  // Get the current page from the URL or a data attribute
  const currentPage = document.body.getAttribute('data-page') || 'home';
  const currentUser = window.currentUser || null;

  const renderComponent = () => {
    switch (currentPage) {
      case 'resource':
        return <ResourceFinder user={currentUser} />;
      case 'donor':
        return <DonorRegistration user={currentUser} />;
      case 'dashboard':
        return <UserDashboard user={currentUser} />;
      default:
        return <div>Welcome to EMResource</div>;
    }
  };

  return (
    <div className="react-app">
      {renderComponent()}
    </div>
  );
}

export default App;