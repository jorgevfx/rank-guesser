import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://rank-guesser-api-b771eaee3676.herokuapp.com/api/v1',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default apiClient;