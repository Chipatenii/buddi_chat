const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!realName || !username || !email || !password || !profilePicture) {
        setError('All fields are required');
        return; // Stop the submission if validation fails
    }

    const formData = new FormData();
    formData.append('realName', realName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profilePicture', profilePicture);

    try {
        setLoading(true); // Show loading
        const response = await api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 201) {
            alert('Registration successful! You can now log in.');
            navigate('/login'); // Redirect to login
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Something went wrong';
        setError(errorMessage);  // Update error message
    } finally {
        setLoading(false); // Hide loading
    }
};
