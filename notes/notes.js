let userLang = navigator.language || navigator.userLanguage;
console.log(`Browser language is ${userLang}`);

// If chinese then turn on the tags
if (userLang == "zh-TW") {
    let tags = document.querySelectorAll('.lang');

    for (let i = 0; i < tags.length; i++) {
        tags[i].classList.remove('d-none');
    }
}
