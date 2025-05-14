// Reference: https://expressive-code.com/reference/configuration/#using-an-ecconfigmjs-
// No typescript, see: https://github.com/expressive-code/expressive-code/issues/283

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
const config = {
  // https://expressive-code.com/key-features/word-wrap/#configuration
  defaultProps: {
    wrap: true,
    overridesByLang: {
      'bash,ps,sh,zsh': { preserveIndent: false },
    },
  },
  frames: {
    // https://expressive-code.com/key-features/frames/#file-name-comments
    extractFileNameFromCode: false,
  },
  styleOverrides: {
      borderRadius: '0.5rem',
      frames: {
        shadowColor: '#124',
      },
  },
};

export default config;
