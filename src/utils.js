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