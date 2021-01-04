export function isEmpty(value: unknown): boolean {
  return value === null || value === '' || value === undefined;
}

export function isEqualText(value: unknown, value2: unknown): boolean {
  return JSON.stringify(value) === JSON.stringify(value2);
}

// Theme class name: nu-component-theme
export function getThemeClassName(componentName: string, themes: string[] = [], options: string[] = []): string {
  const componentCls = 'nu-' + componentName;
  let cls = [componentCls];
  themes.forEach((theme) => cls.push(componentCls + '-' + theme));
  cls = cls.concat(options);
  return cls.join(' ');
}

export function debounce(callback: any, wait: number, context: any = null) {
  let timeout: number | null;
  return (...args: any[]) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      timeout = null;
      callback.apply(context, args);
    }, wait);
  };
}
