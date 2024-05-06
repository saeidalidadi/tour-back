import * as yaml from 'js-yaml';
import { join } from 'path';
import { readFileSync } from 'fs';
const YAML_CONFIG_FILENAME = '.env.yaml';

export default () => {
  const decoder = new TextDecoder('utf-8');
  const config = yaml.load(
    decoder.decode(readFileSync(join(process.cwd(), YAML_CONFIG_FILENAME))),
  );
  return config;
};
