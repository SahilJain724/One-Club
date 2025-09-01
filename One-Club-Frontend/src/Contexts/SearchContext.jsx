// SearchContext.js
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const searchContext = createContext();

export const SearchProvider = (props) => {
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <searchContext.Provider value={{ isSearchVisible, setIsSearchVisible, searchText, setSearchText, navigate }}>
      {props.children}
    </searchContext.Provider>
  );
};