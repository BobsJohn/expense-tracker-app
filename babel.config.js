module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/store': './src/store',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/localization': './src/localization',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};