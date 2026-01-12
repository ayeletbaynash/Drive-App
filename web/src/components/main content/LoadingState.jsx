import React from 'react';

const LoadingState = ({ message = "Loading files..." }) => {
    return (
        <div className="centered-content-wrapper">
            <div className="loader-wrapper">
                <div className="spinner"></div>
                <p className="loading-text">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;