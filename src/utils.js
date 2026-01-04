// Loads the user from local storage and return the user object
// by parsing the json string
export const getUser = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    return user;
}

// checks if user is loggedin
export const isLoggedin = () => {
    const user = getUser();

    return user !== null;
}

// Format date to "2 Dec 2025 (Tuesday)" format
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return `${day} ${month} ${year} (${weekday})`;
}