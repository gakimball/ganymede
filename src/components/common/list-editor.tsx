import { FunctionComponent, VNode } from 'preact';
import { Button } from './button';
import { useCallback } from 'preact/hooks';
import { useEventHandler } from '../../hooks/use-event-handler';

interface ListEditorProps<T> {
  defaultValue: T;
  render: (value: T, onChange: (value: T) => void) => VNode<any>;
  value: T[];
  onChange: (value: T[]) => void;
  hasReorder?: boolean;
}

export const ListEditor = <T,>({
  defaultValue,
  render,
  value,
  onChange,
  hasReorder,
}: ListEditorProps<T>) => {
  const addItem = useEventHandler(() => {
    onChange([
      ...value,
      defaultValue,
    ])
  })

  const editItem = useEventHandler((index: number, item: T) => {
    const next = [...value]
    next.splice(index, 1, item)
    onChange(next)
  })

  const moveItemUp = useEventHandler((index: number) => {
    if (index === 0) return
    const next = [...value]
    const item = next.splice(index, 1)
    next.splice(index - 1, 0, ...item)
    onChange(next)
  })

  const moveItemDown = useEventHandler((index: number) => {
    if (index === value.length - 1) return
    const next = [...value]
    const item = next.splice(index, 1)
    next.splice(index + 1, 0, ...item)
    onChange(next)
  })

  const removeItem = useEventHandler((index: number) => {
    const next = [...value]
    next.splice(index, 1)
    onChange(next)
  })

  return (
    <>
      {value.map((item, index, arr) => (
        <div className="flex gap-2">
          {render(
            item,
            change => editItem(index, change)
          )}
          {hasReorder && (
            <>
              <Button
                theme="secondary"
                isDisabled={index === 0}
                onClick={() => moveItemUp(index)}
              >
                Up
              </Button>
              <Button
                theme="secondary"
                isDisabled={index === arr.length - 1}
                onClick={() => moveItemDown(index)}
              >
                Dn
              </Button>
            </>
          )}
          <Button
            theme="danger"
            onClick={() => removeItem(index)}
          >
            Del
          </Button>
        </div>
      ))}
      <div>
        <Button onClick={addItem}>
          Add
        </Button>
      </div>
    </>
  )
}
