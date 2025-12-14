import React from 'react';
import './menu.css';
import { IoIosClose } from 'react-icons/io';

const Menu = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;

    const handleClick = (page) => {
        if (onNavigate) onNavigate(page);
    };

    return (
        <div className="megaMenuOverlay" onClick={onClose}>
            <div className="megaMenuContent" onClick={(e) => e.stopPropagation()}>
                <div className="closeColumn">
                    <button className="closeBtn" onClick={onClose}>
                        <IoIosClose /> CLOSE
                    </button>

                    <div className="logoAndSocials">
                        <div className="fifaLogo" />
                        <div className="socialIcons" />
                    </div>
                </div>

                {/* HOME column with sub‑links */}
                <div className="menuColumn homeColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('home')}
                    >
                        HOME
                    </button>
                    <div className="homeSubLinks">
                        <button onClick={() => handleClick('home')}>MATCH OF THE WEEK</button>
                        <br />
                        <button onClick={() => handleClick('home')}>ABOUT US</button>
                        <br />
                        <button onClick={() => handleClick('calendar')}>STADES</button>
                        <br />
                        <button onClick={() => handleClick('matches')}>OFFRES</button>
                    </div>
                </div>

                {/* Other top‑level items */}
                <div className="menuColumn matchesColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('matches')}
                    >
                        MATCHES
                    </button>
                </div>

                <div className="menuColumn profileColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('profile')}
                    >
                        PROFILE
                    </button>
                </div>

                <div className="menuColumn faqColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('faq')}
                    >
                        FAQ&apos;S
                    </button>
                </div>

                <div className="menuColumn ticketsColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('my-tickets')}
                    >
                        TICKETS
                    </button>
                </div>

                <div className="menuColumn calendarColumn">
                    <button
                        className="menuLink"
                        onClick={() => handleClick('calendar')}
                    >
                        CALENDAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Menu;