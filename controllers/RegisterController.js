const db 			= require('../schemas')
const User 			= db.user

const sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

const getMessage = require('../dictionary/dictionaryFunction')
const getRegion = require('../dictionary/regions')

class RegisterController {
    async get_firstname(bot, chat_id, from_first_name, language) {
        await bot.sendMessage(chat_id, await getMessage('MSG_FIRSTNAME', language))
    }
    async get_years(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('MSG_YEARS', language))
    }
    async get_gender(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('MSG_GENDER', language ), { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('REPLY_GENDER_MALE', language ) , await getMessage('REPLY_GENDER_FEMALE', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})
    }
    async get_region(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('MSG_REGION', language), {
            "reply_markup": {
                "inline_keyboard": [
                    [
                        {
                            text: await getRegion('odeskaya', language),
                            callback_data: "odeskaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('dnepropetrodvkaya', language),
                            callback_data: "dnepropetrodvkaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('chernigivskaya', language),
                            callback_data: "chernigivskaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('kharkivskaya', language),
                            callback_data: "kharkivskaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('zhitomirskaya', language),
                            callback_data: "zhitomirskaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('poltavaskaya', language),
                            callback_data: "poltavaskaya",
                        },
                    ],
                    [
                        {
                            text: await getRegion('NEXT_PAGE', language),
                            callback_data: "nextpage2",
                        },
                    ],
                ],

            },

        });
    }
    async get_city(bot,chat_id, language){

        await bot.sendMessage(chat_id, await getMessage('MSG_CITY', language ))

    }
    async get_about(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('ABOUT_ME', language))
    }
    async get_interest(bot,chat_id,language){
        await bot.sendMessage(chat_id, await getMessage('WHO_INTEREST', language ), { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('REPLY_WHOINTERES_MALE', language ) , await getMessage('REPLY_WHOINTERES_FEMALE', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})
    }
    async get_photo(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('MSG_PHOTO', language))
    }
}


module.exports = new RegisterController()