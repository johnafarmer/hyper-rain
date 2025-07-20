# hyper-rain 🌧️

> Digital code rain for your Hyper terminal - because why should Neo have all the fun?

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="https://github.com/johnafarmer/hyper-rain/blob/main/hyper-rain.gif" alt="hyper-rain demo" width="600">
</p>

## 🤔 What is this?

`hyper-rain` brings that iconic green digital rain effect to your Hyper terminal! Inspired by the amazing [hyper-cat](https://github.com/Aaronius/hyper-cat), this plugin adds a touch of cyberpunk aesthetic to your coding sessions.

The effect activates whenever you type and gracefully fades away when you pause - it's subtle enough not to interfere with your work but cool enough to make you feel like a movie hacker.

## ✨ Features

- **Type-activated animation** - The rain starts when you type and fades when you stop
- **Customizable appearance** - Adjust opacity and blur to your liking
- **Customizable colors** - Change the rain and terminal colors to match your style
- **Performance optimized** - Smooth animations that won't slow down your terminal
- **Terminal theme integration** - Automatically applies themed colors during the effect

## 📦 Installation

1. Clone this repository and copy the hyper-rain folder to your /Users/yourusername/.hyper-plugins/local folder. (**Tip**:Press cmd + shift + . to show the hidden .hyper-plugins folder in finder)
2. Add `hyper-rain` to the local plugins array in your `~/.hyper.js` config file:

```javascript
module.exports = {
  // ... other config
  plugins: ['hyper-rain']
}
```

### Why Local Only? 😭

CBA TBH 🤷‍♂️ 

and the npm site thinks im a robot so i cant create an account to publish it 🥺 

i did try (for like 30 seconds 🫡)

## ⚙️ Configuration

You can customize the rain effect by adding a `hyperRain` section to your `~/.hyper.js` config:

```javascript
module.exports = {
  config: {
    // ... other config
    hyperRain: {
      opacity: 0.4,   // Rain overlay opacity (0.0 - 1.0, default: 0.4)
      blur: '0.5px',  // Terminal blur during effect (default: '0.5px')
      colors: {       // Color customization (all optional)
        rain: '#0F0', // Main rain color (default: '#0F0' - green)
        terminal: {
          foreground: '#0F0',  // Text color during effect
          cursor: '#0F0',      // Cursor color during effect
          enableEffect: true   // Enable/disable terminal color changes
        }
      }
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opacity` | number | `0.4` | Controls the transparency of the rain effect overlay |
| `blur` | string | `'0.5px'` | Applies a blur filter to the terminal content during the effect |
| `colors.rain` | string | `'#0F0'` | The color of the digital rain (hex format) |
| `colors.terminal.foreground` | string | `'#0F0'` | Terminal text color during the effect |
| `colors.terminal.cursor` | string | `'#0F0'` | Terminal cursor color during the effect |
| `colors.terminal.enableEffect` | boolean | `true` | Enable/disable terminal color changes during rain effect |

### Color Examples

```javascript
// Classic Matrix green (default)
hyperRain: {
  colors: {
    rain: '#0F0'
  }
}

// Cyberpunk blue
hyperRain: {
  colors: {
    rain: '#00F0FF',
    terminal: {
      foreground: '#00F0FF',
      cursor: '#00F0FF'
    }
  }
}

// Red alert mode
hyperRain: {
  colors: {
    rain: '#FF0000',
    terminal: {
      foreground: '#FF0000',
      cursor: '#FF0000'
    }
  }
}

// Purple haze
hyperRain: {
  colors: {
    rain: '#A020F0',
    terminal: {
      foreground: '#A020F0',
      cursor: '#A020F0'
    }
  }
}

// Rain only - no terminal color changes
hyperRain: {
  colors: {
    rain: '#FFD700', // Gold rain
    terminal: {
      enableEffect: false
    }
  }
}
```

## 🎮 How it Works

The plugin creates a canvas overlay on top of your terminal that:
1. Detects when you're typing
2. Spawns falling characters at random positions
3. Animates them downward with a cool trailing effect
4. Fades out the entire effect ~250ms after you stop typing

The rain characters include authentic Japanese katakana (カタカナ) mixed with numbers and Latin letters, just like in the movies!

## 🤝 Contributing

Found a bug? Have an idea for an improvement? Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [hyper-cat](https://github.com/Aaronius/hyper-cat) - the OG of fun Hyper plugins
- The Hyper terminal team - for making terminals fun

---

<p align="center">Made by John ✌️ & Claude 🧡</p>
