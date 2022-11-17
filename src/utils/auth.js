// import Cookies from 'js-cookie'
const tokenKey = 'token'
export function getToken() {
  return sessionStorage.getItem(tokenKey)
}
export function setToken(token) {
  return sessionStorage.setItem(tokenKey, token)
}
export function removeToken() {
  return sessionStorage.removeItem(tokenKey)
}



const accountKey = 'account'
export function getAccountToken() {
  return sessionStorage.getItem(accountKey)
}
export function setAccountToken(token) {
  return sessionStorage.setItem(accountKey, token)
}
export function removeAccountToken() {
  return sessionStorage.removeItem(accountKey)
}
