import { platform } from '@tauri-apps/api/os';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks'
import { useEventHandler } from '../../hooks/use-event-handler';
import { Command } from '@tauri-apps/api/shell';
import { useTauriEvent } from '../../hooks/use-tauri-event';

export const ThemeManager = memo(() => {
  const getTheme = useEventHandler(async () => {
    if (await platform() === 'darwin') {
      const cmd = new Command('read-macos-theme', 'read -g AppleAccentColor')
      const output = await cmd.execute()

      if (/(-1|\d)/.test(output.stdout)) {
        document.body.classList.add(`macos-theme-${output.stdout.trim()}`)
      }
    }
  })

  useEffect(() => {
    getTheme()
  }, [getTheme])

  useTauriEvent('tauri://blur', () => {
    document.body.classList.add('window-inactive')
  })

  useTauriEvent('tauri://focus', () => {
    document.body.classList.remove('window-inactive')
  })

  return null
})
