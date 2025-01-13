import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

     const ThemeContext = createContext();

     export const ThemeProvider = ({ children }) => { // Correctly exported
       const [theme, setTheme] = useState('light');

       const toggleTheme = () => {
         setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
       };
  
       ThemeProvider.propTypes = {
         children: PropTypes.node.isRequired,
       };
       return (
         <ThemeContext.Provider value={{ theme, toggleTheme }}>
           {children}
         </ThemeContext.Provider>
       );
     };

     ThemeProvider.propTypes = {
       children: PropTypes.node.isRequired,
     };