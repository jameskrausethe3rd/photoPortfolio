export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    // Format the date without the suffix
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    // Add the suffix (e.g. 'st', 'nd', 'rd', 'th')
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || (day >= 11 && day <= 13)) ? 0 : day % 10];
    
    // Return the formatted date with the suffix
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  };