import { flexible } from 'modern-flexible'

flexible({
  rootValue: 16,
  distinctDevice: [
    { deviceWidthRange: [375, 750], UIWidth: 375, isDevice: (w) => w <= 767 },
    {
      deviceWidthRange: [1535, 1920],
      UIWidth: 1920,
      isDevice: (w) => w > 767,
    },
  ],
})
