// alert wch is either success or error

// func for hiding alerts
export const hideAlert = () => {
    const el = document.querySelector('.alert')
    // to move one level up to parent then remove child element
    if (el) el.parentElement.removeChild(el)
}

export const showAlert = (type, msg ) => {

    // when we show alert, we hide the other exisitong alerts
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`
    // select the element at the beginning of the page
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
    window.setTimeout(hideAlert, 5000)
}