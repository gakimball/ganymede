import { FileEntry, writeFile } from '@tauri-apps/api/fs';
import { basename, join } from '@tauri-apps/api/path';

const EMPTY_CONFIG_FILE = `
%rec: View
%allowed: Name Layout Type File Sort Filter Group Fields Sum Render Full_Page
%mandatory: Name Layout
%type: Layout enum Table Board List
%type: Full_Page bool

%rec: Favorite
%allowed: File View
%mandatory: File
`.trim()

export const getOrCreateConfigFile = async (files: FileEntry[], dir: string): Promise<FileEntry> => {
  const configFile = files.find(file => file.name === '_ganymede.rec')

  if (configFile) {
    return configFile
  }

  const configFilePath = await join(dir, '_ganymede.rec')
  await writeFile(configFilePath, EMPTY_CONFIG_FILE)

  return {
    path: configFilePath,
    name: await basename(configFilePath),
  }
}
