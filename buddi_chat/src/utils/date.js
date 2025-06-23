export const formatDateTime = (isoString, format = 'full') => {
    const date = new Date(isoString);
    const options = {
      date: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit'
      },
      full: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    }[format];
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
