import fs from 'fs';
import path from 'path';
import glob from 'glob';

type Options = {
  langDir?: string;
  vueDir?: string;
};

function extractTranslationKeys(dir: string): Set<string> {
  const langFiles = glob.sync(`${dir}/**/*.json`);
  const keys = new Set<string>();

  langFiles.forEach((file) => {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    Object.keys(content).forEach((key) => keys.add(key));
  });

  return keys;
}

function checkUnusedKeys(langDir: string, vueDir: string): Set<string> {
  const translationKeys = extractTranslationKeys(langDir);
  const vueFiles = glob.sync(`${vueDir}/**/*.vue`);

  vueFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    translationKeys.forEach((key) => {
      if (content.includes(key)) {
        translationKeys.delete(key);
      }
    });
  });

  return translationKeys;
}

function VitePluginLocalizationChecker(options: Options = {}): object {
  const { langDir = 'lang', vueDir = 'resources/js' } = options;

  return {
    name: 'vite-plugin-localization-checker',
    buildEnd() {
      const unusedKeys = checkUnusedKeys(langDir, vueDir);

      if (unusedKeys.size > 0) {
        console.warn('Unused translation keys:');
        unusedKeys.forEach((key) => console.warn(`- ${key}`));
      } else {
        console.log('All translation keys are being used.');
      }
    },
  };
}

export default VitePluginLocalizationChecker;
