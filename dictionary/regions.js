const odeskaya = {
    ua: 'Одеська область',
    ru: 'Одесская область'
}
const dnepropetrodvkaya = {
    ua: 'Дніпропетровська область',
    ru: 'Днепропетровская область'
}
const chernigivskaya = {
    ua: 'Чернігівська область',
    ru: 'Черниговская область'
}
const kharkivskaya = {
    ua: 'Харківська область',
    ru: 'Харьковская область'
}
const zhitomirskaya = {
    ua: 'Житомирська область',
    ru: 'Житомирская область'
}
const poltavaskaya = {
    ua: 'Полтавська область',
    ru: 'Полтавская область'
}

const khersonskaya = {
    ua: 'Херсонська область',
    ru: 'Херсонская область'
}
const kievskaya = {
    ua: 'Київська область',
    ru: 'Киевская область'
}


const zaporozskaya = {
    ua: 'Запорізька область',
    ru: 'Запорожская область'
}
const luganskaya = {
    ua: 'Луганська область',
    ru: 'Луганская область'
}
const donetskaya = {
    ua: 'Донецька область',
    ru: 'Донецкая область'
}


const vinitskaya = {
    ua: 'Вінницька область',
    ru: 'Винницкая область'
}
const krumskaya= {
    ua: 'АР Крим',
    ru: 'АР Крым'
}
const kirovogradskaya = {
    ua: 'Кiровоградська область',
    ru: 'Кировоградская область'
}
const mykolaivskaya = {
    ua: 'Миколаївська область',
    ru: 'Николаевская область'
}
const sumskaya = {
    ua: 'Сумська область',
    ru: 'Сумская область'
}
const lvovskaya = {
    ua: 'Львівська область',
    ru: 'Львовская область'
}
const cherkasykaya = {
    ua: 'Черкаська область',
    ru: 'Черкасская область'
}
const khmelnistkaya = {
    ua: 'Хмельницька область',
    ru: 'Хмельницкая область'
}
const volinskaya = {
    ua: 'Волинська область',
    ru: 'Волынская область'
}
const rovnenskaya = {
    ua: 'Рівненська область',
    ru: 'Ровненская область'
}
const ivanoska= {
    ua: 'Івано-Франківська область',
    ru: 'Ивано-Франковская область'
}
const thmernopilskaya = {
    ua: 'Тернопільська область',
    ru: 'Тернопольская область'
}
const zakarpatskaya= {
    ua: 'Закарпатська область',
    ru: 'Закарпатская область'
}
const czernovickaya= {
    ua: 'Чернівецька область',
    ru: 'Черновицкая область'
}
const NEXT_PAGE ={
    ua: 'Далі ▶️',
    ru: 'Дальше ▶️'
}
const PREV_PAGE ={
    ua: 'Назад ◀️',
    ru: 'Назад ◀️'
}
module.exports = async function getRegion(type, language) {
    switch (type){
        case 'odeskaya': return odeskaya[language]
        case 'dnepropetrodvkaya': return dnepropetrodvkaya[language]
        case 'chernigivskaya': return chernigivskaya[language]
        case 'kharkivskaya': return kharkivskaya[language]
        case 'zhitomirskaya': return zhitomirskaya[language]
        case 'poltavaskaya': return poltavaskaya[language]
        case 'khersonskaya': return khersonskaya[language]
        case 'kievskaya': return kievskaya[language]
        case 'zaporozskaya': return zaporozskaya[language]
        case 'luganskaya': return luganskaya[language]
        case 'donetskaya': return donetskaya[language]
        case 'vinitskaya': return vinitskaya[language]
        case 'krumskaya': return krumskaya[language]
        case 'kirovogradskaya': return kirovogradskaya[language]
        case 'mykolaivskaya': return mykolaivskaya[language]
        case 'sumskaya': return sumskaya[language]
        case 'lvovskaya': return lvovskaya[language]
        case 'cherkasykaya': return cherkasykaya[language]
        case 'khmelnistkaya': return khmelnistkaya[language]
        case 'volinskaya': return volinskaya[language]
        case 'rovnenskaya': return rovnenskaya[language]
        case 'ivanoska': return ivanoska[language]
        case 'thmernopilskaya': return thmernopilskaya[language]
        case 'zakarpatskaya': return zakarpatskaya[language]
        case 'czernovickaya': return czernovickaya[language]
        case 'NEXT_PAGE': return NEXT_PAGE[language]
        case 'PREV_PAGE': return PREV_PAGE[language]

    }
}

