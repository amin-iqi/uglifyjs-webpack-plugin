import UglifyJsPlugin from '../src/index';
import {
  cleanErrorStack,
  createCompiler,
  compile,
} from './helpers';

describe('when applied with `test` option', () => {
  let compiler;

  beforeEach(() => {
    compiler = createCompiler({
      entry: {
        js: `${__dirname}/fixtures/entry.js`,
        mjs: `${__dirname}/fixtures/entry.mjs`,
        importExport: `${__dirname}/fixtures/import-export/entry.js`,
        AsyncImportExport: `${__dirname}/fixtures/async-import-export/entry.js`,
      },
      output: {
        path: `${__dirname}/dist`,
        filename: '[name].js?var=[hash]',
        chunkFilename: '[id].[name].js?ver=[hash]',
      },
    });
  });

  it('matches snapshot with empty value', () => {
    new UglifyJsPlugin().apply(compiler);

    return compile(compiler).then((stats) => {
      const errors = stats.compilation.errors.map(cleanErrorStack);
      const warnings = stats.compilation.warnings.map(cleanErrorStack);

      expect(errors).toMatchSnapshot('errors');
      expect(warnings).toMatchSnapshot('warnings');

      for (const file in stats.compilation.assets) {
        if (Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)) {
          expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
        }
      }
    });
  });

  it('matches snapshot for a single `test` value', () => {
    new UglifyJsPlugin({
      test: /(m)?js\.js(\?.*)?$/i,
    }).apply(compiler);

    return compile(compiler).then((stats) => {
      const errors = stats.compilation.errors.map(cleanErrorStack);
      const warnings = stats.compilation.warnings.map(cleanErrorStack);

      expect(errors).toMatchSnapshot('errors');
      expect(warnings).toMatchSnapshot('warnings');

      for (const file in stats.compilation.assets) {
        if (Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)) {
          expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
        }
      }
    });
  });

  it('matches snapshot for multiple `test` values', () => {
    new UglifyJsPlugin({
      test: [
        /(m)?js\.js(\?.*)?$/i,
        /AsyncImportExport\.js(\?.*)?$/i,
      ],
    }).apply(compiler);

    return compile(compiler).then((stats) => {
      const errors = stats.compilation.errors.map(cleanErrorStack);
      const warnings = stats.compilation.warnings.map(cleanErrorStack);

      expect(errors).toMatchSnapshot('errors');
      expect(warnings).toMatchSnapshot('warnings');

      for (const file in stats.compilation.assets) {
        if (Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)) {
          expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
        }
      }
    });
  });
});
