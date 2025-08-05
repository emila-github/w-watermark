# w-watermark

一个轻量级的网页水印生成工具，支持自定义文本、样式和位置。

## 安装

```bash
npm install w-watermark
```

## 使用示例

### 在 Vue 项目中使用

```javascript
import Vue from 'vue'
import Watermark from 'w-watermark'

// 注册为全局指令
Vue.directive('watermark', Watermark)
```

在模板中使用:

```vue
<template>
  <div
    v-watermark="{
      text: 'Confidential\n内部资料',
      size: 16,
      color: 'rgba(0,0,0,0.1)',
      rotate: -20,
      xGap: 200,
      yGap: 150,
      autoResize: true,
    }"
  >
    <!-- 你的内容 -->
  </div>
</template>
```

## API

### 指令配置选项

当使用`v-watermark`指令时，可以传入以下配置选项：

- **text**: 水印文本内容，支持换行符`\n`（默认：'默认水印'）
- **color**: 文本颜色（默认：'rgba(100, 100, 100, 0.2)'）
- **size**: 字体大小，单位 px（默认：16）
- **fontFamily**: 字体（默认：'Arial'）
- **rotate**: 旋转角度，单位度（默认：-20）
- **width**: 水印宽度（默认：200）
- **height**: 水印高度（默认：200）
- **xGap**: 水平间距（默认：200）
- **yGap**: 垂直间距（默认：150）
- **zIndex**: 层级（默认：100000）
- **autoResize**: 是否自动调整水印以适应容器尺寸变化（默认：true）

## 许可证

MIT
