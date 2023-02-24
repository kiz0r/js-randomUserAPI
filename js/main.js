'use strict';

// - Випадкові користувачі https://randomuser.me/api
// (дока по апі https://randomuser.me/documentation)
// *Наприклад,
// --- вивести дані списком;
// --- налаштувати гортання по сторінках (приклад https://github.com/pecourses/pe2021-2-promise/blob/main/js/index.js);
// --- додати кнопку <<, тобто перехід першу сторінку;
// --- додати інформацію про користувача (вік, імейл, ...);
// --- колір рамки (фону) карткам генерувати залежно від статі користувача;
// --- ** зробити можливим вибирати кілька карток, перелік повних імен обраних користувачів приводити в рядок зверху. Вибрані картки підсвічувати;
// --- застилити картки.

const properties = {
  results: 5,
  page: 1,
  seed: 'students',
};

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

  const usersListItems = users.map((u) => createUserItem(u));

  usersList.replaceChildren(...usersListItems);
}

function createUserItem({
  name: { first: firstName, last: lastName },
  picture: { large: src },
  email: userEmail,
  dob: { age: userAge },
  gender: userGender,
}) {
  const userListItem = document.createElement('li');
  const infoWrapper = document.createElement('div');

  userListItem.classList.add('userListItem');
  infoWrapper.classList.add('infoWrapper');

  infoWrapper.append(
    createUserInfo(`${firstName} ${lastName}`),
    createUserEmail(userEmail),
    createUserAgeAndGender(userAge, userGender)
  );

  userListItem.append(
    createUserAvatar(src, `${firstName} ${lastName}`),
    infoWrapper,
    selectUser()
  );

  return userListItem;
}

function selectUser() {
  const selectBtn = document.createElement('button');

  selectBtn.classList.add('toSelectBtn');

  selectBtn.innerHTML = '<i class="fa-regular fa-circle-check"></i>';

  selectBtn.onclick = (e) => {
    if (e.currentTarget.parentNode.classList.contains('selectedUser')) {
      e.currentTarget.parentNode.classList.remove('selectedUser');
      e.currentTarget.classList.remove('selectedBtn');
    } else {
      e.currentTarget.parentNode.classList.add('selectedUser');
      e.currentTarget.classList.add('selectedBtn');
    }
  };

  return selectBtn;
}

function createUserAvatar(src, alt) {
  const userAvatarEl = document.createElement('img');

  userAvatarEl.classList.add('avatar');
  userAvatarEl.src = src;
  userAvatarEl.alt = alt;

  userAvatarEl.onerror = (e) => {
    userAvatarEl.src = './../img/defaultAvatar.png';
  };

  return userAvatarEl;
}

function createUserInfo(info) {
  const userInfoEl = document.createElement('p');

  userInfoEl.textContent = info;

  return userInfoEl;
}

function createUserEmail(email) {
  const userEmailEl = document.createElement('a');

  userEmailEl.classList.add('userMail');
  userEmailEl.href = `mailto: ${email}`;
  userEmailEl.innerHTML = email;

  return userEmailEl;
}

function createUserAgeAndGender(age, gender) {
  const userAgeAndGenderEl = document.createElement('p');

  userAgeAndGenderEl.textContent = `Gender : ${gender}, ${age} years old.`;

  return userAgeAndGenderEl;
}

getUsers(properties);
