export function signUp(email, name, password, role) {
  const form = new FormData();

  form.append('email', email);
  form.append('name', name);
  form.append('password', password);
  form.append('role', role);

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

export const DRIVER_SIGNUP = 'DRIVER_SIGNUP';
export function driverSignup(phone, plate, license, picture) {
  const form = new FormData();

  form.append('phone', phone);
  form.append('plate', plate);
  form.append('license', license);
  form.append('picture', picture);

  return dispatch =>
    apiRequest('POST', '/member/driver/signup', form).then(json => {
      dispatch(updateUser(json));
    });
}

export function currentUser() {
  return dispatch =>
    apiRequest('GET', '/member/current').then(current => {
      dispatch(updateUser(current.member));

      if (current.trip != null) dispatch(updateTrip(current.trip));
    });
}

export const UPDATE_USER = 'UPDATE_USER';
export function updateUser(user) {
  return {
    type: UPDATE_USER,
    user: user
  };
}

export const UPDATE_TRIP = 'UPDATE_TRIP';
export function updateTrip(trip) {
  return {
    type: UPDATE_TRIP,
    trip: trip
  };
}

export function apiRequest(method = 'POST', path, body) {
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
