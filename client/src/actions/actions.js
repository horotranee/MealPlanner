'use strict'
const log = console.log

export const checkLoggedIn = (app) => {
  return fetch('/api/checkloggedin').then(res => {
    if (res.ok) {
      return res.json()
    } else {
      return { uid: null }
    }
  }).then(json => {
    app.setState({ uid: json.uid })
    return json.uid
  }).catch(error => log(error))
}

export const createUser = (payload) => {
  const request = new Request('/api/users', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error creating user')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}

export const login = (payload) => {
  const request = new Request('/api/login', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
      // TODO change session user
    } else {
      log('error logging in')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}

export const addMeal = (payload, uid) => {
  const request = new Request(`/api/users/${uid}/meals`, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error creating meal')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}

export const addIngredient = (payload, uid) => {
  const request = new Request(`/api/users/${uid}/ingredients`, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error creating ingredient')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}

export const deleteMeal = (payload, uid, mid) => {
  const request = new Request(`/api/users/${uid}/meals/${mid}`, {
    method: 'delete',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error deleting meal')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}

export const deleteIngredient = (payload, uid, iid) => {
  const request = new Request(`/api/users/${uid}/ingredients/${iid}`, {
    method: 'delete',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(request).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      log('error deleting ingredient')
    }
  }).then(json => {
    log('Success:', json)
    return json
  }).catch(error => log(error))
}
