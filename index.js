import { extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
export { MODULE_NAME };

const MODULE_NAME = 'random-outcome';

function rollD100() {
    return Math.floor(Math.random() * 100) + 1;
}

jQuery(async () => {
    const context = SillyTavern.getContext();

    const {
        eventSource,
        event_types,
        chatMetadata,
        saveMetadata,
    } = context;

    eventSource.on(event_types.MESSAGE_SENT, async () => {
        console.log("triggered");
        if (!context.chat[context.chat.length - 1].is_user){
            console.log("not rolling - not a user message");
            return;
        }
        
        const roll = rollD100();
        const msg = `[SYSTEM: Current d100 roll is ${roll}. Use it for uncertainty resolution.]`
        context.setExtensionPrompt("random-outcome-roll", msg, extension_prompt_types.IN_CHAT, 0, extension_prompt_roles.USER, false)  // k v pos depth scan role filter
        console.log(msg);
        console.log(extension_prompt_roles.USER)
        await saveMetadata();
    });
});


        // remove previous random outcome messages
        // for (let i = context.chat.length - 1; i >= 0; i--) {
            // console.log(i)
            // if (context.chat[i].extra.is_random_outcome)
                // context.deleteMessage(i)
        // }
        // context.sendSystemMessage('generic', msg, { is_random_outcome: true })
