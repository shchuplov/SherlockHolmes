// Контроллер анонимного чата
const colog = require('colog')
// Словари
const getMessage = require('../dictionary/dictionaryFunction')
const getRegion = require("../dictionary/regions");

// Модели базы данных
const db 			= require('../schemas')
const {Op} = require("sequelize");
const User 			= db.user


class anonymController {
    async start(bot, chat_id, language) {
        await bot.sendMessage(chat_id, await getMessage('ANONYM_CATEGORY', language), {
            reply_markup: {
                keyboard:
                    [
                        [await getMessage('ANONYM_REGION', language)],
                        [await getMessage('ANONYM_GENDER', language)],
                        [await getMessage('ANONYM_EIGHTEEN', language)],
                        [await getMessage('GOTO_MENU', language)]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }
        })
    }
    async gender_searching(bot,chat_id, language, gender){
        const user = await User.findOne({ attributes:['gender', 'region'], where: {chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('START_SEARCH', language), {
            reply_markup: {
                keyboard:

                    [
                        [await getMessage('NEXT_USER', language)],
                        [await getMessage('GOTO_MENU', language)]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }
        })

        if(gender === 0){
            await User.update({place: 'gender_search_man'}, { where:{chat_id: chat_id}})
            const get_user = await User.findOne({
                attributes: ['chat_id', 'place'],
                where: {
                    gender: 0, place: 'gender_search_woman',
                    chat_id: {[Op.not]: chat_id}
                }
            });
            if(!get_user){
                colog.error('debug: Поиск по полу мужчина,  не найдено по gender_search_woman')
                const get_user_random = await User.findOne({
                    attributes: ['chat_id', 'place'],
                    where: {
                        gender: 0, place: 'region_search', region: user.region,
                        chat_id: {[Op.not]: chat_id}
                    }
                });
                if(!get_user_random){
                    colog.error('debug: Поиск по полу мужчина,  не найдено по gender_search пол мужской')
                    await bot.sendMessage(chat_id, await getMessage('NOT_FOUND', language))
                } else{
                    colog.success('debug: Поиск по полу мужчина,  найдено по gender_search пол мужской')
                    await User.update({place: 'region_speak', suspect_id: chat_id}, {where: {chat_id: get_user_random.chat_id}})
                    await User.update({place: 'gender_search_man_speak', suspect_id: get_user_random.chat_id}, {where: {chat_id: chat_id}})

                    await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                    await bot.sendMessage(get_user_random.chat_id, await getMessage('REGION_FOUND', language))
                }
            } else{
                colog.success('debug: Поиск по полу мужчина,  найдено по gender_search_woman')
                await User.update({place: 'gender_search_woman_speak', suspect_id: chat_id}, {where: {chat_id: get_user.chat_id}})
                await User.update({place: 'gender_search_man_speak', suspect_id: get_user.chat_id}, {where: {chat_id: chat_id}})

                await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                await bot.sendMessage(get_user.chat_id, await getMessage('REGION_FOUND', language))
            }
        } else{
            await User.update({place: 'gender_search_woman'}, { where:{chat_id: chat_id}})
            const get_user = await User.findOne({
                attributes: ['chat_id', 'place'],
                where: {
                    gender: 1, place: 'gender_search_man',
                    chat_id: {[Op.not]: chat_id}
                }
            });
            if(!get_user){
                colog.error('debug: Поиск по полу женщина,  не найдено по gender_search_man')
                const get_user_random = await User.findOne({
                    attributes: ['chat_id', 'place'],
                    where: {
                        gender: 1, place: 'region_search', region: user.region,
                        chat_id: {[Op.not]: chat_id}
                    }
                });
                if(!get_user_random){
                    colog.error('debug: Поиск по полу женщина,  не найдено по рандому')
                    await bot.sendMessage(chat_id, await getMessage('NOT_FOUND', language))
                } else{
                    colog.success('debug: Поиск по полу женщина,  найдено по рандому')
                    await User.update({place: 'region_speak', suspect_id: chat_id}, {where: {chat_id: get_user_random.chat_id}})
                    await User.update({place: 'gender_search_woman_speak', suspect_id: get_user_random.chat_id}, {where: {chat_id: chat_id}})

                    await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                    await bot.sendMessage(get_user_random.chat_id, await getMessage('REGION_FOUND', language))
                }
            } else{
                colog.success('debug: Поиск по полу женщина,  найдено по gender_search_man')
                await User.update({place: 'gender_search_woman_speak', suspect_id: chat_id}, {where: {chat_id: get_user.chat_id}})
                await User.update({place: 'gender_search_man_speak', suspect_id: get_user.chat_id}, {where: {chat_id: chat_id}})

                await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                await bot.sendMessage(get_user.chat_id, await getMessage('REGION_FOUND', language))
            }



        }
    }
    async region_search(bot, chat_id, language, region){
        const user_gender = await User.findOne({attributes:['gender']}, {where: {chat_id: chat_id}})
        await User.update({place: 'region_search'}, { where:{chat_id: chat_id}})
        await bot.sendMessage(chat_id, await getMessage('START_SEARCH', language), {
            reply_markup: {
                keyboard:

                    [
                        [await getMessage('NEXT_USER', language)],
                        [await getMessage('GOTO_MENU', language)]
                    ],
                'resize_keyboard': true,
                'one_time_keyboard': true,
                'selective': true
            }
        })
        if(user_gender === 0){
            const get_suspect_gender = await User.findOne({
                attributes: ['chat_id'],
                where: {
                    region: region, place: 'gender_search_man',
                    chat_id: {[Op.not]: chat_id}
                }
            });
            if(!get_suspect_gender) {
                colog.error('debug: Рандомный поиск по тем, кто ищет мужчину, не удался,  ищем по region_search')
                const get_suspect = await User.findOne({
                    attributes: ['chat_id'],
                    where: {
                        region: region, place: 'region_search',
                        chat_id: {[Op.not]: chat_id}
                    }
                });
                if (!get_suspect) {
                    colog.error('debug: Поиск по региону,  не найдено по region_search')
                    await bot.sendMessage(chat_id, await getMessage('NOT_FOUND', language))
                } else {
                    colog.success('debug: Поиск по региону,  найдено по gender_search_man')
                    await User.update({
                        place: 'region_speak',
                        suspect_id: chat_id
                    }, {where: {chat_id: get_suspect.chat_id}})
                    await User.update({
                        place: 'region_speak',
                        suspect_id: get_suspect.chat_id
                    }, {where: {chat_id: chat_id}})
                    await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                    await bot.sendMessage(get_suspect.chat_id, await getMessage('REGION_FOUND', language))
                }
            } else{
                await User.update({
                    place: 'region_speak',
                    suspect_id: chat_id
                }, {where: {chat_id: get_suspect_gender.chat_id}})
                await User.update({
                    place: 'region_speak',
                    suspect_id: get_suspect_gender.chat_id
                }, {where: {chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                await bot.sendMessage(get_suspect_gender.chat_id, await getMessage('REGION_FOUND', language))
            }
        } else{
            const get_suspect_gender_woman = await User.findOne({
                attributes: ['chat_id'],
                where: {
                    region: region, place: 'gender_search_woman',
                    chat_id: {[Op.not]: chat_id}
                }
            });
            if(!get_suspect_gender_woman) {
                colog.error('debug: Рандомный поиск по тем, кто ищет женщину, не удался,  ищем по region_search')
                const get_suspect_random = await User.findOne({
                    attributes: ['chat_id'],
                    where: {
                        region: region, place: 'region_search',
                        chat_id: {[Op.not]: chat_id}
                    }
                });
                if (!get_suspect_random) {
                    colog.error('debug: Поиск по региону,  не найдено по region_search')
                    await bot.sendMessage(chat_id, await getMessage('NOT_FOUND', language))
                } else {
                    colog.success('debug: Поиск по региону,  найдено по gender_search_woman')
                    await User.update({
                        place: 'region_speak',
                        suspect_id: chat_id
                    }, {where: {chat_id: get_suspect_random.chat_id}})
                    await User.update({
                        place: 'region_speak',
                        suspect_id: get_suspect_random.chat_id
                    }, {where: {chat_id: chat_id}})
                    await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                    await bot.sendMessage(get_suspect_random.chat_id, await getMessage('REGION_FOUND', language))
                }
            } else{
                await User.update({
                    place: 'region_speak',
                    suspect_id: chat_id
                }, {where: {chat_id: get_suspect_gender_woman.chat_id}})
                await User.update({
                    place: 'region_speak',
                    suspect_id: get_suspect_gender_woman.chat_id
                }, {where: {chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('REGION_FOUND', language))
                await bot.sendMessage(get_suspect_gender_woman.chat_id, await getMessage('REGION_FOUND', language))
            }
        }

    }
    async gender_search(bot, chat_id, language){
        await User.update({place: 'gender_input'}, {where: {chat_id: chat_id}})
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
}


module.exports = new anonymController()