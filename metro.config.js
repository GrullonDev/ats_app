const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ignorar archivos temporales de macOS (Apple Double) en discos ExFAT
const blockList = config.resolver.blockList;
const macosIgnore = /.*\/\._.*/;

if (Array.isArray(blockList)) {
  config.resolver.blockList = [...blockList, macosIgnore];
} else if (blockList instanceof RegExp) {
  config.resolver.blockList = [blockList, macosIgnore];
} else {
  config.resolver.blockList = [macosIgnore];
}

module.exports = config;
