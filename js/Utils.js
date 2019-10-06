// @flow

const LAYOUT_TYPES = ['vertical', 'horizontal', 'carousel'];

export default {

  styleToCss(style: Object): string {
    let cssStr = '';

    if (style) {
      if (style.color) {
        cssStr += `color:${style.color};`;
      }

      if (style['background-color']) {
        cssStr += `background-color:${style['background-color']};`;
      }

      if (style.bold) {
        cssStr += 'font-weight:bold;';
      }

      if (style.italic) {
        cssStr += 'font-style:italic;';
      }

      if (style.size) {
        cssStr += `font-size:${this.sizeToPx(style.size)}px;`;
      }
    }

    return cssStr;
  },

  splitBackgroundColorFromOtherStyles(originalStyle: string): Object {
    let style = originalStyle;
    const backgroundColorIndex = style.indexOf('background-color');
    let backgroundColorStyle = '';
    if (backgroundColorIndex > -1) {
      backgroundColorStyle = style.substr(backgroundColorIndex, style.indexOf(';', backgroundColorIndex) - (backgroundColorIndex - 1)); // add backgroundColorStyle to div container
      style = style.replace(backgroundColorStyle, ''); // remove backgroundColorStyle from span
    }
    return {
      backgroundColorStyle,
      style,
    };
  },

  sizeToPx(size: string): number {
    switch (size) {
      case 'small':
        return 11;
      case 'medium':
        return 13;
      case 'large':
        return 17;
      default:
        return 13;
    }
  },

  validateParameters(config: Object, ...params: string[]) {
    if (!config.type) {
      throw new Error('Missing configuration: type');
    }

    params.forEach((param) => {
      if (config[param] === undefined) {
        throw new Error(`Missing configuration: ${param} is a mandatory for element of type ${config.type}`);
      }
    });
  },

  isString(val: any): boolean {
    return (val instanceof String || typeof val === 'string');
  },

  isLayout(type: string) {
    return LAYOUT_TYPES.indexOf(type) >= 0;
  },

  normalizeHtmlText(text: string): string {
    let normalized = text;
    if (text) {
      normalized = normalized.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    }
    return normalized;
  },

  escapeHtml(text: string): string {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
    };

    return text.replace(/[&<>"'`=/]/g, s => map[s]);
  },

  hasClass(el: HTMLElement, className: string) {
    if (el.classList && el.classList.contains) {
      return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
  },

  addClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!this.hasClass(el, className)) {
      el.className += ` ${className}`; // eslint-disable-line no-param-reassign
    }
  },

  removeClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (this.hasClass(el, className)) {
      const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
      el.className = el.className.replace(reg, ' '); // eslint-disable-line no-param-reassign
    }
  },
};
