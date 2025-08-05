# w-watermark

一个轻量级的网页水印生成工具，支持自定义文本、样式和位置。

## 安装

```bash
npm install w-watermark
```

## 使用示例

```javascript
const { Watermark } = require('w-watermark')

// 初始化水印
const watermark = new Watermark({
  text: 'Confidential', // 水印文本
  fontSize: 16, // 字体大小
  color: 'rgba(0,0,0,0.1)', // 颜色
  rotate: -15, // 旋转角度
  density: 20, // 密度（越小越密集）
})

// 应用到页面
watermark.apply(document.body)

// 移除水印
// watermark.remove();
```

## API

### Watermark(options)

- **options.text**: 水印文本内容（默认：'Watermark'）
- **options.fontSize**: 字体大小（默认：14）
- **options.color**: 文本颜色（默认：'rgba(128,128,128,0.1)'）
- **options.rotate**: 旋转角度（默认：-15）
- **options.density**: 水印密度（默认：20）

### apply(container)

将水印应用到指定容器

### remove()

移除已应用的水印

## 许可证

MIT
