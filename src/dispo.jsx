import React from 'react';
import './dispo.css'; // Assuming you'll put the styles in a CSS file

// --- Constants ---
// The provided image link to be used for all stadium visuals
const STADIUM_IMAGE_URL = 'https://res.cloudinary.com/drftumteo/image/upload/v1765549406/Frame_128_h3qbll.png';

// --- Data Structure ---
const ticketData = [
  {
    category: 'CATEGORIE 01',
    description: 'COUPE ARABE - PHASE DE GROUPES - JOURNÉE 3 SUR 3 - GROUPE D',
    stadium: 'LUSAIL STADIUM',
    priceDA: 65000,
    actionType: 'available',
  },
  {
    category: 'CATEGORIE 02',
    description: 'COUPE ARABE - PHASE DE GROUPES - JOURNÉE 3 SUR 3 - GROUPE D',
    stadium: 'LUSAIL STADIUM',
    priceDA: 62000,
    actionType: 'available',
  },
  {
    category: 'CATEGORIE 03',
    description: 'COUPE ARABE - PHASE DE GROUPES - JOURNÉE 3 SUR 3 - GROUPE D',
    stadium: 'LUSAIL STADIUM',
    priceDA: 50000,
    actionType: 'available',
  },
  {
    category: 'VVIP',
    description: 'COUPE ARABE - PHASE DE GROUPES - JOURNÉE 3 SUR 3 - GROUPE D',
    stadium: 'LUSAIL STADIUM',
    priceDA: 187500,
    actionType: 'eligibility',
  },
  {
    category: 'VIP',
    description: 'COUPE ARABE - PHASE DE GROUPES - JOURNÉE 3 SUR 3 - GROUPE D',
    stadium: 'LUSAIL STADIUM',
    priceDA: 110000,
    actionType: 'eligibility',
  },
];

// Helper function to format the price
const formatPrice = (price) => {
  return price.toLocaleString('fr-DZ') + 'DA'; // Formats as 123 456DA
};

// --- Sub-Component for a Single Card Item ---
const TicketCategoryCard = ({ category, description, stadium, priceDA, actionType }) => {
  // Determine button text based on actionType
  const actionButtonText =
    actionType === 'available'
      ? 'VOIR LES TICKETS DISPONIBLE'
      : 'VERIFIER ELIGIBILITE';

  // Placeholder function for button clicks
  const handleActionClick = () => {
    console.log(`Action clicked for ${category}: ${actionButtonText}`);
  };

  const handleDetailsClick = () => {
    console.log(`Details clicked for ${category}`);
  };

  return (
    <div className="ticket-card-item">
      {/* The image/stadium visual */}
      <div className="stadium-visual">
        <img src={STADIUM_IMAGE_URL} alt={`${category} - ${stadium}`} className="stadium-image"/>
      </div>

      <div className="card-content">
        <div className="text-info">
          <h2 className="category-title">{category}</h2>
          <p className="description">{description}</p>
          <p className="stadium-name">{stadium}</p>
        </div>

        <div className="action-section">
          {/* Price */}
          <div className="price-container">
            <span className="price-label">from</span>
            <span className="price-value">{formatPrice(priceDA)}</span>
          </div>

          {/* Action Buttons: CORRECTED to use 'action-button' */}
          <div className="button-group">
            <button
              className={`action-button ${actionType}`}
              onClick={handleActionClick}
            >
              {actionButtonText}
            </button>
            <button
              className="details-button"
              onClick={handleDetailsClick}
            >
              PLUS DE DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const TicketCategoryList = () => {
  return (
    <div className="ticket-category-list">
      {ticketData.map((data, index) => (
        <TicketCategoryCard
          key={index}
          category={data.category}
          description={data.description}
          stadium={data.stadium}
          priceDA={data.priceDA}
          actionType={data.actionType}
        />
      ))}
    </div>
  );
};

export default TicketCategoryList;