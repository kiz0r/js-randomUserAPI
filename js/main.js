'use strict';

// - Випадкові користувачі https://randomuser.me/api
// (дока по апі https://randomuser.me/documentation)
// *Наприклад,
// --- вивести дані списком; //* => done
// --- налаштувати гортання по сторінках (приклад https://github.com/pecoursesй/pe2021-2-promise/blob/main/js/index.js); //* => done
// --- додати кнопку <<, тобто перехід першу сторінку; //* => done
// --- додати інформацію про користувача (вік, імейл, ...); //*  => done
// --- колір рамки (фону) карткам генерувати залежно від статі користувача; //* => done
// --- ** зробити можливим вибирати кілька карток, перелік повних імен обраних користувачів приводити в рядок зверху. Вибрані картки підсвічувати; //* => done
// --- застилити картки. //* => done

const properties = {
  results: 5,
  page: 1,
  seed: 'students',
};

const selectedUsersField = document.querySelector('.selectedUsersField');
const [firstPageBtn, prevBtn, nextBtn] = document.querySelectorAll('.btn');

// event listeners and functions of handlers for buttons
firstPageBtn.addEventListener('click', firstPageBtnHandler);
prevBtn.addEventListener('click', prevBtnHandler);
nextBtn.addEventListener('click', nextBtnHandler);

function firstPageBtnHandler() {
  properties.page = 1;
  getUsers(properties);
}

function prevBtnHandler() {
  if (properties.page > 1) {
    properties.page -= 1;
    getUsers(properties);
  }
}

function nextBtnHandler() {
  properties.page += 1;
  getUsers(properties);
}

// gets info about users using fetch
function getUsers() {
  fetch(
    `https://randomuser.me/api/?results=${properties.results}&page=${properties.page}&seed=${properties.seed}&`
  )
    .then((response) => response.json())
    .then(({ results }) => {
      renderUsers(results);
    })
    .catch((e) => {
      console.log(e);
    });
}

function renderUsers(users) {
  const usersList = document.querySelector('.usersList');

  const usersListItems = users.map((u) => createUserItem(users, u));

  usersList.replaceChildren(...usersListItems);
}

function createUserItem(
  user,
  {
    name: { first: firstName, last: lastName },
    picture: { large: src },
    email: userEmail,
    dob: { age: userAge },
    gender: userGender,
    location: { country: userCountry, state: userState, city: userCity },
    login: { uuid: userId },
  }
) {
  const userListItem = document.createElement('li');
  const infoWrapper = document.createElement('div');

  userListItem.dataset.userId = `${userId}`;

  userListItem.classList.add('userListItem');
  infoWrapper.classList.add('infoWrapper');

  infoWrapper.append(
    createUserInfo(`${firstName} ${lastName}`),
    createUserAgeAndGender(userAge, userGender),
    createUserLocation(`${userCountry}, ${userState}, ${userCity}`),
    createUserEmail(userEmail)
  );

  setFrame(userListItem, userGender);

  userListItem.append(
    createUserAvatar(src, `${firstName} ${lastName}`),
    infoWrapper,
    selectUser(user)
  );

  return userListItem;
}

function selectUser(users) {
  const selectBtn = document.createElement('button');

  selectBtn.classList.add('toSelectBtn');

  selectBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

  selectBtn.onclick = (e) => {
    if (e.currentTarget.parentNode.classList.contains('selectedUser')) {
      e.currentTarget.parentNode.classList.remove('selectedUser');
      e.currentTarget.classList.remove('selectedBtn');
    } else {
      e.currentTarget.parentNode.classList.add('selectedUser');
      e.currentTarget.classList.add('selectedBtn');
    }
    renderSelectedUsers(users, e.currentTarget.parentNode.parentNode);
  };

  return selectBtn;
}

function selectedUsers(el, user) {
  if (el.classList.contains('selectedUser')) {
    const userIndex = user.findIndex((e) => e.login.uuid === el.dataset.userId);

    selectedUsersField.textContent += ` ${user[userIndex].name.first} ${user[userIndex].name.last}, `;
  }
}

function renderSelectedUsers(users, { children: usersList }) {
  const usersListArr = [...usersList];

  selectedUsersField.textContent = ' ';

  usersListArr.forEach((el) => {
    selectedUsers(el, users);
  });
}

function setFrame(el, gender) {
  const borderStyle = '3px solid';

  if (gender === 'male') {
    el.style.border = `${borderStyle} #02D5FF`;
  } else {
    el.style.border = `${borderStyle} #EC02FF`;
  }
}

function createUserAvatar(src, alt) {
  const userAvatarEl = document.createElement('img');

  userAvatarEl.classList.add('avatar');
  userAvatarEl.src = src;
  userAvatarEl.alt = alt;

  userAvatarEl.onerror = () => {
    userAvatarEl.src = './../img/defaultAvatar.png';
  };

  return userAvatarEl;
}

function createUserInfo(name) {
  const userNameEl = document.createElement('p');

  userNameEl.classList.add('userName');
  userNameEl.textContent = name;

  return userNameEl;
}

function createUserEmail(email) {
  const userEmailEl = document.createElement('a');

  userEmailEl.classList.add('userMail');
  userEmailEl.href = `mailto: ${email}`;
  userEmailEl.innerHTML = 'User email adress';

  return userEmailEl;
}

function createUserAgeAndGender(age, gender) {
  const userAgeAndGenderEl = document.createElement('p');

  userAgeAndGenderEl.textContent = `Gender : ${gender}, ${age} years old.`;

  return userAgeAndGenderEl;
}

function createUserLocation(location) {
  const userLocationEl = document.createElement('p');
  userLocationEl.textContent = `Location :  ${location}`;

  return userLocationEl;
}

getUsers(properties);
