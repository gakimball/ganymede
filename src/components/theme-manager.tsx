import { platform } from '@tauri-apps/api/os';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks'
import { useEventHandler } from '../hooks/use-event-handler';
import { Command } from '@tauri-apps/api/shell';

/**
 * @todo Does not work yet because Bootstrap has a lot of hardcoded colors
 */
export const ThemeManager = memo(() => {
  const getTheme = useEventHandler(async () => {
    if (await platform() === 'darwin') {
      const cmd = new Command('read-macos-theme', 'read -g AppleAccentColor')
      const output = await cmd.execute()

      console.log(`Output is ${output.stdout}`)

      if (/\d/.test(output.stdout)) {
        document.body.classList.add(`macos-theme-${output.stdout.trim()}`)
      }
    }
  })

  useEffect(() => {
    getTheme()
  }, [getTheme])

  return null
})
