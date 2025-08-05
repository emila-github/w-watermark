// 添加WeakMap存储每个元素的观察器实例，避免全局冲突
const elementObservers = new WeakMap();

// 默认配置
function defaultOptions() {
  return {
    text: '默认水印',
    color: 'rgba(100, 100, 100, 0.2)',
    size: 16, // 文字大小，单位px
    width: 200, // 水印宽度
    height: 200, // 水印高度
    fontFamily: 'Arial',
    rotate: -20, // 旋转角度
    xGap: 200, // 水平间距
    yGap: 150, // 垂直间距
    zIndex: 100000,
    // 添加新配置：是否自动调整水印以适应容器尺寸变化
    autoResize: true,
  }
}

// 水印容器 class 名
function waterMarkName() {
  return 'kms-water-mark'
}

// 水印容器样式
function waterMarkStyle(options) {
  const style = {
    'display': 'block',
    'position': 'absolute',
    'left': '0',
    'top': '0',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none',
    'background-repeat': 'repeat',
    'z-index': options.zIndex,
    // 添加盒模型约束，确保宽高包含内边距和边框
    'box-sizing': 'border-box',
    // 防止背景图溢出
    'background-clip': 'padding-box'
  }
  const styleArr = Object.keys(style).map((key) => `${key}:${style[key]}`)
  return styleArr.join(';') + ';'
}

// 设置水印
function setWaterMark(el, binding) {
  // 移除已存在的水印
  const existingWatermark = el.querySelector(`.${waterMarkName()}`)
  if (existingWatermark) {
    el.removeChild(existingWatermark)
  }
  
  const options = { ...defaultOptions(), ...binding.value }
  
  // 确保父元素有定位属性并隐藏溢出内容
  const computedStyle = getComputedStyle(el)
  if (computedStyle.position === 'static') {
    el.style.position = 'relative'
  }
  // 强制设置溢出隐藏，防止水印超出
  if (computedStyle.overflow !== 'hidden') {
    el.style.overflow = 'hidden'
  }
  
  // 创建canvas（使用局部变量而非全局变量）
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${options.size}px ${options.fontFamily}`
  
  // 将文本按换行符分割成多行
  const lines = options.text.split('\n')
  const lineHeight = options.size * 1.2 // 行高设为字体大小的1.2倍
  let maxLineWidth = 0
  
  // 计算最长行的宽度
  lines.forEach(line => {
    const lineWidth = ctx.measureText(line).width
    maxLineWidth = Math.max(maxLineWidth, lineWidth)
  })
  
  // 设置canvas尺寸（文本宽度+左右边距40px，高度根据行数计算）
  const canvasWidth = Math.max(options.width || 0, maxLineWidth + 40, options.xGap)
  const canvasHeight = Math.max(lines.length * lineHeight + 20, options.yGap)
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  
  // 重新设置上下文，确保字体样式生效
  ctx.font = `${options.size}px ${options.fontFamily}`
  ctx.fillStyle = options.color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.rotate((options.rotate * Math.PI) / 180)
  
  // 绘制多行文本
  lines.forEach((line, index) => {
    const yPosition = (index - (lines.length - 1) / 2) * lineHeight + canvasHeight / 2
    ctx.fillText(line, 20, yPosition) // 将x坐标从canvasWidth/2改为20px左内边距
  })
  
  const dataUrl = canvas.toDataURL('image/png')
  
  // 创建水印元素（使用局部变量而非全局变量）
  const waterMarkEl = document.createElement('div')
  waterMarkEl.className = waterMarkName()
  waterMarkEl.style.cssText = waterMarkStyle(options)
  waterMarkEl.style.backgroundImage = `url(${dataUrl})`
  
  el.appendChild(waterMarkEl)
  return waterMarkEl
}

// 创建观察器
function createObserver(el, binding, waterMarkEl) {
  // 从WeakMap获取元素对应的观察器
  let observers = elementObservers.get(el);
  if (observers) {
    // 断开已存在的观察器
    observers.mutationObserver.disconnect();
    if (observers.resizeObserver) {
      observers.resizeObserver.disconnect();
    }
  }

  // 创建MutationObserver监控水印元素是否被移除
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.removedNodes && [...mutation.removedNodes].includes(waterMarkEl)) {
        const newWaterMarkEl = setWaterMark(el, binding);
        createObserver(el, binding, newWaterMarkEl);
      }
    }
  });

  mutationObserver.observe(el, {
    childList: true,
    subtree: false
  });

  // 创建ResizeObserver监控容器尺寸变化
  let resizeObserver = null;
  if (binding.value.autoResize !== false) {
    resizeObserver = new ResizeObserver(() => {
      setWaterMark(el, binding);
    });
    resizeObserver.observe(el);
  }

  // 存储观察器实例到WeakMap
  elementObservers.set(el, {
    mutationObserver,
    resizeObserver
  });
}

function init(el, binding) {
  const waterMarkEl = setWaterMark(el, binding);
  createObserver(el, binding, waterMarkEl);

  // 添加初始尺寸检查，确保首次渲染正确
  setWaterMark(el, binding);
}

export default {
  bind(el, binding) {
    init(el, binding);
  },
  update(el, binding) {
    if (JSON.stringify(binding.oldValue) !== JSON.stringify(binding.value)) {
      init(el, binding);
    }
  },
  unbind(el) {
    // 从WeakMap获取并断开所有观察器
    const observers = elementObservers.get(el);
    if (observers) {
      observers.mutationObserver.disconnect();
      if (observers.resizeObserver) {
        observers.resizeObserver.disconnect();
      }
      elementObservers.delete(el);
    }
  }
}