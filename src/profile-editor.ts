async function run(): Promise<void> {
    const textArea = document.querySelector('#profileCodeForm > textarea') as HTMLTextAreaElement;
    const characterCount = document.querySelector('#characterCount') as HTMLElement;

    if (!textArea || !characterCount) {
        throw new Error(`No valid textarea/characterCount element found !`);
    }

    render();

    characterCount.addEventListener('DOMSubtreeModified', async () => {
        inputValidation(textArea);
    });
    characterCount.dispatchEvent(new Event('DOMSubtreeModified', { bubbles: true }));
}

async function render(): Promise<void> {
    const charCountWrapper = document.querySelector('#characterCountDiv');

    if (!charCountWrapper) {
        throw new Error(`No valid characterCountDiv found !`);
    }

    let bytesCountWrapper = document.createElement('div');
    let bytesTitle = document.createElement('span');
    bytesTitle.textContent = 'Bytes';

    charCountWrapper.prepend(bytesCountWrapper);
    charCountWrapper.prepend(bytesTitle);

    document.addEventListener('byteSizeChanged', async (event: any) => {
        const maxBytesError = event.detail.bytes > event.detail.maxBytes;

        bytesCountWrapper.innerHTML = `<span class='${maxBytesError ? 'pe-warning' : ''}'>
        ${event.detail.bytes}</span> / ${event.detail.maxBytes}`;
    });
}

async function inputValidation(textArea: HTMLTextAreaElement, maxBytes: number = 255): Promise<void> {
    const input = textArea.value;
    const bytes = new Blob([input]).size;

    const byteSizeChanged = new CustomEvent('byteSizeChanged', {
        detail: {
            input,
            bytes,
            maxBytes,
        },
    });

    document.dispatchEvent(byteSizeChanged);
}

(async () => {
    await run();
})();
