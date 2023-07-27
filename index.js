//Импортирование библиотек
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const sprintf = require('sprintf-js').sprintf
const colog = require('colog')
//------------------------------------------------------------

// Настройки бота
const TOKEN = ''
const url = '';
const port = 8888;
// ------------------------------------------------------------

// Импортирование схем базы данных
const db 			= require('./schemas')
const User 			= db.user
// ------------------------------------------------------------

// Импортирование контроллеров
const RegisterController = require('./controllers/RegisterController')
const RegionController = require('./controllers/regionController')
const MenuController = require('./controllers/menuController')
const EditController = require ('./controllers/editController')
const AnonController = require('./controllers/anonymController')
// ------------------------------------------------------------

// Импортирование функций для перевода
const getMessage = require("./dictionary/dictionaryFunction");
const getRegion = require('./dictionary/regions')
// ------------------------------------------------------------

// Создание бота, установка веб сокета и создание сервера
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${url}/bot${TOKEN}`);
const app = express();
app.use(express.json());
// ------------------------------------------------------------

// Получение ответов от телеграмма
app.post(`/bot${TOKEN}`, (req, res) => {
  //console.log(req.body)
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
// ------------------------------------------------------------

// Запуск Express сервера
app.listen(port, () => {
  colog.success(`SERVER FOR BOT BY SHCHUPLOV STARTED ON ${port}`);
});
// ------------------------------------------------------------

// Обработка сообщений юзера
bot.on('message', async msg => {
   // console.log(msg)
    const from_first_name 		= msg.from.first_name;

    // инфо про чат
    const chat_id 				= msg.chat.id;
    const chat_type 			= msg.chat.type;



    const get_user = await User.findOne({
        attributes: ['chat_id', 'register_status', 'register_now', 'language', 'place', 'region', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    if(get_user){
        let language = (get_user.language === 0)? 'ua' : 'ru'
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            if(msg.text !== 'Вернуться назад ⬅️')
            {
                if(msg.text !== 'Повернутися назад ⬅️'){
                    if(msg.text !== undefined){
                        await bot.sendMessage(get_user.suspect_id, await getMessage('SUSPECT', language) + '\n\n' + msg.text, {parse_mode: 'HTML'})
                    }
                }


            }
        }

        if(get_user.register_now !== 0 && msg.text !== '/start'){

            switch (get_user.register_status){
                case 1:
                    if(msg.text.length > 30){
                        await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
                        break;
                    }
                    await User.update({firstname: msg.text, register_status: 2}, { where:{chat_id: chat_id}})
                    return await RegisterController.get_years(bot, chat_id, language)

                case 2:
                    const reg = new RegExp('[1-9][0-9]');
                    const check = reg.test(msg.text)
                    if(!check){
                        await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
                        break;
                    }
                    if(msg.text > 99 || msg.text < 0){
                        await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
                        break;
                    }
                    await User.update({years: msg.text, register_status: 3}, { where:{chat_id: chat_id}})
                    return await RegisterController.get_gender(bot, chat_id, language)
                case 3:
                    const genders = [
                        'Чоловіча',
                        'Мужской',
                        'Жіноча',
                        'Женский'
                    ]
                    if (!genders.includes(msg.text)) {
                        await RegisterController.get_gender(bot, chat_id, language)
                        break;
                    }
                    const gender = (msg.text = 'Чоловіча' || msg.text === 'Мужской') ? 0 : 1
                    await User.update({gender: gender, register_status: 4}, { where:{chat_id: chat_id}})
                    //return await RegisterController.get_city(bot, chat_id, language)
                    return await RegisterController.get_region(bot, chat_id, language)
                case 4: return await RegisterController.get_region(bot, chat_id, language)
                case 5:
                    const reg2 = new RegExp('[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]')
                    const check2 = reg2.test(msg.text)
                    if(!check2){
                        await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
                        break;
                    }
                    await User.update({city: msg.text, register_status: 6}, { where:{chat_id: chat_id}})
                    return await RegisterController.get_about(bot, chat_id, language)
                case 6:
                    if(msg.text.length > 250){
                        await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
                        break;
                    }
                    await User.update({about: msg.text, register_status: 7}, { where:{chat_id: chat_id}})
                    return await RegisterController.get_interest(bot, chat_id, language)
                case 7:
                    const gendersInterest = [
                        'Чоловіки',
                        'Мужчины',
                        'Жінки',
                        'Женщины'
                    ]
                    if (!gendersInterest.includes(msg.text)) {
                        await RegisterController.get_interest(bot, chat_id, language)
                        break
                    }

                    const interest = (msg.text === 'Чоловіки' || msg.text === 'Мужчины') ? 0 : 1
                    await User.update({who: interest, register_status: 8}, { where:{chat_id: chat_id}})
                    return await RegisterController.get_photo(bot, chat_id, language)
                case 8:
                    //await bot.sendMessage(chat_id, await getMessage('PHOTO_ERROR', language))
                    break;
            }

        }
        // menu

        //anonym
        if(msg.text === 'Анонімний чат 🔏' || msg.text === 'Анонимный чат 🔏'){
            await AnonController.start(bot, chat_id, language)
        }
        if(msg.text === 'Пошук за статтю 👩‍‍👨 - PRO 👑' || msg.text === 'Поиск по полу 👩‍️‍👨 - PRO 👑'){
            await AnonController.gender_search(bot, chat_id, language)
        }

        if(msg.text === 'Пошук по області та місту 📍' || msg.text === 'Поиск по области и городу 📍'){
            await AnonController.region_search(bot, chat_id, language,get_user.region)
        }
        if(msg.text === 'Знайти наступного 🔍' || msg.text === 'Найти следующего 🔍'){
            switch (get_user.place){
                case 'region_speak':
                    await User.update({place: 'region_search', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                    await User.update({place: 'region_search', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})

                    await bot.sendMessage(chat_id, await getMessage('EXIT_SPEAK', language))
                    await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                    await AnonController.region_search(bot, chat_id, language,get_user.region)
                    break;
                case 'gender_search_woman_speak':
                    const suspect = await User.findOne({attributes:['place','region']}, {where: {chat_id: get_user.suspect_id}})
                    if(suspect.place === 'region_speak'){
                        await User.update({place: 'region_search', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await AnonController.region_search(bot,get_user.suspect_id,language,suspect.region)
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                    }
                    if(suspect.place === 'gender_search_man_speak'){
                        await User.update({place: 'gender_search_man', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                        await AnonController.gender_searching(bot,get_user.suspect_id,language, 0)
                    }
                    await bot.sendMessage(chat_id, await getMessage('EXIT_SPEAK', language))
                    await User.update({place: 'gender_search_woman', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                    return await AnonController.gender_searching(bot,chat_id,language,1)
                case 'gender_search_man_speak':
                    const suspect2 = await User.findOne({attributes:['place','region']}, {where: {chat_id: get_user.suspect_id}})
                    if(suspect2.place === 'region_speak'){
                        await User.update({place: 'region_search', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await AnonController.region_search(bot,get_user.suspect_id,language,suspect2.region)
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                    }
                    if(suspect2.place === 'gender_search_woman_speak'){
                        await User.update({place: 'gender_search_woman', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                        await AnonController.gender_searching(bot,get_user.suspect_id,language, 1)
                    }
                    await bot.sendMessage(chat_id, await getMessage('EXIT_SPEAK', language))
                    await User.update({place: 'gender_search_man', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                    return await AnonController.gender_searching(bot,chat_id,language,0)

            }


        }



        if(msg.text === 'Мой профиль ⚙️' || msg.text === 'Мій профіль ⚙️'){
            await MenuController.get_profile(bot, chat_id, language)
        }
        if(msg.text === 'Повернутися назад ⬅️' || msg.text === 'Вернуться назад ⬅️'){
            const places = [
                'region_search',
                'region_speak',
                'gender_search_woman_speak',
                'gender_search_man_speak',
                'gender_search_man',
                'gender_search_woman'
            ]
            if (!places.includes(get_user.place)) {
                //console.log('DOESNT EXISTS')
                await MenuController.get_menu(bot, chat_id, language)
            } else{
                //console.log('WORK')

                if(get_user.suspect_id !== 'none'){
                    const get_suspect = await User.findOne({attributes:['place','region']}, {where:{chat_id: get_user.suspect_id}})
                    if(get_suspect.place === 'gender_search_woman_speak'){
                        await User.update({place: 'gender_search_woman', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                        await AnonController.gender_searching(bot,get_user.suspect_id,language, 1)
                        await User.update({place: 'none', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                        await AnonController.start(bot,chat_id,language)
                    }
                    if(get_suspect.place === 'gender_search_man_speak'){
                        await User.update({place: 'gender_search_man', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                        await AnonController.gender_searching(bot,get_user.suspect_id,language, 0)
                        await User.update({place: 'none', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                        await AnonController.start(bot,chat_id,language)
                    }
                    if(get_suspect.place === 'region_speak'){
                        await User.update({place: 'region_search', suspect_id: 'none'}, { where:{chat_id: get_user.suspect_id}})
                        await bot.sendMessage(get_user.suspect_id, await getMessage('EXIT_SPEAK', language))
                        await AnonController.region_search(bot,get_user.suspect_id,language,get_user.region)
                        await User.update({place: 'none', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                        await AnonController.start(bot,chat_id,language)
                    }
                } else{
                    await User.update({place: 'none', suspect_id: 'none'}, { where:{chat_id: chat_id}})
                    await AnonController.start(bot,chat_id,language)
                }

            }


        }
        if(msg.text === "Змінити ім'я 🪪" || msg.text === 'Изменить имя 🪪'){
            await EditController.edit_firstname(bot, chat_id, language)
        }
        if(msg.text === 'Змінити вік ⚙️' || msg.text === 'Изменить возраст ⚙️'){
            await EditController.edit_years(bot, chat_id, language)
        }
        if(msg.text === 'Змінити область 🪧' || msg.text === 'Изменить область 🪧'){
            await EditController.edit_region(bot, chat_id, language)
        }
        if(msg.text === 'Змінити місто 📍' || msg.text === 'Изменить город 📍'){
            await EditController.edit_city(bot, chat_id, language)
        }
        if(msg.text === 'Змінити стать 🧸' || msg.text === 'Изменить пол 🧸'){
            await EditController.edit_gender(bot, chat_id, language)
        }
        if(msg.text === 'Змінити опис 📜' || msg.text === 'Изменить описание 📜'){
            await EditController.edit_about(bot, chat_id, language)
        }
        if(msg.text === 'Кого шукати 🧲' || msg.text === 'Кого искать 🧲'){
            await EditController.edit_interest(bot, chat_id, language)
        }
        if(msg.text === 'Змінити фото 🖼' || msg.text === 'Изменить фото 🖼'){
            await EditController.edit_photo(bot, chat_id, language)
        }

        // редактирование профиля
        if(get_user.place === 'change_firstname'){
            //const language = (get_user.language === 0)? 'ua' : 'ru'
            if(msg.text.length > 30){
                await bot.sendMessage(chat_id, await getMessage('ERROR_FIRSTNAME', language))

            }else{
                await User.update({firstname: msg.text, place: 'none'}, { where:{chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                await MenuController.get_profile(bot, chat_id, language)
            }

        }
        if(get_user.place === 'change_about'){
            //const language = (get_user.language === 0)? 'ua' : 'ru'
            if(msg.text.length > 250){
                await bot.sendMessage(chat_id, await getMessage('ERROR_ABOUT', language))

            }else{
                await User.update({about: msg.text, place: 'none'}, { where:{chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                await MenuController.get_profile(bot, chat_id, language)
            }

        }
        if(get_user.place === 'change_years'){

            const reg = new RegExp('[1-9][0-9]');
            const check = reg.test(msg.text)
            if(!check){
                await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
            } else {
                if(msg.text > 99 || msg.text < 0){
                    await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))

                } else{
                    await User.update({years: msg.text, place: 'none'}, { where:{chat_id: chat_id}})
                    await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                    await MenuController.get_profile(bot, chat_id, language)
                }
            }

        }
        if(get_user.place === 'change_city'){
            const reg = new RegExp('[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]');
            const check2 = reg.test(msg.text)
            if(!check2){
                await bot.sendMessage(chat_id, await getMessage('ERROR_INPUT', language))
            } else {
                await User.update({city: msg.text, place: 'none'}, { where:{chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                await MenuController.get_profile(bot, chat_id, language)
            }

        }
        if(get_user.place === 'change_gender'){
            const genders = [
                'Чоловіча',
                'Мужской',
                'Жіноча',
                'Женский'
            ]
            if (!genders.includes(msg.text)) {
                await EditController.edit_gender(bot, chat_id, language)
            } else{
                const gender = (msg.text === 'Чоловіча' || msg.text === 'Мужской') ? 0 : 1

                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                await MenuController.get_profile(bot, chat_id, language)
                console.log('Мужской')
                await User.update({gender: gender, place: 'none'}, { where:{chat_id: chat_id}})

            }

        }
        if(get_user.place === 'gender_input'){
            const genders_search = [
                'Чоловіки',
                'Мужчины',
                'Жінки',
                'Женщины'
            ]
            if (!genders_search.includes(msg.text)) {
                await AnonController.gender_search(bot, chat_id, language)
            } else{
                if(msg.text === 'Чоловіки' || msg.text === 'Мужчины'){
                    await AnonController.gender_searching(bot,chat_id,language, 0)
                } else{
                    await AnonController.gender_searching(bot,chat_id,language, 1)
                }

            }
        }
        if(get_user.place === 'change_interest'){
            const genders_interest = [
                'Чоловіки',
                'Мужчины',
                'Жінки',
                'Женщины'
            ]
            if (!genders_interest.includes(msg.text)) {
                await EditController.edit_interest(bot, chat_id, language)
            } else{
                const gender_new = (msg.text === 'Чоловіки' || msg.text === 'Мужчины') ? 0 : 1
                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                await MenuController.get_profile(bot, chat_id, language)
                await User.update({who: gender_new, place: 'none'}, { where:{chat_id: chat_id}})

            }

        }
    }


// Выбор языка
    if(msg.text === 'UA🇺🇦'){
        const get_user = await User.findOne({
            attributes: ['chat_id'],
            where: {chat_id: chat_id}
        })
        if(!get_user){
            await User.create({
                chat_id: chat_id,
                register_status: 1,
                register_now: 1,
                language: 0
            })
            await bot.sendMessage(chat_id, 'Була встановлена українська мова 🇺🇦')
            await bot.sendMessage(chat_id, sprintf(await getMessage('MSG_START', 'ua' ), from_first_name))
            await RegisterController.get_firstname(bot, chat_id, from_first_name, 'ua')
        } else{
            await User.update({language: 0}, {where: {chat_id: chat_id}})
            //await bot.sendMessage(chat_id, 'Була встановлена українська мова 🇺🇦')
        }
    }
    if(msg.text === 'RU🇷🇺'){
        const get_user2 = await User.findOne({
            attributes: ['chat_id'],
            where: {chat_id: chat_id}
        })
        if(!get_user2){
            await User.create({
                chat_id: chat_id,
                register_status: 1,
                register_now: 1,
                language: 1
            })
            await bot.sendMessage(chat_id, 'Был установлен русский язык 🇷🇺')
            await bot.sendMessage(chat_id, sprintf(await getMessage('MSG_START', 'ru'), from_first_name))
            await RegisterController.get_firstname(bot, chat_id, from_first_name, 'ru')
        } else{
            await bot.sendMessage(chat_id, 'Был установлен русский язык 🇷🇺')
            await User.update({language: 1}, {where: {chat_id: chat_id}})
        }
    }
// ------------------------------------------------------------

//Обработка команд
    if(chat_type === 'private') {

    switch (msg.text) {
        case '/start':

            const get_users = await User.findOne({
                attributes: ['id','register_status','register_now', 'chat_id', 'language'],
                where: {chat_id: chat_id}
            })

            if(!get_users) {
              await bot.sendMessage(chat_id, '💬 Виберіть мову інтерфейсу. Згодом, її можливо буде змінити в налаштуваннях', { reply_markup: {
                      keyboard:
                          [
                              [ 'UA🇺🇦' , 'RU🇷🇺' ]
                          ],
                      'resize_keyboard': true,
                      'one_time_keyboard': true,
                      'selective': true
                  }})
          } else{
                if(get_users.register_now !== 1) {
                    const language = (get_user.language === 0)? 'ua' : 'ru'
                    await MenuController.get_menu(bot, chat_id, language)
                }

          }
          break;

        case '/menu':
            const menu_check = await User.findOne({
                attributes: ['id','register_status','register_now', 'chat_id', 'language'],
                where: {chat_id: chat_id}
            })
            if(menu_check){
                if(get_user.register_now !== 1){
                    const language = (menu_check.language === 0)? 'ua' : 'ru'
                    return await MenuController.get_menu(bot, chat_id, language)
                }
            }


    }
  }
});
// обработка voice

bot.on('voice', async voice => {
    const chat_id 				=       voice.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
   if(get_user){
       if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
           await bot.sendVoice(get_user.suspect_id, voice.voice.file_id)
       }
   }
})

// обработка кружочков
bot.on('video_note', async square => {
    const chat_id 				=       square.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    if(get_user){
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            await bot.sendVideoNote(get_user.suspect_id, square.video_note.file_id)
        }
    }
})
// обработка файлов
bot.on('document', async doc => {
    const chat_id 				=       doc.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    if(get_user){
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            await bot.sendVideoNote(get_user.suspect_id, doc.document.file_id)
        }
    }
})
// обработка видео
bot.on('video', async video => {
    const chat_id 				=       video.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    if(get_user){
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            await bot.sendVideoNote(get_user.suspect_id, video.video.file_id)
        }
    }
})
// Обработка получения фото
bot.on("photo", async msg => {
    console.log(msg)
    const chat_id 				=       msg.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    let language = (get_user.language === 0) ? 'ua' : 'ru'
    if(get_user){
        if(get_user.place === 'change_photo'){
            const fileId = msg.photo[msg.photo.length - 1].file_id;
            await User.update({file_id: fileId, place: 'none'}, { where:{chat_id: chat_id}})
            await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
            return await MenuController.get_profile(bot, chat_id, language)
        }
        if(get_user.register_status === 8 && get_user.register_now === 1){

            const fileId = msg.photo[msg.photo.length - 1].file_id;
            await User.update({file_id: fileId, register_status: 9, register_now: 0}, {where: {chat_id: chat_id}})
            await bot.sendMessage(chat_id, await getMessage('MSG_END', language ))
            await MenuController.get_menu(bot, chat_id, language)


        }
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            const fileId = msg.photo[msg.photo.length - 1].file_id;
            await bot.sendPhoto(get_user.suspect_id, fileId)
            await bot.sendMessage(get_user.suspect_id, msg.caption)
        }
    }

});
// обработка стикеров
bot.on('sticker', async sticker => {
    const chat_id 				=       sticker.chat.id;
    const get_user = await User.findOne({
        attributes: ['register_status', 'chat_id', 'register_now', 'language', 'place', 'suspect_id'],
        where: {chat_id: chat_id}
    })
    if(get_user){
        const language = (get_user.language === 0) ? 'ua' : 'ru'
        if(get_user.place === 'region_speak' || get_user.place === 'gender_search_woman_speak' || get_user.place === 'gender_search_man_speak'){
            //await bot.sendMessage(chat_id, await getMessage('SUSPECT', language))
            await bot.sendSticker(get_user.suspect_id, sticker.sticker.file_id)
        }

    }


})

// Обработка коллбєков с Inline Keyboard
bot.on('callback_query', async query => {

    const chat_id        =      query.message.chat.id;
    const message_id     =      query.message.message_id

    // Получение языка юзера выбранного в профиле с бд
    const get_user = await User.findOne({
        attributes: ['language', 'register_status', 'place'],
        where: {chat_id: chat_id}
    })
    const language = (get_user.language === 0) ? 'ua' : 'ru'
    // ---------------------------------------------------------------

    switch (query.data) {
        case 'nextpage2':
            await RegionController.second_page(bot, chat_id, message_id, language)
            break;
        case 'prevpage1':
            await RegionController.first_page(bot, chat_id, message_id, language)
            break;
        case 'nextpage3':
            await RegionController.third_page(bot, chat_id, message_id, language)
            break;
        case 'prevpage2':
            await RegionController.second_page(bot, chat_id, message_id, language)
            break;
        case 'nextpage4':
            await RegionController.fourth_page(bot, chat_id, message_id, language)
            break;
        case 'prevpage3':
            await RegionController.third_page(bot, chat_id, message_id, language)
            break;
        default:
            if(get_user.place === 'change_region'){
                await User.update({region: query.data, place: 'none'}, { where:{chat_id: chat_id}})
                await bot.sendMessage(chat_id, await getMessage('SUCCESSFUL_CHANGES', language))
                return await MenuController.get_profile(bot, chat_id, language)
            }
            if(get_user.register_status === 4){
                await User.update({region: query.data, register_status: 5}, { where:{chat_id: chat_id}})
                return await RegisterController.get_city(bot, chat_id, language)
            }
    }

})
// test
/*
bot.on('new_chat_members', (msg) => {
   // console.log(msg)
    console.log('debug: new_chat_member ' + msg.chat.id)
})
bot.on('left_chat_member', (msg) => {
   // console.log(msg)
    console.log('debug: leave_chat_member ' + msg.chat.id)
})
bot.on('my_chat_member', (msg) => {
    console.log(msg)
    console.log('debug: my_chat_member ' + msg.chat.id)
})
bot.on('chat_join_request', (msg) => {
    //console.log(msg)
    console.log('debug: chat_join_request ' + msg.chat.id)
})*/