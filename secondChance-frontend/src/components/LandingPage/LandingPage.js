import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const bgStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/background-colors.jpg)`,
  };

  return (
    <div className="landing-body" style={bgStyle}>
      <div className="landing-content content">
        <h1 className="display-4 mb-3">Second Chance</h1>
        <h2 className="mb-4">Where memories find new homes.!</h2>
        <p className="lead">
          "Sharing is the essence of community. It is through giving that we enrich
          and perpetuate both our lives and the lives of others."
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/app')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
