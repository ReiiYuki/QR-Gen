import qs from 'qs'
import ReactGA from 'react-ga';

export function getDefaultData(dataFields) {
    const data = {}
    dataFields.forEach(dataField => data[dataField] = getDefaultDataByQS(dataField) || getDefaultDataByLocalStorage(dataField) || '')
    return data
}

export function getDefaultDataByQS(dataField) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(dataField)
}

export function getDefaultDataByLocalStorage(dataField) {
    return localStorage.getItem(dataField)
}

export function updateLocalStorage(data) {
    Object.keys(data).forEach(key => localStorage.setItem(key, data[key]))
}

export function updateQS(data) {
    const cleanData = cleanUpData(data)
    window.history.pushState(null, '', `?${qs.stringify(cleanData)}`)
    ReactGA.pageview(window.location.pathname + window.location.search)
}

export function cleanUpData(data) {
    const safeData = Object.assign(data, {})
    Object.keys(safeData).forEach(key => {
        if (!safeData[key]) {
          delete safeData[key];
        }
    })
    return safeData
}
