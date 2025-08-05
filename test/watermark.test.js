const { Watermark } = require('../index');

describe('Watermark', () => {
  beforeEach(() => {
    // 创建测试容器
    document.body.innerHTML = '<div id="test-container"></div>';
    this.container = document.getElementById('test-container');
  });

  test('should create watermark instance with default options', () => {
    const watermark = new Watermark();
    expect(watermark).toBeInstanceOf(Watermark);
    expect(watermark.options.text).toBe('Watermark');
  });

  test('should apply watermark to container', () => {
    const watermark = new Watermark({ text: 'Test' });
    watermark.apply(this.container);

    // 验证水印元素是否被创建
    const watermarkElement = this.container.querySelector('.w-watermark');
    expect(watermarkElement).not.toBeNull();
  });

  test('should remove watermark from container', () => {
    const watermark = new Watermark();
    watermark.apply(this.container);
    watermark.remove();

    // 验证水印元素是否被移除
    const watermarkElement = this.container.querySelector('.w-watermark');
    expect(watermarkElement).toBeNull();
  });
});