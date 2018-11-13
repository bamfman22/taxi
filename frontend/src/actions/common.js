export function apiRequest(method = 'POST', path, body) {
  if (method)
    return fetch(path, {
      credentials: 'same-origin',
      method,
      body
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => Promise.reject(data));
      }
    });
}
