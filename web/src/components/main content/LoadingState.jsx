import React from 'react';

/**
 * LoadingState component provides a standardized, centered loading screen.
 * It uses a spinning animation and a customizable message to inform users of data progress.
 */
const LoadingState = ({ message = "Loading files..." }) => {
    return (
        /* The 'centered-content-wrapper' aligns the loader perfectly in the center of the available white space */
        <div className="centered-content-wrapper">
            <div className="loader-wrapper">
                <div className="spinner"></div>
                <p className="loading-text">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;