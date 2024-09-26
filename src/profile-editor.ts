import { StorageHelper } from './storage-helper';

/**
 * Extension script for managing color picker and byte counter functionality.
 * This script adds the ability to save colors, display saved colors,
 * and provides a byte counter for text area input.
 */
const SELECTORS = {
    textArea: '#profileCodeForm > textarea',
    characterCount: '#characterCount',
    colorPicker: '#colorPicker',
    predefinedColorsHeader: '#colorModal .form-group > h5',
    characterCountDiv: '#characterCountDiv',
    giftButton: '#giftButton',
    warnings: '#warnings',
    errorDialog: '#errorDialog',
};

interface ByteSizeChangedEventDetail {
    bytes: number;
    maxBytes: number;
}

(async function main(): Promise<void> {
    try {
        await initialize();
    } catch (error) {
        console.error('An error occurred during initialization:', error);
    }
})();

async function initialize(): Promise<void> {
    const textArea = document.querySelector<HTMLTextAreaElement>(SELECTORS.textArea);
    const characterCount = document.querySelector<HTMLElement>(SELECTORS.characterCount);
    const colorPicker = document.querySelector<HTMLInputElement>(SELECTORS.colorPicker);

    if (!textArea || !characterCount || !colorPicker) {
        throw new Error('Required DOM elements not found');
    }

    const storageHelper = new StorageHelper('local');
    const savedColors: string[] = (await storageHelper.get<string[]>('savedColors')) || [];

    const colorManager = new ColorManager(colorPicker, savedColors, storageHelper);
    colorManager.init();

    const byteCounter = new ByteCounter(textArea, characterCount);
    byteCounter.init();
}

class ColorManager {
    private colorPicker: HTMLInputElement;
    private savedColors: string[];
    private storageHelper: StorageHelper;

    private savedColorsHeader: HTMLHeadingElement | null = null;
    private savedColorsList: HTMLUListElement | null = null;
    private noColorsMessage: HTMLParagraphElement | null = null;

    constructor(colorPicker: HTMLInputElement, savedColors: string[], storageHelper: StorageHelper) {
        this.colorPicker = colorPicker;
        this.savedColors = savedColors;
        this.storageHelper = storageHelper;
    }

    public init(): void {
        this.addSaveButton();
        this.renderSavedColors();
    }

    private addSaveButton(): void {
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.id = 'colorSaveButton';
        saveButton.classList.add('color-save-button');

        this.colorPicker.insertAdjacentElement('afterend', saveButton);

        saveButton.addEventListener('click', async () => {
            await this.saveColor(this.colorPicker.value);
        });
    }

    /**
     * Saves a new color to storage and updates the saved colors list.
     * @param color - The color value to save.
     */
    private async saveColor(color: string): Promise<void> {
        if (!this.savedColors.includes(color)) {
            this.savedColors.push(color);
            await this.storageHelper.set('savedColors', this.savedColors);
            this.renderSavedColors();
        }
    }

    private renderSavedColors(): void {
        const predefinedColorsHeader = document.querySelector<HTMLElement>(SELECTORS.predefinedColorsHeader);

        if (!predefinedColorsHeader) {
            console.error('Predefined colors header not found');
            return;
        }

        const predefinedColorsList = predefinedColorsHeader.nextElementSibling as HTMLUListElement;
        if (!predefinedColorsList || predefinedColorsList.tagName.toLowerCase() !== 'ul') {
            console.error('Predefined colors list not found');
            return;
        }

        if (!this.savedColorsHeader) {
            this.createSavedColorsElements(predefinedColorsList);
        }

        if (this.savedColorsHeader && this.savedColorsList && this.noColorsMessage) {
            this.updateSavedColorsList();
        }
    }

    /**
     * Creates the UI elements for displaying saved colors.
     * @param predefinedColorsList - The existing list of predefined colors.
     */
    private createSavedColorsElements(predefinedColorsList: HTMLUListElement): void {
        this.savedColorsHeader = document.createElement('h5');
        this.savedColorsHeader.id = 'savedColorsHeader';
        this.savedColorsHeader.textContent = 'Saved colors';

        this.noColorsMessage = document.createElement('p');
        this.noColorsMessage.id = 'noColorsMessage';
        this.noColorsMessage.textContent = 'No saved colors.';
        this.noColorsMessage.classList.add('no-colors-message');

        this.savedColorsList = document.createElement('ul');
        this.savedColorsList.id = 'savedColorsList';

        predefinedColorsList.insertAdjacentElement('afterend', this.savedColorsHeader);
        this.savedColorsHeader.insertAdjacentElement('afterend', this.noColorsMessage);
        this.noColorsMessage.insertAdjacentElement('afterend', this.savedColorsList);
    }

    /**
     * Updates the saved colors list UI based on the current saved colors.
     */
    private updateSavedColorsList(): void {
        if (!this.savedColorsHeader || !this.savedColorsList || !this.noColorsMessage) {
            return;
        }

        this.savedColorsList.innerHTML = '';

        if (this.savedColors.length === 0) {
            this.noColorsMessage.style.display = 'block';
            this.savedColorsList.style.display = 'none';
        } else {
            this.noColorsMessage.style.display = 'none';
            this.savedColorsList.style.display = 'block';

            this.savedColors.forEach((color, index) => {
                const listItem = this.createSavedColorListItem(color, index);
                this.savedColorsList!.appendChild(listItem);
            });
        }
    }

    /**
     * Creates a list item element for a saved color.
     * @param color - The color value.
     * @param index - The index of the color in the saved colors array.
     * @returns The created list item element.
     */
    private createSavedColorListItem(color: string, index: number): HTMLLIElement {
        const li = document.createElement('li');
        li.classList.add('saved-color-item');
        li.setAttribute('data-color', color);

        const colorText = document.createElement('span');
        colorText.classList.add('saved-color-text');
        colorText.textContent = `Custom color ${index + 1} (${color})`;
        colorText.style.color = color;

        colorText.addEventListener('click', () => {
            this.colorPicker.value = color;
        });

        const deleteButton = document.createElement('span');
        deleteButton.textContent = ' x';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            await this.deleteColor(index);
        });

        li.appendChild(colorText);
        li.appendChild(deleteButton);

        return li;
    }

    /**
     * Deletes a color from saved colors and updates the UI.
     * @param index - The index of the color to delete.
     */
    private async deleteColor(index: number): Promise<void> {
        this.savedColors.splice(index, 1);
        await this.storageHelper.set('savedColors', this.savedColors);
        this.renderSavedColors();
    }
}

class ByteCounter {
    private textArea: HTMLTextAreaElement;
    private characterCount: HTMLElement;
    private maxBytes: number = 255;

    private bytesTitle!: HTMLSpanElement;
    private bytesCountWrapper!: HTMLDivElement;
    private bytesText!: HTMLSpanElement;
    private bytesMaxText!: HTMLSpanElement;

    private giftButton!: HTMLButtonElement;

    constructor(textArea: HTMLTextAreaElement, characterCount: HTMLElement) {
        this.textArea = textArea;
        this.characterCount = characterCount;
    }

    /**
     * Initializes the byte counter by setting up the UI and event listeners.
     */
    public init(): void {
        this.setupByteCounterUI();
        this.setupEventListeners();
        this.validateInput();
    }

    /**
     * Sets up the UI elements for the byte counter.
     */
    private setupByteCounterUI(): void {
        const charCountWrapper = document.querySelector<HTMLElement>(SELECTORS.characterCountDiv);
        const giftButton = document.querySelector<HTMLButtonElement>(SELECTORS.giftButton);

        if (!charCountWrapper || !giftButton) {
            console.error('Character count div or gift button not found');
            return;
        }

        this.giftButton = giftButton;

        this.bytesTitle = document.createElement('span');
        this.bytesTitle.textContent = 'Bytes';
        this.bytesTitle.classList.add('pe-hidden');

        this.bytesCountWrapper = document.createElement('div');
        this.bytesCountWrapper.classList.add('pe-hidden');

        this.bytesText = document.createElement('span');
        this.bytesMaxText = document.createElement('span');

        this.bytesCountWrapper.appendChild(this.bytesText);
        this.bytesCountWrapper.appendChild(this.bytesMaxText);

        charCountWrapper.prepend(this.bytesCountWrapper);
        charCountWrapper.prepend(this.bytesTitle);
    }

    /**
     * Sets up event listeners for input validation and UI updates.
     */
    private setupEventListeners(): void {
        this.textArea.addEventListener('input', () => this.validateInput());

        document.addEventListener('byteSizeChanged', (event: Event) =>
            this.onByteSizeChanged(event as CustomEvent<ByteSizeChangedEventDetail>),
        );

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'disabled') {
                    this.bytesTitle.classList.toggle('pe-hidden');
                    this.bytesCountWrapper.classList.toggle('pe-hidden');
                }
            });
        }).observe(this.giftButton, { attributes: true });

        new MutationObserver(() => {
            this.validateInput();
        }).observe(this.characterCount, { childList: true });
    }

    /**
     * Handles the byteSizeChanged event to update the UI accordingly.
     * @param event - The custom event containing byte size details.
     */
    private onByteSizeChanged(event: CustomEvent<ByteSizeChangedEventDetail>): void {
        const { bytes, maxBytes } = event.detail;
        const isOverLimit = bytes > maxBytes;

        this.bytesText.textContent = bytes.toString();
        this.bytesMaxText.textContent = ` / ${maxBytes}`;

        if (isOverLimit) {
            this.bytesText.classList.add('pe-warning');
        } else {
            this.bytesText.classList.remove('pe-warning');
        }

        if (!this.bytesTitle.classList.contains('pe-hidden')) {
            this.showBytesError(isOverLimit);
        }
    }

    /**
     * Displays or hides the byte limit error message.
     * @param isOverLimit - Whether the byte limit has been exceeded.
     */
    private showBytesError(isOverLimit: boolean): void {
        const warningsWrapper = document.querySelector<HTMLElement>(SELECTORS.warnings);
        const errorDialog = document.querySelector<HTMLElement>(SELECTORS.errorDialog);

        if (!warningsWrapper || !errorDialog) {
            console.error('Warnings wrapper or error dialog not found');
            return;
        }

        let errorMessage = warningsWrapper.querySelector<HTMLSpanElement>('.byte-error-message');

        if (isOverLimit) {
            if (!errorMessage) {
                errorMessage = document.createElement('span');
                errorMessage.textContent = 'Too many bytes!';
                errorMessage.classList.add('pe-warning', 'pe-block', 'byte-error-message');
                warningsWrapper.prepend(errorMessage);
                errorDialog.classList.add('pe-block');
            }
        } else if (errorMessage) {
            errorMessage.remove();
            if (!warningsWrapper.querySelector('.pe-warning')) {
                errorDialog.classList.remove('pe-block');
            }
        }
    }

    /**
     * Validates the input in the text area and dispatches a custom event with byte size details.
     */
    private validateInput(): void {
        const input = this.textArea.value.trimEnd();
        const encoder = new TextEncoder();
        const encodedInput = encoder.encode(input);
        const rawBytes = encodedInput.length;
        const lines = input.split('\n').length;

        const totalBytes = rawBytes + lines - 1;

        const byteSizeChangedEvent = new CustomEvent<ByteSizeChangedEventDetail>('byteSizeChanged', {
            detail: {
                bytes: totalBytes,
                maxBytes: this.maxBytes,
            },
        });

        document.dispatchEvent(byteSizeChangedEvent);
    }
}
