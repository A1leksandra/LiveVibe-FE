export const isUserAdmin = (): boolean => {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
}; 