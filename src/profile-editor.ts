async function run(): Promise<void> {
    const textArea = document.querySelector<HTMLTextAreaElement>('#profileCodeForm > textarea');
    const characterCount = document.querySelector('#characterCount');

    if (!textArea || !characterCount) {
        throw new Error(`No valid textarea/characterCount element found !`);
    }

    await render();

    new MutationObserver(function (mutations) {
        mutations.forEach(function () {
            inputValidation(textArea);
        });
    }).observe(characterCount, { childList: true });
}

async function render(): Promise<void> {
    const charCountWrapper = document.querySelector('#characterCountDiv');
    const giftButton = document.querySelector<HTMLButtonElement>('#giftButton');

    if (!charCountWrapper || !giftButton) {
        throw new Error(`No valid characterCountDiv/giftButton found !`);
    }

    let bytesCountWrapper = document.createElement('div');
    bytesCountWrapper.classList.add('pe-hidden');

    let bytesTitle = document.createElement('span');
    bytesTitle.textContent = 'Bytes';
    bytesTitle.classList.add('pe-hidden');

    let bytesMaxText = document.createElement('span');
    let bytesText = document.createElement('span');

    bytesCountWrapper.prepend(bytesMaxText);
    bytesCountWrapper.prepend(bytesText);

    charCountWrapper.prepend(bytesCountWrapper);
    charCountWrapper.prepend(bytesTitle);

    document.addEventListener('byteSizeChanged', async (event: any) => {
        const maxBytesError = event.detail.bytes > event.detail.maxBytes;

        !bytesTitle.classList.contains('pe-hidden')
            ? showBytesError(maxBytesError)
            : showBytesError(maxBytesError, false);

        maxBytesError ? bytesText.classList.add('pe-warning') : bytesText.classList.remove('pe-warning');

        bytesText.textContent = event.detail.bytes;
        bytesMaxText.textContent = ` / ${event.detail.maxBytes}`;
    });

    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'disabled') {
                bytesTitle.classList.toggle('pe-hidden');
                bytesCountWrapper.classList.toggle('pe-hidden');
            }
        });
    }).observe(giftButton, { attributes: true });
}

async function showBytesError(maxBytesError: boolean, showError: boolean = true): Promise<void> {
    const warningsWrapper = document.querySelector('#warnings');
    const errorDialog = document.querySelector('#errorDialog');

    if (!warningsWrapper || !errorDialog) {
        throw new Error(`No valid warningsDiv/errorDialog found !`);
    }

    let errorMessage = document.createElement('span');
    errorMessage.textContent = 'Too many bytes !';
    errorMessage.classList.add('pe-warning', 'pe-block');

    maxBytesError && showError ? warningsWrapper.prepend(errorMessage) : errorMessage.remove();

    warningsWrapper.contains(errorMessage)
        ? errorDialog.classList.add('pe-block')
        : errorDialog.classList.remove('pe-block');
}

async function inputValidation(textArea: HTMLTextAreaElement, maxBytes: number = 255): Promise<void> {
    const input = textArea.value.trimEnd();
    const rawBytes = new Blob([input]).size;
    const lines = input.split('\n');

    const byteSizeChanged = new CustomEvent('byteSizeChanged', {
        detail: {
            input,
            bytes: rawBytes + lines.length - 1,
            maxBytes,
        },
    });

    document.dispatchEvent(byteSizeChanged);
}

(async () => {
    run();
})();
