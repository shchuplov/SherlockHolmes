const getMessage = require("../dictionary/dictionaryFunction");
const getRegion = require("../dictionary/regions")

const db 			= require('../schemas')
const User 			= db.user

class editController {
    async edit_firstname(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('CHANGE_FIRSTNAME', language))
        await User.update({place: 'change_firstname'}, { where:{chat_id: chat_id}})
    }
    async edit_years(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('CHANGE_YEARS', language))
        await User.update({place: 'change_years'}, { where:{chat_id: chat_id}})
    }
    async edit_region(bot, chat_id, language){
        await User.update({place: 'change_region'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('CHANGE_REGION', language), {
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
    async edit_city(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('CHANGE_CITY', language))
        await User.update({place: 'change_city'}, { where:{chat_id: chat_id}})
    }
    async edit_gender(bot, chat_id, language){
        await User.update({place: 'change_gender'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('CHANGE_GENDER', language ), { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('REPLY_GENDER_MALE', language ) , await getMessage('REPLY_GENDER_FEMALE', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})
    }
    async edit_about(bot, chat_id, language){
        await User.update({place: 'change_about'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('CHANGE_ABOUT', language))

    }
    async edit_interest(bot, chat_id, language){
        await User.update({place: 'change_interest'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('CHANGE_INTEREST', language ), { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('REPLY_WHOINTERES_MALE', language ) , await getMessage('REPLY_WHOINTERES_FEMALE', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})
    }
    async edit_photo(bot, chat_id, language){
        await User.update({place: 'change_photo'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('CHANGE_PHOTO', language))
    }
}


module.exports = new editController()