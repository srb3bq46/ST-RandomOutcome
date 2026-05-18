import { extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
export { MODULE_NAME };

const MODULE_NAME = 'random-outcome';

function getOutcome(roll){
    let trivial_outcome, easy_outcome, difficult_outcome, arduous_outcome;

    if (roll < 0.95){
        trivial_outcome = "full success";
    } else if (0.95 <= roll && roll < 0.99){
        trivial_outcome = "success with minor complication"
    } else {
        trivial_outcome = "partial success or success with major complication"
    }

    if (roll < 0.75){
        easy_outcome = "full success"
    } else if (0.75 <= roll && roll < 0.95){
        easy_outcome = "success with complication"
    } else if (0.95 <= roll && roll < 0.99){
        easy_outcome = "routine failure"
    } else {
        easy_outcome = "failure with further complication"
    }

    if (roll < 0.30){
        difficult_outcome = "full success"
    } else if (0.30 <= roll && roll < 0.65){
        difficult_outcome = "success with complication"
    } else if (0.65 <= roll && roll < 0.95){
        difficult_outcome = "routine failure"
    } else {
        difficult_outcome = "failure with further complication"
    }

    if (roll < 0.10){
        arduous_outcome = "full success"
    } else if (0.10 <= roll && roll < 0.30){
        arduous_outcome = "success with complication"
    } else if (0.30 <= roll && roll < 0.80){
        arduous_outcome = "routine failure"
    } else {
        arduous_outcome = "failure with further complication"
    }
    return `[RANDOM OUTCOME BY MAIN TASK DIFFICULTY. Trivial: ${trivial_outcome}. Easy (odds in favor): ${easy_outcome}. Difficult (50/50): ${difficult_outcome}. Arduous (odds against you): ${arduous_outcome}. Use this to determine the outcome for the main challenge (most important, not necessarily the hardest). If there are secondary challenges, resolve as you see fit, regardless of random outcomes. If there are no unresolved challenges, ignore random outcome and narrate as you see fit.]`
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
        if (!context.chat[context.chat.length - 1].is_user){
            console.debug("not rolling - not a user message");
            return;
        }
        
        const roll = Math.random();
        console.log(`[SYSTEM: Current roll is ${roll}.]`);
        context.setExtensionPrompt(
            MODULE_NAME, getOutcome(roll), extension_prompt_types.IN_PROMPT, 9998, false, extension_prompt_roles.USER, null
        ); // key, value, position, depth, use_in_worldingo_scan, role, filter_func
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
