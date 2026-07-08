
// const config = {
//   plugins: {
//     "@tailwindcss/postcss": {},
//   },
// };

// export default config;
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Add autoprefixer for browser compatibility
    autoprefixer: {},
    // Add cssnano for production optimization
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                minifyFontValues: { removeQuotes: false },
                // Optimize CSS output
                calc: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                discardOverridden: true,
                mergeLonghand: true,
                mergeRules: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeString: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: true,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true,
              },
            ],
          },
        }
      : {}),
  },
};
export default config;