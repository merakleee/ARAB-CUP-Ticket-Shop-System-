// src/menu.jsx
import React from 'react';
import './menu.css';
import { IoIosClose } from 'react-icons/io';

const Menu = ({ isOpen, onClose }) => {
    if (!isOpen) return null;        // controlled by parent

    const menuItems = ['HOME', 'MATCHES', 'PROFILE', "FAQ'S", 'TICKETS', 'CALENDAR'];

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

                <div className="menuColumn homeColumn">
                    <a href="#" className="menuLink">HOME</a>
                    <div className="homeSubLinks">
                        <a href="#">MATCH OF THE WEEK</a> <br />
                        <a href="#">ABOUT US</a> <br />
                        <a href="#">STADES</a> <br />
                        <a href="#">OFFRES</a>
                    </div>
                </div>

                {menuItems.slice(1).map((item) => (
                    <div key={item} className="menuColumn">
                        <a href="#" className="menuLink">{item}</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
