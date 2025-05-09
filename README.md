This extension provides countdown timers for the JEE and NEET exams, allowing users to track the time remaining until each exam. Users can customize their preferences to show or hide countdowns based on their interests.

## Installation ( Stable )

<p align="center">
    <a href="https://github.com/NovatraX/exam-countdown-extension/releases/"><img src="https://img.shields.io/badge/GitHub-blue?style=for-the-badge&logo=github&logoColor=white&labelColor=grey&color=blue" alt="Download from GitHub" height="47" /></a>
    <a href="https://chromewebstore.google.com/detail/mhjcpnnmmalddidegkfcempomlpkkdan"><img src="https://github.com/user-attachments/assets/20a6e44b-fd46-4e6c-8ea6-aad436035753" alt="Download from Chrome Web Store" height="48" /></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/exam-countdown/"><img src="https://github.com/user-attachments/assets/c0e99e6b-97cf-4af2-9737-099db7d3538b" alt="Download from Mozilla Add-ons" height="48" /></a>
</p>

## Installation ( BETA )

1. **Download** the `.zip` from [Releases](https://github.com/NovatraX/jee-neet-extension/releases/).
2. **Extract** it to a folder.
3. Open `chrome://extensions/`.
4. **Enable Developer Mode** (top right).
5. Click **"Load unpacked"** and select the extracted folder.

## Features

- Countdown timers for JEE and NEET exams.
- User preferences to show/hide countdowns based on interest.
- Popup interface for quick access to countdowns.
- Option to open countdowns in a new tab.
- Simple and user-friendly design.
- Add and track your own personalized exam dates alongside the predefined ones
- Play any spotify playlist/music or youtube video as background music.


## Usage
- Click on the extension icon to open the popup and view the countdowns.
- Access the options page to set your preferences for displaying countdowns.
- Use the countdown page for a detailed view, which can be opened in a new tab.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## Local Development

### Prerequisites
Before beginning, install `pnpm` globally (if not already installed):

```bash
npm install -g pnpm
```

### Install Dependencies
Install the required dependencies for the project:

```bash
pnpm install
```

### Development 
To develop for **Firefox**, set the `TARGET_BROWSER` environment variable before running the dev server:

```bash
export TARGET_BROWSER=firefox  # Linux/macOS
set TARGET_BROWSER=firefox     # Windows (Command Prompt)
$env:TARGET_BROWSER="firefox"  # Windows (PowerShell)
```

Then start the development server:

```bash
pnpm dev
```

This will launch Firefox with your extension loaded. The page will automatically reload whenever you make changes to your code.

### Build for Production
This command builds your extension for production. It optimizes and bundles your extension, preparing it for deployment to the target browser's store.

```bash
pnpm build
```

### Linting
After building, you can run the linter on the production files in the `dist/` directory to check for issues:

```bash
pnpm lint dist/
```
