import React, { useEffect, useState, useCallback, useRef } from 'react';
import Menu from './menu.jsx';
import Dispo from './dispo.jsx';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const MatchOfTheWeek = () => {
    // State management
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [activePage, setActivePage] = useState('home');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const carouselRef = useRef(null);

    const pageLabels = {
        home: 'Home',
        matches: 'Matches',
        profile: 'Profile',
        'my-tickets': 'My Tickets',
        dispo: 'Tickets Availability',
        faq: "FAQ's",
        calendar: 'Calendar',
    };

    // Effects
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    // API Functions
    const fetchMatches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE_URL}/matches/`);
            if (!res.ok) throw new Error('Failed to fetch matches');
            const data = await res.json();
            setMatches(data.results || data);
        } catch (err) {
            console.error('Error fetching matches:', err);
            setError(err.message);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    }, [token]);

    const handleLogin = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: loginEmail,
                    password: loginPassword,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.detail || 'Invalid credentials');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh || '');
            setToken(data.access);

            await fetchUserProfile();

            setShowLoginModal(false);
            setLoginEmail('');
            setLoginPassword('');
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Please try again.');
        }
    }, [loginEmail, loginPassword, token]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setCurrentUser(null);
    }, []);

    // Utility functions
    const formatDate = useCallback((iso) => {
        return iso ? new Date(iso).toLocaleDateString() : '';
    }, []);

    const formatTime = useCallback((time) => {
        return time ? time.slice(0, 5) : '';
    }, []);

    // Derived data
    const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
    const finishedMatches = matches.filter((m) => m.status === 'finished');
    const sortedUpcoming = [...upcomingMatches].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
    const homeMatch = sortedUpcoming[0] || matches[0] || null;

    const handleNextMatch = useCallback(() => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    }, [matches.length]);

    const handlePrevMatch = useCallback(() => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    }, [matches.length]);

    const scrollToCarousel = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleMatchSelect = useCallback((matchId) => {
        const index = matches.findIndex(m => m.id === matchId);
        if (index !== -1) {
            setCurrentMatchIndex(index);
        }
    }, [matches]);

    // Render Top Navigation
    const renderTopNav = () => (
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
                    <button
                        className={`nav-link ${activePage === 'faq' ? 'active' : ''}`}
                        onClick={() => setActivePage('faq')}
                    >
                        FAQ&apos;S
                    </button>
                    <button
                        className={`nav-link ${activePage === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActivePage('calendar')}
                    >
                        CALENDAR
                    </button>
                </nav>
            </div>
            <div className="top-center">
                <img src="/public/logo.svg" alt="Qatar Cup Logo" className="brand-logo" />
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
                        {currentUser.name || currentUser.username || currentUser.email}
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
    );

    // Render Home Page
    const renderHomePage = () => {
        if (loading && activePage === 'home') {
            return (
                <main className="hero-section">
                    <p>Loading matches...</p>
                </main>
            );
        }
        if (error && activePage === 'home') {
            return (
                <main className="hero-section">
                    <p style={{ color: 'red' }}>Error: {error}</p>
                </main>
            );
        }
        if (!homeMatch) {
            return (
                <main className="hero-section">
                    <p>No matches available at the moment.</p>
                </main>
            );
        }

        return (
            <main className="hero-section">
                <div className="hero-inner">
                    <section className="match-highlight">
                        <div className="hero-badge-row">
                            <span className="hero-badge">MATCH OF THE WEEK</span>
                            <span className={`status-pill status-${homeMatch.status}`}>
                                {homeMatch.status.toUpperCase()}
                            </span>
                        </div>
                        <h1 className="hero-title">
                            <span className="team-name">{homeMatch.team1_name}</span>{' '}
                            {homeMatch.flag1 || '🏳️'} <span className="vs-text">VS</span>{' '}
                            {homeMatch.flag2 || '🏳️'} <span className="team-name">{homeMatch.team2_name}</span>
                        </h1>
                        <div className="hero-meta-row">
                            <span className="meta-chip">
                                {formatDate(homeMatch.date)} • {formatTime(homeMatch.time)}
                            </span>
                            <span className="meta-chip">{homeMatch.stadium}</span>
                        </div>
                        <p className="match-description-home">
                            {homeMatch.description ||
                                `Don't miss this clash between ${homeMatch.team1_name} and ${homeMatch.team2_name}.`}
                        </p>
                        <div className="hero-cta-row">
                            <button className="btn-primary" onClick={() => setActivePage('matches')}>
                                BUY TICKETS
                            </button>
                            <button className="btn-secondary" onClick={() => setActivePage('matches')}>
                                SEE ALL MATCHES
                            </button>
                        </div>
                    </section>
                    <section className="hero-background">
                        <div className="abstract-line abstract-line-left" />
                        <div className="abstract-line abstract-line-right" />
                    </section>
                </div>
            </main>
        );
    };

    // Render Matches Carousel
    const renderMatchesCarousel = () => (
        <section id="matches-carousel" className="matches-carousel-section" ref={carouselRef}>
            <h2 className="carousel-heading">MATCHES AVAILABLE FOR SALE</h2>
            <div className="carousel-container">
                <button
                    className="carousel-nav-btn carousel-prev"
                    onClick={handlePrevMatch}
                    disabled={matches.length === 0}
                >
                    ◀
                </button>
                <div className="carousel-viewport">
                    <div className="carousel-track">
                        {matches.map((match, idx) => {
                            const isActive = idx === currentMatchIndex;
                            const scoreLine = match.status === 'finished'
                                ? `${match.score_team1 || 0} : ${match.score_team2 || 0}`
                                : 'vs';

                            return (
                                <div
                                    key={match.id}
                                    className={`carousel-card ${isActive ? 'active' : ''}`}
                                    style={{
                                        transform: `translateX(${(idx - currentMatchIndex) * 100}%) scale(${isActive ? 1 : 0.92})`,
                                        opacity: Math.abs(idx - currentMatchIndex) > 1 ? 0 : 1,
                                    }}
                                >
                                    <div className="match-card">
                                        <div className="match-card-header">
                                            <span className={`status-pill status-${match.status}`}>
                                                {match.status.toUpperCase()}
                                            </span>
                                            <span className="match-id">Match #{match.id}</span>
                                        </div>
                                        <div className="match-teams">
                                            <div className="team-block">
                                                <div className="team-flag">{match.flag1 || '🏳️'}</div>
                                                <span className="team-name-small">{match.team1_name}</span>
                                            </div>
                                            <div className="score-line">{scoreLine}</div>
                                            <div className="team-block">
                                                <div className="team-flag">{match.flag2 || '🏳️'}</div>
                                                <span className="team-name-small">{match.team2_name}</span>
                                            </div>
                                        </div>
                                        <div className="match-info">
                                            <p className="match-date">
                                                {formatDate(match.date)} • {formatTime(match.time)}
                                            </p>
                                            <p className="match-stadium">{match.stadium}</p>
                                        </div>
                                        <p className="match-description">
                                            {match.description || 'Official Arab Cup fixture. Limited seats available.'}
                                        </p>
                                        <div className="match-actions">
                                            <button
                                                className="btn-tickets"
                                                onClick={() => setActivePage('dispo')}
                                            >
                                                VIEW AVAILABLE TICKETS
                                            </button>
                                            <button className="btn-place">VIEW SEATING PLAN</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button
                    className="carousel-nav-btn carousel-next"
                    onClick={handleNextMatch}
                    disabled={matches.length === 0}
                >
                    ▶
                </button>
            </div>
            <div className="carousel-indicators">
                {matches.map((_, idx) => (
                    <button
                        key={idx}
                        className={`indicator ${idx === currentMatchIndex ? 'active' : ''}`}
                        onClick={() => setCurrentMatchIndex(idx)}
                        aria-label={`Go to match ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );

    const renderMatchesPage = () => (
        <main className="matches-main">
            <section className="matches-hero">
                <h1 className="matches-main-title">Matches & Tickets</h1>
                <p className="matches-subtitle">
                    Browse upcoming fixtures and secure your seat for the FIFA Arab Cup.
                </p>
                <div className="matches-filters-row">
                    <button className="matches-title-pill">
                        UPCOMING ({upcomingMatches.length})
                    </button>
                    <button className="matches-title-pill matches-pill-secondary">
                        FINISHED ({finishedMatches.length})
                    </button>
                    <span className="matches-calendar-link" onClick={scrollToCarousel}>
                        SEE THE FULL CALENDAR
                    </span>
                </div>
            </section>
            {renderMatchesCarousel()}
        </main>
    );

    const renderProfilePage = () => (
        <main className="profile-main">
            <section className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {(currentUser.name || currentUser.username || currentUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h2>{currentUser.name || currentUser.username || currentUser.email}</h2>
                        <p>{currentUser.city || 'City not specified'}</p>
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
    );

    const renderFAQPage = () => (
        <main className="faq-main">
            <div className="faq-inner">
                <h1 className="faq-title">Frequently Asked Questions</h1>
                <p className="faq-subtitle">
                    Answers about tickets, payments, and match-day information.
                </p>
                <div className="faq-list">
                    <div className="faq-item">
                        <div className="faq-question-row">
                            <span className="faq-question">Do I need an account to buy tickets?</span>
                            <span className="faq-badge">Tickets</span>
                        </div>
                        <p className="faq-answer">
                            Yes, create or log in to your account to buy and manage your tickets.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );

    const renderCalendarPage = () => (
        <main className="calendar-main">
            <div className="calendar-inner">
                <h1 className="calendar-title">Match Calendar</h1>
                <p className="calendar-subtitle">
                    All fixtures for the FIFA Arab Cup, shown in local time.
                </p>
                <div className="calendar-list">
                    {matches.map((match) => (
                        <div key={match.id} className="calendar-item">
                            <div className="calendar-date-block">
                                <span className="calendar-date-day">
                                    {new Date(match.date).getDate()}
                                </span>
                                <span className="calendar-date-month">
                                    {new Date(match.date).toLocaleString('default', { month: 'short' })}
                                </span>
                            </div>
                            <div className="calendar-info">
                                <div className="calendar-teams">
                                    <span className="calendar-team-name">{match.team1_name}</span>
                                    <span className="calendar-vs">vs</span>
                                    <span className="calendar-team-name">{match.team2_name}</span>
                                </div>
                                <div className="calendar-meta">
                                    <span>{formatTime(match.time) || 'TBD'}</span>
                                    <span>•</span>
                                    <span>{match.stadium}</span>
                                    <span>•</span>
                                    <span className={`calendar-status calendar-status-${match.status}`}>
                                        {match.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="calendar-cta"
                                onClick={() => {
                                    handleMatchSelect(match.id);
                                    setActivePage('dispo');
                                }}
                            >
                                VIEW TICKETS
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );

    const renderMyTicketsPage = () => (
        <main className="tickets-main">
            <h2>Your Tickets</h2>
            <p>
                No tickets purchased yet.{' '}
                <button onClick={() => setActivePage('matches')}>Browse matches</button>
            </p>
        </main>
    );

    const renderLoginModal = () => (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                <div className="modal-actions">
                    <button className="btn-login-submit" onClick={handleLogin}>
                        Login
                    </button>
                    <button className="btn-close-modal" onClick={() => setShowLoginModal(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPartnersFooter = () => (
        <section className="partners-strip">
            <div className="partners-inner">
                <div className="partners-top-row">
                    <span className="fifa-logo">
                        <img src="public/vector.svg" alt="Fifa Logo" />
                    </span>
                    <span className="partners-breadcrumb">
                        Home &gt; {pageLabels[activePage] || 'Home'}
                    </span>
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
                <br /> <br />
                <h4 className="partners-subtitle">FIFA ARAB CUP SUPPORTERS</h4>
                <div className="partners-logos-row">
                    <img src="public/Group 13.svg" alt="Supporter 1" />
                    <img src="public/Group 14.svg" alt="Supporter 2" />
                    <img src="public/Group 15.svg" alt="Supporter 3" />
                    <img src="public/Group 16.svg" alt="Supporter 4" />
                    <img src="public/Group 17.svg" alt="Supporter 5" />
                </div>
                <br />
            </div>
        </section>
    );

    return (
        <div className="page">
            <Menu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={(page) => {
                    setActivePage(page);
                    setIsMenuOpen(false);
                }}
            />

            <div className="page-frame">
                {renderTopNav()}

                {/* Page Content */}
                {activePage === 'home' && renderHomePage()}
                {activePage === 'matches' && renderMatchesPage()}
                {activePage === 'profile' && currentUser && renderProfilePage()}
                {activePage === 'dispo' && matches.length > 0 && (
                    <Dispo
                        match={matches[currentMatchIndex]}
                        setActivePage={setActivePage}
                        setIsMenuOpen={setIsMenuOpen}
                        currentUser={currentUser}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        setShowLoginModal={setShowLoginModal}
                        token={token}
                        apiBaseUrl={API_BASE_URL}
                    />
                )}
                {activePage === 'my-tickets' && currentUser && renderMyTicketsPage()}
                {activePage === 'faq' && renderFAQPage()}
                {activePage === 'calendar' && renderCalendarPage()}

                {renderPartnersFooter()}
            </div>

            {showLoginModal && renderLoginModal()}
        </div>
    );
};

export default MatchOfTheWeek;
