const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const isScriptConfig = (config) => {
  return config.entry && typeof config.entry === 'object' && !Array.isArray(config.entry);
};

module.exports = Array.isArray(defaultConfig)
  ? defaultConfig.map((config) => {
      if (isScriptConfig(config)) {
        return addMainEntry(config);
      }
      return config;
    })
  : addMainEntry(defaultConfig);

function addMainEntry(config) {
  if (typeof config.entry === 'function') {
    const origEntryFn = config.entry;
    config.entry = () => {
      const entries = origEntryFn();
      if (entries && typeof entries.then === 'function') {
        return entries.then((result) => ({
          ...result,
          index: './src/index.js',
        }));
      }
      return {
        ...entries,
        index: './src/index.js',
      };
    };
    return config;
  }

  if (config.entry && config.entry.index) {
    return config;
  }

  return {
    ...config,
    entry: {
      ...config.entry,
      index: './src/index.js',
    },
  };
}
