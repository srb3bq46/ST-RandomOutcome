import {
    eventSource,
    event_types,
    getContext
} from '../../../../script.js';

let lastRoll = null;

function rollD100() {
    return Math.floor(Math.random() * 100) + 1;
}

function injectRoll(context) {
    if (lastRoll === null) return;

    // Inject into Author's Note or system prompt
    // This becomes visible to the AI
    const injection = `Current d100 roll result: ${lastRoll}`;

    context.setExtensionPrompt(
        'auto-d100',
        injection,
        1,
        1
    );
}

eventSource.on(event_types.USER_MESSAGE_RENDERED, async () => {
    lastRoll = rollD100();

    console.log(`[AutoD100] Rolled: ${lastRoll}`);

    const context = getContext();

    injectRoll(context);
});
