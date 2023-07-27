const getMessage = require("../dictionary/dictionaryFunction");
const getRegion = require("../dictionary/regions")

const db 			= require('../schemas')
const User 			= db.user

class MenuController {

    async get_menu(bot, chat_id, language){
        await bot.sendMessage(chat_id, await getMessage('MENU_TEXT', language ), { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('MENU_SEARCH', language ) , await getMessage('MENU_ANONYM', language ) ],
                        [ await getMessage('MENU_PROFILE', language ) , await getMessage('MENU_DONATE', language ) ],
                        [ await getMessage('MENU_FAQ', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})
    }
    async get_profile(bot, chat_id, language){
        const get_users = await User.findOne({
            attributes: ['id','firstname', 'years', 'about', 'region', 'city', 'file_id'],
            where: {chat_id: chat_id}
        })
        await bot.sendPhoto(chat_id, get_users.file_id)
        await bot.sendMessage(chat_id, get_users.firstname + ', ' + get_users.years + ', 📍' + await getRegion(get_users.region, language) + ', '  + get_users.city + '\n\n' + get_users.about, { reply_markup: {
                keyboard:
                    [
                        [ await getMessage('EDIT_FIRSTNAME', language ) , await getMessage('EDIT_YEARS', language ) ],
                        [ await getMessage('EDIT_REGION', language ) , await getMessage('EDIT_CITY', language ) ],
                        [ await getMessage('EDIT_GENDER', language ) , await getMessage('EDIT_ABOUT', language ) ],
                        [ await getMessage('EDIT_INTEREST', language ) , await getMessage('EDIT_PHOTO', language ) ],
                        [ await getMessage('GOTO_MENU', language ) ]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }})

    }
}


module.exports = new MenuController()