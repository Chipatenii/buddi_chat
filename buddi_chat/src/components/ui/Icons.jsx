import PropTypes from 'prop-types';

export const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

export const IconClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export const IconAlert = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);


