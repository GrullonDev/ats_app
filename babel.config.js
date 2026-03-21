module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@services': './src/services',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@types': './src/types',
            '@assets': './assets',
            '@i18n': './src/i18n',
          },
        },
      ],
    ],
  };
};
