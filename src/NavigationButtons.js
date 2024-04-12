import React from 'react';
import './NavigationButtons.css';

const NavigationButtons = ({ loadMore, currentPage }) => {
  return (
    <div className="navigation-buttons-container"> {/* Add a parent container */}
      <button onClick={loadMore} className="btn btn-primary">
        Load More
      </button>
    </div>
  );
};

export default NavigationButtons;
