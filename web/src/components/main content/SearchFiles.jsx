import React from 'react';
import FileViewList from '../files/FileViewList';

const SearchFiles = ({results, onRefresh}) =>{
    return(
        <div>
            <h3>Search Results</h3>
            {results.length === 0 ? (
                <p>No files found matching your search.</p>
            ) : (
                // שימוש ברכיב הקיים שלך להצגת הקבצים
                <FileViewList items={results} onRefresh={onRefresh} />
            )}
        </div>
    );
};


export default SearchFiles;