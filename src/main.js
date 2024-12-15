
import { fetchContacts, updateUser, deleteUser, fetchAddContact } from './fetch.js';
import Notiflix from 'notiflix';


const contactsList = document.querySelector('.contacts-list');
const form = document.querySelector('.form');
const nameInput = document.querySelector('#name');
const phoneInput = document.querySelector('#phone-number');
const descriptionInput = document.querySelector('#description');
const photoInput = document.querySelector('#photo');

const showEl = (el) => (el.style.display = 'block');
const hideEl = (el) => (el.style.display = 'none');
const addClassToEl = (el, className) => el.classList.add(className);
const removeClassFromEl = (el, className) => el.classList.remove(className);


const renderContacts = (contacts) => {
  const contactsMarkup = contacts
    .map(({ name, phoneNumber, description, profileImg, id }) => {
      return `
        <li class="photo-card">
            <img src="${profileImg}" alt="Profile image of ${name}"/>
            <div class="info">
                <p class="info-item"><b>Name:</b> ${name}</p>
                <p class="info-item"><b>Phone number:</b> ${phoneNumber}</p>
                <p class="info-item"><b>Description:</b> ${description}</p>
                <p class="info-item"><b>Id:</b> ${id}</p>
            </div>

            <div class="buttons">

              <button class="edit-btn" data-id="${id}">
              <i class="fas fa-edit"></i> 
              </button>

              <button class="delete-btn" data-id="${id}">
              <i class="fas fa-trash"></i> 
              </button>  

        </div>
        </li>
      `;
    })
    .join('');

  contactsList.innerHTML = contactsMarkup;
};

const getContactsInfo = async () => {
  try {
    const data = await fetchContacts(); 
    renderContacts(data);
  } catch (error) {
    console.log(error);
  }
};


contactsList.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON') {
        const button = e.target;
        const id = button.dataset.id;

        if (button.classList.contains('edit-btn')) {
            editContact(id)
        } else {
            deleteContact(id)
        }
    }
})

// async function editContact(id) {
//   const contactName = prompt('Enter new name');
//   if (!contactName) return;

//   try {
//     await updateUser(id, { name: contactName }); 
//     Notiflix.Notify.success('User updated successfully!');
//     await getContactsInfo(); 
//   } catch (error) {
//     Notiflix.Notify.failure('Failed to update user.');
//     console.error(error);
//   }
// }

async function editContact(id) {
  Notiflix.Confirm.prompt(
    'New Name', 
    'Please enter your new name:', 
    '', 
    'Submit',
    'Cancel', 
    async (newName) => { 
      if (newName) {
        try {
          await updateUser(id, { name: newName }); 
          Notiflix.Notify.success('User updated successfully!');
          await getContactsInfo(); 
        } catch (error) {
          Notiflix.Notify.failure('Failed to update user.');
          console.error(error);
        }
      }
    },
    () => { 
      Notiflix.Notify.info('Name change was canceled.');
    }
  );
}

async function deleteContact(id) {
  Notiflix.Confirm.show(
    'Delete User', 
    'Are you sure you want to delete this user?', 
    'Yes', 
    'No', 
    async () => { 
      try {
        await deleteUser(id); 
        Notiflix.Notify.success('User deleted successfully!');
        await getContactsInfo(); 
      } catch (error) {
        Notiflix.Notify.failure('Failed to delete user.');
        console.error(error);
      }
    },
    () => { 
      Notiflix.Notify.info('User deletion was canceled.');
    }
  );
}


// async function deleteContact(id) {
//   if (!confirm('Are you sure you want to delete this user?')) return;

//   try {
//     await deleteUser(id);
//     Notiflix.Notify.success('User deleted successfully!');
//     await getContactsInfo(); 
//   } catch (error) {
//     Notiflix.Notify.failure('Failed to delete user.');
//     console.error(error);
//   }
// }


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const description = descriptionInput.value.trim();
  const photo = photoInput.files[0];

  const isNameValid = validateName(name);
  const isPhoneValid = validatePhone(phone);
  const isDescriptionValid = validateDescription(description);

  const isValid = isNameValid && isPhoneValid && isDescriptionValid;

  if (!isValid) {
    Notiflix.Notify.failure('Please fix the errors in the form!');
    return;
  }

  addContact({
    name,
    phoneNumber: phone,
    description,
    profileImg: photo ? URL.createObjectURL(photo) : '',
  });

  form.reset(); 
});

function validateName(name) {
  const nameError = nameInput.nextElementSibling;
  if (!name) {
    addClassToEl(nameInput, 'error');
    showEl(nameError);
    return false;
  } else {
    removeClassFromEl(nameInput, 'error');
    hideEl(nameError);
    return true;
  }
}

function validatePhone(phone) {
  const phoneError = phoneInput.nextElementSibling;
  const phonePattern = /^\+?[1-9]\d{0,2}[-\s]?(\(?\d{1,4}\)?[-\s]?)*\d{3}[-\s]?\d{3,4}$/;
  if (!phonePattern.test(phone)) {
    addClassToEl(phoneInput, 'error');
    showEl(phoneError);
    return false;
  } else {
    removeClassFromEl(phoneInput, 'error');
    hideEl(phoneError);
    return true;
  }
}

function validateDescription(description) {
  const descriptionError = descriptionInput.nextElementSibling;
  if (!description) {
    addClassToEl(descriptionInput, 'error');
    showEl(descriptionError);
    return false;
  } else {
    removeClassFromEl(descriptionInput, 'error');
    hideEl(descriptionError);
    return true;
  }
}

async function addContact(contact) {
  try {
    await fetchAddContact(contact); 
    Notiflix.Notify.success('Contact added successfully!');
    await getContactsInfo(); 
  } catch (error) {
    Notiflix.Notify.failure('Failed to add contact.');
    console.error(error);
  }
}

getContactsInfo()


// form.addEventListener('submit', (e) => {

//   e.preventDefault();

//   const name = nameInput.value.trim();
//   const phone = phoneInput.value.trim();
//   const description = descriptionInput.value.trim();
//   const photo = photoInput.files[0]; // Исправлено на получение файла

//   let isValid = true;

//   // Проверка имени
//   const nameError = nameInput.closest('.form-group').querySelector('.error-message');
//   if (!name) {
//     addClassToEl(nameInput, 'error');
//     showEl(nameError);
//     //Notiflix.Notify.failure('Name field cannot be empty!');
//     isValid = false;
//   } else {
//     removeClassFromEl(nameInput, 'error');
//     hideEl(nameError);
//   }

//   // Проверка номера телефона
//   const phoneError = phoneInput.closest('.form-group').querySelector('.error-message');
//   const phonePattern = /^\+?[1-9]\d{0,2}[-\s]?(\(?\d{1,4}\)?[-\s]?)*\d{3}[-\s]?\d{3,4}$/;
//   if (!phonePattern.test(phone)) {
//     addClassToEl(phoneInput, 'error');
//     showEl(phoneError);
//     isValid = false;
//   } else {
//     removeClassFromEl(phoneInput, 'error');
//     hideEl(phoneError);
//   }

//   // Проверка описания
//   const descriptionError = descriptionInput.closest('.form-group').querySelector('.error-message');
//   if (!description) {
//     addClassToEl(descriptionInput, 'error');
//     showEl(descriptionError);
//     isValid = false;
//   } else {
//     removeClassFromEl(descriptionInput, 'error');
//     hideEl(descriptionError);
//   }

// if (!isValid) {
//   Notiflix.Notify.failure('Please fix the errors in the form!');
//   return;
// }

// // Если форма валидна
// addContact({
//   name,
//   phoneNumber: phone,
//   description,
//   profileImg: photo ? URL.createObjectURL(photo) : '',
// });

// form.reset(); // Очистка формы
// });