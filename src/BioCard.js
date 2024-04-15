import React from 'react';
import './BioCard.css'; // Import CSS file for BioCard styles

const BioCard = () => {
  return (
    <div className="card bio-card">
      <div className="card-header">About Me</div>
      <div className="card-body">
        <p className="card-text">
          Hey there, I'm James Krause, and I'm all about capturing the essence of cars through photography. 
          With over a year of experience under my belt, I've honed my skills to showcase the beauty and personality of every vehicle I shoot.
        </p>
        <p className="card-text">
          My passion lies in automotive photography, where I dive deep into the world of cars to uncover their unique stories. 
          From sleek sports cars to rare exotics, I aim to capture the exhilarating spirit of each ride. 
          Join me on this thrilling journey as we explore the captivating world of automotive photography together.
        </p>
        <p>
          And don't forget to view my posts over on <a href="https://www.instagram.com/three.point.slow.t/" class="link-underline-primary">Instagram!</a>
        </p>
      </div>
    </div>
  );
};

export default BioCard;
