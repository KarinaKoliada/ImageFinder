import axios from 'axios';

axios.defaults.baseURL = 'https://67441668b4e2e04abea0b5f4.mockapi.io';


async function fetchUsers() {
    try {
        const { data } = await axios.get('/users')
        
        console.log(data);
    } catch (e) {
        console.log(e);
    }
}

fetchUsers()