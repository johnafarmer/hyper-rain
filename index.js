const DEFAULT_RAIN_COLOR = '#2D88C9';
const CHAR_SIZE = 14;

const ACTIVE_DURATION = 250;
const TYPING_CHECK_INTERVAL = 100; // Check for changes every 100ms

let globalConfig = {
  opacity: 0.4,  // Slightly increased opacity for better visibility
  blur: '0.5px',
  colors: {
    rain: DEFAULT_RAIN_COLOR,
    terminal: {
      foreground: '#2D88C9',
      cursor: '#2D88C9',
      enableEffect: true
    }
  }
};

exports.decorateTerm = (Term, { React, notify }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.onDecorated = this.onDecorated.bind(this);
      this.onCursorMove = this.onCursorMove.bind(this);
      this.state = {
        rainActive: false
      };
      this._raindrops = [];
      this._overlay = null;
      this._canvas = null;
      this._ctx = null;
      this._animationId = null;
      this._lastTime = 0;
      this._activeTimeout = null;
      this._matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ🦅✨🏔️';
    }
    
    // Helper function to convert hex color to RGB values
    _hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 255, b: 0 }; // Default to green if parsing fails
    }

    onDecorated(term) {
      if (this.props.onDecorated) {
        this.props.onDecorated(term);
      }
      
      this._termDiv = term ? term.termRef : null;
      
      if (this._termDiv) {
        // Store reference to this instance for middleware access
        const termElement = this._termDiv.querySelector('.term_term');
        if (termElement) {
          termElement.__matrixRainInstance = this;
        }
        
        // Also store globally as backup
        if (!window.__hyperRainInstances) {
          window.__hyperRainInstances = [];
        }
        window.__hyperRainInstances.push(this);
        
        this._initOverlay();
        this._initCanvas();
        this._initRain();
        this._startAnimation();
        this._startContentMonitoring();
      } else {
      }
    }

    _initOverlay() {
      this._overlay = document.createElement('div');
      this._overlay.classList.add('hyper-rain-overlay');
      this._termDiv.insertBefore(this._overlay, this._termDiv.firstChild);
    }
    
    _initCanvas() {
      this._canvas = document.createElement('canvas');
      this._canvas.style.position = 'absolute';
      this._canvas.style.top = '0';
      this._canvas.style.left = '0';
      this._canvas.style.zIndex = '0';
      this._canvas.style.pointerEvents = 'none';
      this._ctx = this._canvas.getContext('2d');
      
      const updateCanvasSize = () => {
        if (this._overlay && this._termDiv) {
          // Make overlay visible temporarily to get measurements
          const wasActive = this._overlay.classList.contains('hyper-rain-active');
          if (!wasActive) {
            this._overlay.classList.add('hyper-rain-active');
          }
          
          const rect = this._overlay.getBoundingClientRect();
          
          if (!wasActive) {
            this._overlay.classList.remove('hyper-rain-active');
          }
          
          if (rect.width > 0 && rect.height > 0) {
            this._canvas.width = rect.width;
            this._canvas.height = rect.height;
            this._initRain();
          } else {
            setTimeout(updateCanvasSize, 100);
          }
        }
      };
      
      // Wait a bit for DOM to settle
      setTimeout(updateCanvasSize, 50);
      window.addEventListener('resize', updateCanvasSize);
      
      this._overlay.appendChild(this._canvas);
    }

    _initRain() {
      if (!this._canvas) return;
      
      const columns = Math.floor(this._canvas.width / CHAR_SIZE);
      this._raindrops = [];
      
      for (let i = 0; i < columns; i++) {
        this._raindrops.push({
          x: i * CHAR_SIZE,
          y: Math.random() * -100 * CHAR_SIZE,
          speed: Math.random() * 2 + 1,
          chars: [],
          brightness: Math.random() * 0.5 + 0.5
        });
      }
    }

    _drawRain(timestamp) {
      if (!this._ctx || !this._canvas) {
        return;
      }
      
      const deltaTime = timestamp - this._lastTime;
      this._lastTime = timestamp;
      
      // Only fade when rain is active
      if (this.state.rainActive) {
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      } else {
        // Clear canvas when not active
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }
      
      if (!this.state.rainActive) return;
      
      this._ctx.font = `${CHAR_SIZE}px ${this.props.fontFamily || 'monospace'}`;
      
      this._raindrops.forEach(drop => {
        drop.y += drop.speed * deltaTime * 0.05;
        
        if (drop.y > this._canvas.height + 100) {
          drop.y = Math.random() * -100 * CHAR_SIZE;
          drop.chars = [];
          drop.speed = Math.random() * 2 + 1;
          drop.brightness = Math.random() * 0.5 + 0.5;
        }
        
        if (Math.random() > 0.95) {  // Increased from 0.98 to 0.95 for more characters
          const char = this._matrixChars[Math.floor(Math.random() * this._matrixChars.length)];
          drop.chars.push({
            char,
            y: drop.y,
            opacity: 1
          });
        }
        
        drop.chars = drop.chars.filter(char => {
          char.opacity -= 0.01;
          return char.opacity > 0;
        });
        
        drop.chars.forEach((char, index) => {
          const rgb = this._hexToRgb(globalConfig.colors.rain);
          const brightness = char.opacity * drop.brightness * 1.3; // Increased brightness by 30%
          const clampedBrightness = Math.min(1, brightness); // Ensure we don't exceed 1
          this._ctx.fillStyle = `rgba(${Math.floor(rgb.r * clampedBrightness)}, ${Math.floor(rgb.g * clampedBrightness)}, ${Math.floor(rgb.b * clampedBrightness)}, ${char.opacity})`;
          this._ctx.fillText(char.char, drop.x, char.y);
        });
        
        if (drop.chars.length === 0 && Math.random() > 0.99) {
        }
        
        if (drop.chars.length > 0) {
          const lastChar = drop.chars[drop.chars.length - 1];
          this._ctx.shadowBlur = 8;
          this._ctx.shadowColor = globalConfig.colors.rain;
          this._ctx.fillStyle = '#FFF';
          this._ctx.fillText(lastChar.char, drop.x, lastChar.y);
          this._ctx.shadowBlur = 0;
        }
      });
    }

    _startAnimation() {
      const animate = (timestamp) => {
        this._drawRain(timestamp);
        this._animationId = requestAnimationFrame(animate);
      };
      this._animationId = requestAnimationFrame(animate);
    }

    onCursorMove(cursorFrame) {
      if (this.props.onCursorMove) {
        this.props.onCursorMove(cursorFrame);
      }
      
      this.updateRainEffect(true);
    }
    
    updateRainEffect(typing) {
      if (typing) {
        if (!this.state.rainActive) {
          this.setState({ rainActive: true });
          if (this._overlay) {
            this._overlay.classList.add('hyper-rain-active');
          }
          if (this._termDiv) {
            this._termDiv.classList.add('hyper-rain-terminal-active');
          }
        }
        
        clearTimeout(this._activeTimeout);
        this._activeTimeout = setTimeout(() => {
          this.setState({ rainActive: false });
          if (this._overlay) {
            this._overlay.classList.remove('hyper-rain-active');
          }
          if (this._termDiv) {
            this._termDiv.classList.remove('hyper-rain-terminal-active');
          }
        }, ACTIVE_DURATION);
      }
    }

    _startContentMonitoring() {
      let lastContent = '';
      this._contentCheckInterval = setInterval(() => {
        if (this._termDiv) {
          const currentContent = this._termDiv.textContent || '';
          if (currentContent !== lastContent) {
            this.updateRainEffect(true);
            lastContent = currentContent;
          }
        }
      }, TYPING_CHECK_INTERVAL);
    }
    
    componentWillUnmount() {
      if (this._animationId) {
        cancelAnimationFrame(this._animationId);
      }
      if (this._contentCheckInterval) {
        clearInterval(this._contentCheckInterval);
      }
      // Clean up instance reference
      if (this._termDiv) {
        const termElement = this._termDiv.querySelector('.term_term');
        if (termElement && termElement.__matrixRainInstance === this) {
          delete termElement.__matrixRainInstance;
        }
      }
      // Clean up global reference
      if (window.__hyperRainInstances) {
        const index = window.__hyperRainInstances.indexOf(this);
        if (index > -1) {
          window.__hyperRainInstances.splice(index, 1);
        }
      }
    }

    render() {
      // Helper to convert hex color to rgba
      const hexToRgba = (hex, alpha) => {
        const rgb = this._hexToRgb(hex);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      };
      
      // Determine terminal colors based on configuration
      const terminalColors = globalConfig.colors.terminal.enableEffect && this.state.rainActive ? {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        cursorColor: hexToRgba(globalConfig.colors.terminal.cursor, 0.8),
        foregroundColor: hexToRgba(globalConfig.colors.terminal.foreground, 1)
      } : {
        backgroundColor: this.props.backgroundColor,
        cursorColor: this.props.cursorColor,
        foregroundColor: this.props.foregroundColor
      };
      
      return [
        React.createElement(Term, Object.assign({}, this.props, {
          onDecorated: this.onDecorated,
          onCursorMove: this.onCursorMove,
          ...terminalColors
        })),
        React.createElement('style', {}, `
          .hyper-rain-overlay {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            pointer-events: none;
          }
          
          .hyper-rain-terminal-active .term_fit .term_term {
            background: transparent !important;
          }
          
          .hyper-rain-terminal-active > div > div {
            background: transparent !important;
          }
          
          .hyper-rain-overlay.hyper-rain-active {
            display: block;
            opacity: ${globalConfig.opacity};
            filter: blur(${globalConfig.blur});
          }
          
          .hyper-rain-overlay canvas {
            width: 100%;
            height: 100%;
          }
        `)
      ];
    }
  };
};

exports.decorateConfig = (config) => {
  const rainConfig = config.hyperRain || {};
  globalConfig.opacity = rainConfig.opacity || 0.4;
  globalConfig.blur = rainConfig.blur || '0.5px';
  
  // Parse color configuration
  if (rainConfig.colors) {
    // Rain color
    if (rainConfig.colors.rain) {
      globalConfig.colors.rain = rainConfig.colors.rain;
    }
    
    // Terminal colors
    if (rainConfig.colors.terminal) {
      if (rainConfig.colors.terminal.foreground) {
        globalConfig.colors.terminal.foreground = rainConfig.colors.terminal.foreground;
      }
      if (rainConfig.colors.terminal.cursor) {
        globalConfig.colors.terminal.cursor = rainConfig.colors.terminal.cursor;
      }
      if (typeof rainConfig.colors.terminal.enableEffect === 'boolean') {
        globalConfig.colors.terminal.enableEffect = rainConfig.colors.terminal.enableEffect;
      }
    }
  }
  
  return Object.assign({}, config, {
    css: `
      ${config.css || ''}
    `
  });
};

// Redux middleware to catch ALL terminal activity
exports.middleware = (store) => (next) => (action) => {
  // Trigger on any terminal data changes
  if (action.type === 'SESSION_USER_DATA' || 
      action.type === 'SESSION_PTY_DATA' || 
      action.type === 'SESSION_ADD_DATA' ||
      action.type === 'SESSION_SET_ACTIVE' ||
      action.type === 'TERM_WRITE') {
    
    // Try multiple methods to find rain instances
    const instances = [];
    
    // Method 1: Look for stored instances on term elements
    const terms = document.querySelectorAll('.term_term');
    terms.forEach(term => {
      if (term.__matrixRainInstance) {
        instances.push(term.__matrixRainInstance);
      }
    });
    
    // Method 2: Look for instances stored globally
    if (window.__hyperRainInstances) {
      instances.push(...window.__hyperRainInstances);
    }
    
    // Trigger rain on all found instances
    instances.forEach(instance => {
      if (instance && instance.updateRainEffect) {
        instance.updateRainEffect(true);
      }
    });
  }
  
  return next(action);
};