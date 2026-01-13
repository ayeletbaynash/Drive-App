import React, { useEffect, useRef } from 'react';

// * A wrapper component that detects clicks outside its boundaries to trigger a close action.
const FloatingMenu = ({ onClose, children }) => {
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={menuRef} >
            {children}
        </div>
    );
};

export default FloatingMenu;