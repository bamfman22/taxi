export function signUp(email, name, password, role) {
  const form = new FormData();

  form.append('email', email);
  form.append('name', name);
  form.append('password', password);

  return dispatch =>
    apiRequest('POST', '/member/signup', form).then(json =>
      dispatch(updateUser(json))
    );
}

export function logIn(email, password) {
  const form = new FormData();

  form.append('email', email);
  form.append('password', password);

  return dispatch =>
    apiRequest('POST', '/member/login', form).then(json =>
      dispatch(updateUser(json))
    );
}

export const LOG_OUT = 'LOG_OUT';
export function logOut() {
  return dispatch =>
    apiRequest('GET', '/member/logout').then(user =>
      dispatch({ type: LOG_OUT })
    );
}

export function currentUser() {
  return dispatch =>
    apiRequest('GET', '/member/current').then(user =>
      dispatch(updateUser(user))
    );
}

export const UPDATE_USER = 'UPDATE_USER';
export function updateUser(user) {
  return {
    type: UPDATE_USER,
    user: user
  };
}

function apiRequest(method = 'POST', path, body) {
  if (method)
    return fetch(path, {
      credentials: 'same-origin',
      method,
      body
    }).then(response => {
      window.headers = response.headers;
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => Promise.reject(data));
      }
    });
}
