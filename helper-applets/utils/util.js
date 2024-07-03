import {
  CACHE_TOKEN,
  CACHE_TOKEN_EXPIRED_INTERVAL,
  CACHE_TOKEN_TIME,
  CACHE_USERINFO
} from './../config.js';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const removeCache = () => {
  wx.removeStorageSync(CACHE_TOKEN)
  wx.removeStorageSync(CACHE_TOKEN_EXPIRED_INTERVAL)
  wx.removeStorageSync(CACHE_TOKEN_TIME)
  wx.removeStorageSync(CACHE_USERINFO)
}

module.exports = {
  formatTime,
  removeCache
}
