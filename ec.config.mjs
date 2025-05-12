// Reference: https://expressive-code.com/reference/configuration/#using-an-ecconfigmjs-

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
  // themes: ['ayu-dark'],
  styleOverrides: {
      borderRadius: '0.5rem',
      frames: {
        shadowColor: '#124',
      },
  },
}
