This extension is designed to work exclusively on the [3DX Chat Profile Editor](https://status.3dxchat.net/profile-editor) page and is not active on any other sites. It will not interact with or affect any other web pages.

Below are instructions for installing the extension in Chrome and Firefox.

## What Does This Extension Do?

The 3DX Chat Profile Gift Enhancer extension adds a byte-counter to the bottom-left corner of the [3DX Chat Profile Editor](https://status.3dxchat.net/profile-editor) page. This functionality aims to address the following problem:

-   The existing character count often does not provide an accurate reflection, especially when using custom fonts or symbols that can be larger than a single byte.
-   When pre-editing your gift in the editor with a custom font, you may still encounter issues when sending the gift in 3DX Chat even though you are within the allowed character range. This is because 3DX Chat imposes a byte limit of approximately 255. The extension's byte-counter ensures that your content will fit within this limit.

### Screenshots

#### Gift preview with custom fonts and with byte limit in range

[OK](./demo/Screenshot%20-%20OK.jpg)

#### Gift preview with custom fonts and with byte limit exceeded

[ERROR](./demo/Screenshot%20-%20NOT%20OK.jpg)

## Installation Guide (Local Installation Only !)

### For Google Chrome

#### Step 1: Download the ZIP File

1. Go to the [releases page](https://github.com/PixelNini/3dx-chat-profile-gift-enhancer/releases).
2. Find the latest release and download the ZIP file to your local machine.

#### Step 2: Extract the ZIP File

1. Navigate to the location where you downloaded the ZIP file.
2. Right-click on the ZIP file and select 'Extract All...' or use your preferred method to extract the contents.

#### Step 3: Load the Extension into Chrome

1. Open the Google Chrome browser.
2. In the address bar, type `chrome://extensions/` and press Enter.
3. Turn on 'Developer mode' by toggling the switch in the top right corner.
4. Click the 'Load unpacked' button.
5. Navigate to the directory where you extracted the ZIP file and select the folder containing the extension files.
6. Click 'Select,' and the extension should now be loaded into your Chrome browser.

#### Step 4: Verify the Installation

1. You should now see the '3DX Chat Profile Gift Enhancer' extension listed in your extensions.
2. Verify it's enabled and visit the [3DX Chat Profile Editor](https://status.3dxchat.net/profile-editor) page, you should see the byte-counter once you clicked on `Gif preview`.

### For Firefox (Developer Edition Only)

> **Note:** The Firefox version of this extension has not been tested and is not signed. Therefore, it can only be installed in the Firefox Developer Edition.

#### Step 1: Download the ZIP File

Same as the Chrome instructions.

#### Step 2: Extract the ZIP File

Same as the Chrome instructions.

#### Step 3: Load the Extension into Firefox Developer Edition

1. Open Firefox Developer Edition.
2. In the address bar, type `about:debugging` and press Enter.
3. Click 'This Firefox' on the left side.
4. Click 'Load Temporary Add-on...' and navigate to the directory where you extracted the ZIP file.
5. Select the manifest file for the extension.
6. The extension should now be loaded into your Firefox Developer Edition browser.

## Troubleshooting

If you encounter any issues during installation, please [open an issue](https://github.com/PixelNini/3dx-chat-profile-gift-enhancer/issues) in this repository describing the problem, and I will do my best to assist you.

## License

This project is licensed under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

I welcome contributions! See the [CONTRIBUTING.md](CONTRIBUTING.md) file for how to get involved.
