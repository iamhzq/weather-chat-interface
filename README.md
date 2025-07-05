# Weather Chat Interface

A modern, responsive weather chatbot interface built with React and Vite. Ask about the weather in any city, get forecasts, and enjoy a clean, desktop-friendly chat experience with dark/light theme support.


## Features

- **Streaming weather agent responses** with real-time buffering spinner and robust handling of newlines (no more `\n` in output)
- **Dark/Light theme toggle** with smooth transitions
- **Bot logo** and visually appealing chat header
- **Wider chat window** and improved contrast for desktop/Windows users
- **User and agent messages** aligned on opposite sides
- **Headings/labels** above each message bubble ("You" and "Weather Agent")
- **Auto-scroll** to latest message
- **Clear chat** button
- **Responsive design** for desktop and mobile

### Output Formatting Improvements
- Weather agent responses now display real newlines and clean formatting (no visible `\n` in the chat)
- Agent message bubble in light mode is now a darker gray for better contrast

## Getting Started

### Prerequisites
- Node.js (v16 or newer recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd weather-chat-interface
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## Project Structure

```
weather-chat-interface/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   │   └── react.svg, 7133364.png
│   ├── components/
│   │   ├── ChatWindow.jsx, ChatWindow.css
│   │   ├── MessageBubble.jsx, MessageBubble.css
│   │   └── MessageInput.jsx, MessageInput.css
│   └── services/
│       └── weatherApi.js
├── package.json
├── vite.config.js
└── README.md
```


## Customization
- **Bot logo:** Replace `src/assets/7133364.png` with your own image if desired.
- **Theme colors:** Adjust CSS variables in `App.css` and component CSS files.
- **Weather API:** Update logic in `src/services/weatherApi.js` to connect to your preferred weather data source. The streaming parser now ensures all `\n` are converted to real newlines for clean display.

## License

This project is for educational/demo purposes. You may adapt and use it as you wish.

---

Enjoy chatting with your weather agent!
