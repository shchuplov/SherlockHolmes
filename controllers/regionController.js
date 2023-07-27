const getRegion = require('../dictionary/regions')

class RegionController {
    async first_page(bot, chat_id, message_id, language){
        await bot.editMessageReplyMarkup({
            inline_keyboard: [
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


            ]
        }, {
            chat_id: chat_id,
            message_id: message_id
        });
    }
    async second_page(bot,chat_id,message_id, language){
        await bot.editMessageReplyMarkup({
            inline_keyboard: [
                [
                    {
                        text: await getRegion('khersonskaya', language),
                        callback_data: "khersonskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('kievskaya', language),
                        callback_data: "kievskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('zaporozskaya', language),
                        callback_data: "zaporozskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('luganskaya', language),
                        callback_data: "luganskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('donetskaya', language),
                        callback_data: "donetskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('vinitskaya', language),
                        callback_data: "vinitskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('PREV_PAGE', language),
                        callback_data: "prevpage1",
                    },
                    {
                        text: await getRegion('NEXT_PAGE', language),
                        callback_data: "nextpage3",
                    },

                ],

            ]
        }, {
            chat_id: chat_id,
            message_id: message_id
        });
    }
    async third_page(bot,chat_id,message_id, language){
        await bot.editMessageReplyMarkup({
            inline_keyboard: [
                [
                    {
                        text: await getRegion('krumskaya', language),
                        callback_data: "krumskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('kirovogradskaya', language),
                        callback_data: "kirovogradskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('mykolaivskaya', language),
                        callback_data: "mykolaivskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('sumskaya', language),
                        callback_data: "sumskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('lvovskaya', language),
                        callback_data: "lvovskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('cherkasykaya', language),
                        callback_data: "cherkasykaya",
                    },
                ],
                [
                    {
                        text: await getRegion('PREV_PAGE', language),
                        callback_data: "prevpage2",
                    },
                    {
                        text: await getRegion('NEXT_PAGE', language),
                        callback_data: "nextpage4",
                    },

                ],

            ]
        }, {
            chat_id: chat_id,
            message_id: message_id
        });
    }
    async fourth_page(bot,chat_id,message_id, language){
        await bot.editMessageReplyMarkup({
            inline_keyboard: [
                [
                    {
                        text: await getRegion('khmelnistkaya', language),
                        callback_data: "khmelnistkaya",
                    },
                ],
                [
                    {
                        text: await getRegion('volinskaya', language),
                        callback_data: "volinskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('rovnenskaya', language),
                        callback_data: "rovnenskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('ivanoska', language),
                        callback_data: "ivanoska",
                    },
                ],
                [
                    {
                        text: await getRegion('thmernopilskaya', language),
                        callback_data: "thmernopilskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('zakarpatskaya', language),
                        callback_data: "zakarpatskaya",
                    },
                ],
                [
                    {
                        text: await getRegion('czernovickaya', language),
                        callback_data: "czernovickaya",
                    },
                ],
                [
                    {
                        text: await getRegion('PREV_PAGE', language),
                        callback_data: "prevpage3",
                    },

                ],

            ]
        }, {
            chat_id: chat_id,
            message_id: message_id
        });
    }
}


module.exports = new RegionController()