import React from 'react';
import { useNavigate } from 'react-router-dom';

function AppLogo() {
    const navigate = useNavigate();

    const handleClick = () => {
        // מנווט חזרה לנתיב הראשי
        navigate('/home');
        
        // אופציונלי: אם את רוצה שזה גם ירענן את הנתונים (ינקה חיפוש וכו')
        // אפשר להוסיף לוגיקה כאן, אבל הניווט עצמו בדרך כלל מספיק
    };

    return (
        <div 
            onClick={handleClick} 
            style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                userSelect: 'none',
                padding: '5px' 
            }}
        >
            {/* הרחבתי קצת את ה-viewBox כדי שיהיה מקום למילה הארוכה יותר */}
            <svg width="190" height="40" viewBox="0 0 190 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* צורת הענן/תיקייה */}
                <path d="M35 10C35 4.477 30.523 0 25 0C20.28 0 16.33 3.25 15.3 7.64C14.28 7.23 13.17 7 12 7C5.373 7 0 12.373 0 19C0 25.627 5.373 31 12 31H35C40.523 31 45 26.523 45 21C45 15.477 40.523 10 35 10Z" fill="#277d3fff"/>
                
                {/* חץ העלאה */}
                <path d="M22.5 22V14M22.5 14L19 17.5M22.5 14L26 17.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* הטקסט: AweSoMe drive */}
                <text x="52" y="23" fontFamily="Arial, sans-serif" fontSize="18" fill="var(--text-main)">
                    {/* האותיות של AMS מודגשות וגדולות */}
                    <tspan fontWeight="bold">A</tspan>
                    <tspan fontWeight="normal">we</tspan>
                    <tspan fontWeight="bold">S</tspan>
                    <tspan fontWeight="normal">o</tspan>
                    <tspan fontWeight="bold">M</tspan>
                    <tspan fontWeight="normal">e</tspan>
                    
                    {/* המילה drive בצבע אפור יותר */}
                    <tspan fontWeight="normal" fill="var(--text-muted)"> drive</tspan>
                </text>
            </svg>
        </div>
    );
}

export default AppLogo;