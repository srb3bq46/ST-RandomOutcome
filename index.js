const MODULE_NAME = 'auto-d100';

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

    eventSource.on(event_types.GENERATION_STARTED, async () => {
        const roll = rollD100();

        console.log(`[${MODULE_NAME}] Rolled ${roll}`);

        // Store for macros / persistence
        chatMetadata.auto_d100 = roll;

        await saveMetadata();

        // Inject into prompt
        context.setExtensionPrompt(
            MODULE_NAME,
            `[SYSTEM: Current d100 roll is ${roll}. Use it for uncertainty resolution.]`,
            'system'
        );
    });
});
