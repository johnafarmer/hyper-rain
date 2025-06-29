# hyper-rain 🌧️

> Digital code rain for your Hyper terminal - because why should Neo have all the fun?

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="https://github.com/johnafarmer/hyper-rain/blob/main/hyper-rain.gif" alt="hyper-rain demo" width="600">
</p>

## 🎭 What is this?

`hyper-rain` brings that iconic green digital rain effect to your Hyper terminal! Inspired by the amazing [hyper-cat](https://github.com/Aaronius/hyper-cat), this plugin adds a touch of cyberpunk aesthetic to your coding sessions.

The effect activates whenever you type and gracefully fades away when you pause - it's subtle enough not to interfere with your work but cool enough to make you feel like a movie hacker.

## ✨ Features

- **Type-activated animation** - The rain starts when you type and fades when you stop
- **Customizable appearance** - Adjust opacity and blur to your liking
- **Performance optimized** - Smooth animations that won't slow down your terminal
- **Green terminal theme** - Automatically applies green colors during the effect

## 📦 Installation

### Using Hyper's CLI

```bash
hyper install hyper-rain
```

### Manual Installation

Add `hyper-rain` to the plugins array in your `~/.hyper.js` config file:

```javascript
module.exports = {
  // ... other config
  plugins: ['hyper-rain']
}
```

## ⚙️ Configuration

You can customize the rain effect by adding a `hyperRain` section to your `~/.hyper.js` config:

```javascript
module.exports = {
  config: {
    // ... other config
    hyperRain: {
      opacity: 0.4,   // Rain overlay opacity (0.0 - 1.0, default: 0.4)
      blur: '0.5px'   // Terminal blur during effect (default: '0.5px')
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opacity` | number | `0.4` | Controls the transparency of the rain effect overlay |
| `blur` | string | `'0.5px'` | Applies a blur filter to the terminal content during the effect |

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
