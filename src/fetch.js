import axios from "axios";

axios.defaults.baseURL = `https://${import.meta.env.VITE_MOCKAPI_KEY}.mockapi.io`;

export async function fetchContacts() {
    try {
        const { data } = await axios.get('/users');
        return data;
    } catch (e) {
        console.error('Error fetching data:', e);
    }
}

export async function updateUser(id, { name, phoneNumber, description, profileImg }) {
    try {
        const { data } = await axios.put(`/users/${id}`, { name, phoneNumber, description, profileImg });
        return data;
    } catch (e) {
        console.error('Failed to update user:', e.message);
    }
}

export async function deleteUser(id) {
    try {
        await axios.delete(`/users/${id}`);
        console.log('User deleted successfully!');
    } catch (e) {
        console.error('Failed to delete user:', e.message);
    }
}

export async function fetchAddContact(contact) {
  try {
    const { data } = await axios.post('/users', contact);
    return data;
  } catch (e) {
    console.error('Failed to add contact:', e.message);
  }
}