import React from 'react';

const NavigationButtons = ({ prevPage, nextPage, currentPage }) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <button className="btn btn-danger me-2" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
      <button className="btn btn-danger" onClick={nextPage}>Next</button>
    </div>
  );
};

export default NavigationButtons;
