import React, { useEffect, useState } from 'react';
import Menu from './menu.jsx';
import './index.css';

const MatchOfTheWeek = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [activePage, setActivePage] = useState('home');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Dark mode effect
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    // Mock user data
    const mockUsers = {
        'user@example.com': {
            id: 1,
            name: 'NAME',
            city: 'Algiers',
            email: 'user@example.com',
            password: 'password123',
        },
    };

    // Login handler
    const handleLogin = () => {
        const user = mockUsers[loginEmail];
        if (user && user.password === loginPassword) {
            setCurrentUser(user);
            setShowLoginModal(false);
            setLoginEmail('');
            setLoginPassword('');
        } else {
            alert('Invalid email or password');
        }
    };

    // Logout handler
    const handleLogout = () => {
        setCurrentUser(null);
    };

    // Mock matches data
    const matches = [
        {
            id: 1,
            team1: 'Bahrain',
            team2: 'Sudan',
            flag1: '🇧🇭',
            flag2: '🇸🇩',
            date: 'MAR. 9 DÉCEMBRE 2025',
            time: '18H00',
            stadium: 'EDUCATION CITY STADIUM (AL RAYYAN)',
            description:
                'Le comité a réuni les équipes pour la sélection nationale qui s\'affronter à offrir l\'une de la troisième journée de la phase de groupe de la coupe arabe FIFA 2025.',
        },
        // Add more matches...
    ];

    const handleNextMatch = () => {
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    };

    const handlePrevMatch = () => {
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    return (
        <div className="page">

            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <div className="page-frame">
                <header className="top-nav">
                    <div className="top-left">
                        <button
                            className="menu-icon"
                            aria-label="Open menu"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <span className="menu-icon-lines">
                                <span className="menu-line" />
                                <span className="menu-line" />
                                <span className="menu-line" />
                            </span>
                            <span className="menu-icon-text">MENU</span>
                        </button>

                        <nav className="main-nav">
                            <button
                                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                                onClick={() => setActivePage('home')}
                            >
                                HOME
                            </button>
                            <button
                                className={`nav-link ${activePage === 'matches' ? 'active' : ''}`}
                                onClick={() => setActivePage('matches')}
                            >
                                MATCHES
                            </button>
                            <button className="nav-link">FAQ'S</button>
                            <button className="nav-link">CALENDAR</button>
                        </nav>
                    </div>

                    <div className="top-center">
                        <div className="brand-placeholder" />
                    </div>

                    <div className="top-right">
                        <button
                            className="theme-toggle"
                            onClick={() => setDarkMode((prev) => !prev)}
                            aria-label="Toggle dark mode"
                        >
                            <span className="theme-toggle-thumb">
                                {darkMode ? '☀' : '☾'}
                            </span>
                        </button>

                        {currentUser ? (
                            <button
                                className="btn-user"
                                onClick={() => setActivePage('profile')}
                            >
                                {currentUser.name}
                            </button>
                        ) : (
                            <button
                                className="btn-login"
                                onClick={() => setShowLoginModal(true)}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </header>

                {/* HOME PAGE */}
                {activePage === 'home' && (
                    <main className="hero-section">
                        <section className="match-highlight">
                            <h1 className="hero-title">
                                Match of the Week : <span className="team-name">fl_team01</span>{' '}
                                VS <span className="team-name">fl_team02</span>
                            </h1>

                            <div className="match-meta">
                                <span>DD-MM-YYYY</span>
                                <span>|</span>
                                <span>HH-MM</span>
                                <span>|</span>
                                <span>Emplacement</span>
                                <span>|</span>
                                <span>stat_match</span>
                            </div>
                        </section>

                        <section className="hero-background">
                            <div className="abstract-line abstract-line-left" />
                            <div className="abstract-line abstract-line-right" />

                            <button
                                className="btn-primary"
                                onClick={() => setActivePage('matches')}
                            >
                                BUY TICKET
                            </button>
                        </section>
                    </main>
                )}

                {/* MATCHES PAGE */}
                {activePage === 'matches' && (
                    <main className="matches-main">
                        <section className="matches-hero">
                            <button
                                className="matches-title-pill"
                                onClick={() => {
                                    const el = document.getElementById('matches-carousel');
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >

                                MATCHES AVAILABLE FOR SALE
                            </button>
                            <h6 className="matches-calendar-link">SEE THE CALENDAR</h6>
                        </section>

                        <section id="matches-carousel" className="matches-carousel-section">
                            <h2 className="carousel-heading">

                                MATCHES AVAILABLE FOR SALE
                            </h2>

                            <div className="carousel-container">
                                <button
                                    className="carousel-nav-btn carousel-prev"
                                    onClick={handlePrevMatch}
                                >
                                    ◀
                                </button>

                                <div className="carousel-viewport">
                                    <div className="carousel-track">
                                        {matches.map((match, idx) => (
                                            <div
                                                key={match.id}
                                                className={`carousel-card ${idx === currentMatchIndex ? 'active' : ''
                                                    }`}
                                                style={{
                                                    transform: `translateX(${(idx - currentMatchIndex) * 100
                                                        }%) scale(${idx === currentMatchIndex ? 1 : 0.9})`,
                                                    opacity:
                                                        Math.abs(idx - currentMatchIndex) > 1 ? 0 : 1,
                                                }}
                                            >
                                                <div className="match-card">
                                                    <div className="match-teams">
                                                        <div className="team-flag">{match.flag1}</div>
                                                        <span className="vs-text">VS</span>
                                                        <div className="team-flag">{match.flag2}</div>
                                                    </div>

                                                    <div className="team-names">
                                                        <span>{match.team1}</span>
                                                        <span>{match.team2}</span>
                                                    </div>

                                                    <div className="match-info">
                                                        <p className="match-date">
                                                            {match.date} - {match.time}
                                                        </p>
                                                        <p className="match-stadium">{match.stadium}</p>
                                                    </div>

                                                    <p className="match-description">
                                                        {match.description}
                                                    </p>

                                                    <div className="match-actions">
                                                        <button className="btn-tickets">
                                                            VOIR LES TICKETS DISPONIBLE
                                                        </button>
                                                        <button className="btn-place">TICKET PLACE</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="carousel-nav-btn carousel-next"
                                    onClick={handleNextMatch}
                                >
                                    ▶
                                </button>
                            </div>

                            <div className="carousel-indicators">
                                {matches.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`indicator ${idx === currentMatchIndex ? 'active' : ''
                                            }`}
                                        onClick={() => setCurrentMatchIndex(idx)}
                                    />
                                ))}
                            </div>
                        </section>
                    </main>
                )}

                {/* PROFILE PAGE */}
                {activePage === 'profile' && currentUser && (
                    <main className="profile-main">
                        <section className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {currentUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="profile-info">
                                    <h2>{currentUser.name}</h2>
                                    <p>{currentUser.city}</p>
                                </div>
                            </div>

                            <nav className="profile-nav">
                                <button
                                    className="profile-nav-btn"
                                    onClick={() => setActivePage('my-tickets')}
                                >
                                    MY TICKETS
                                </button>
                            </nav>

                            <button className="btn-logout" onClick={handleLogout}>
                                LOGOUT
                            </button>
                        </section>
                    </main>
                )}

                {/* MY TICKETS PAGE */}
                {activePage === 'my-tickets' && currentUser && (
                    <main className="tickets-main">
                        <h2>Your Tickets</h2>
                        <p>
                            No tickets purchased yet.{' '}
                            <button onClick={() => setActivePage('matches')}>
                                Browse matches
                            </button>
                        </p>
                    </main>
                )}

                {/* FOOTER / PARTNERS STRIP */}
                <section className="partners-strip">
                    <div className="partners-inner">
                        <div className="partners-top-row">
                            <span className="fifa-logo">
                                <img src="public/vector.svg" alt="Fifa Logo" />
                            </span>
                            <span className="partners-breadcrumb">Home &gt; Matches</span>
                            <span className="partners-tournament-logo">
                                <img src="public/logo.svg" alt="Qatar Cup Logo" />
                            </span>
                        </div>

                        <hr className="partners-divider" />

                        <h3 className="partners-title">FIFA ARAB CUP PARTNERS</h3>

                        <div className="partners-logos-row">
                            <img src="public/visit qatar.png" alt="Visit Qatar" />
                            <img src="public/qatar airways.png" alt="Qatar Airways" />
                            <img src="public/Group 11.svg" alt="Jetour" />
                            <img src="public/adidas.png" alt="Adidas" />
                        </div>
                        <br></br> <br></br>

                        <h4 className="partners-subtitle">FIFA ARAB CUP SUPPORTERS</h4>

                        <div className="partners-logos-row">
                            <img src="public/Group 13.svg" alt="Supporter 1" />
                            <img src="public/Group 14.svg" alt="Supporter 2" />
                            <img src="public/Group 15.svg" alt="Supporter 3" />
                            <img src="public/Group 16.svg" alt="Supporter 4" />
                            <img src="public/Group 17.svg" alt="Supporter 5" />
                        </div>
                        <br></br>
                    </div>
                </section>
            </div>

            {/* LOGIN MODAL */}
            {showLoginModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowLoginModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Login to Your Account</h2>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn-login-submit" onClick={handleLogin}>
                            Login
                        </button>

                        <button
                            className="btn-close-modal"
                            onClick={() => setShowLoginModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchOfTheWeek;
