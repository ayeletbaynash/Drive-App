import React from 'react';
import { useNavigate } from 'react-router-dom';

// Displays the application brand
function AppLogo() {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate back to the main home route
        navigate('/home');
    };

    return (
        <div 
            onClick={handleClick} 
            className="logo-container"
            style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                height: '100%',  
                userSelect: 'none'
            }}
        >
            {/* SVG Logo: ViewBox expanded to accommodate brand text */}
            <svg width="190" height="40" viewBox="0 0 190 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Brand Icon: Cloud/Folder shape representation */}
                <path d="M35 10C35 4.477 30.523 0 25 0C20.28 0 16.33 3.25 15.3 7.64C14.28 7.23 13.17 7 12 7C5.373 7 0 12.373 0 19C0 25.627 5.373 31 12 31H35C40.523 31 45 26.523 45 21C45 15.477 40.523 10 35 10Z" fill="#277d3fff"/>
                
                {/* Functional Symbol: Centered upload arrow */}
                <path d="M22.5 22V14M22.5 14L19 17.5M22.5 14L26 17.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Brand Text: Styled as "AweSoMe drive" using CSS variables for theme support */}
                <text x="52" y="26" fontFamily="Arial, sans-serif" fontSize="18" fill="var(--text-main)">
                    {/* Emphasized letters (A, S, M) for visual branding */}
                    <tspan fontWeight="bold">A</tspan>
                    <tspan fontWeight="normal">we</tspan>
                    <tspan fontWeight="bold">S</tspan>
                    <tspan fontWeight="normal">o</tspan>
                    <tspan fontWeight="bold">M</tspan>
                    <tspan fontWeight="normal">e</tspan>
                    
                    {/* Secondary text styled with muted color */}
                    <tspan fontWeight="normal" fill="var(--text-muted)"> drive</tspan>
                </text>
            </svg>
        </div>
    );
}

export default AppLogo;