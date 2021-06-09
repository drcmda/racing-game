import { useEffect } from 'react'
import { useStore, cameras } from '../store'

function useKeys(keyConfig) {
  useEffect(() => {
    const keyMap = keyConfig.reduce((out, { keys, fn, up = true }) => {
      keys.forEach((key) => (out[key] = { fn, pressed: false, up }))
      return out
    }, {})

    const downHandler = ({ key }) => {
      if (!keyMap[key]) return

      const { fn, pressed, up } = keyMap[key]
      keyMap[key].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = ({ key }) => {
      if (!keyMap[key]) return

      const { fn, up } = keyMap[key]
      keyMap[key].pressed = false
      if (up) fn(false)
    }

    window.addEventListener('keydown', downHandler, { passive: true })
    window.addEventListener('keyup', upHandler, { passive: true })

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [keyConfig])
}

export function KeyboardControls() {
  const set = useStore((state) => state.set)

  useKeys([
    {
      keys: ['ArrowUp', 'w', 'W'],
      fn: (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })),
    },
    {
      keys: ['ArrowDown', 's', 'S'],
      fn: (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })),
    },
    {
      keys: ['ArrowLeft', 'a', 'A'],
      fn: (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })),
    },
    {
      keys: ['ArrowRight', 'd', 'D'],
      fn: (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })),
    },
    {
      keys: [' '],
      fn: (brake) => set((state) => ({ ...state, controls: { ...state.controls, brake } })),
    },
    {
      keys: ['h', 'H'],
      fn: (honk) => set((state) => ({ ...state, controls: { ...state.controls, honk } })),
    },
    {
      keys: ['Shift'],
      fn: (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost } })),
    },
    {
      keys: ['r', 'R'],
      fn: (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })),
    },
    {
      keys: ['e', 'E'],
      fn: () => set((state) => ({ ...state, editor: !state.editor })),
      up: false,
    },
    {
      keys: ['i', 'I'],
      fn: () => set((state) => ({ ...state, help: !state.help })),
      up: false,
    },
    {
      keys: ['m', 'M'],
      fn: () => set((state) => ({ ...state, map: !state.map })),
      up: false,
    },
    {
      keys: ['c', 'C'],
      fn: () =>
        set((state) => {
          const current = cameras.indexOf(state.camera)
          const next = (current + 1) % cameras.length
          const camera = cameras[next]
          return { ...state, camera }
        }),
      up: false,
    },
  ])

  return null
}
