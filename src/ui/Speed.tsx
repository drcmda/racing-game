import { useEffect, useRef, useMemo } from 'react'
import { useStore, mutation } from '../store'

interface BackgroundProps extends React.HTMLAttributes<SVGSVGElement> {
  gaugeRef: React.ForwardedRef<SVGStopElement>
  offset: React.SVGAttributes<SVGStopElement>['offset']
}
interface NitroProps extends React.HTMLAttributes<SVGSVGElement> {
  boostRemaining: number
  boostColor: string
}

const Background = ({ offset, gaugeRef, ...props }: BackgroundProps): JSX.Element => (
  <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="progress" x1="1" y1="0" x2="0" y2="0">
        <stop id="stop1" offset={offset} ref={gaugeRef} stopColor="#1B3049" />
        <stop id="stop2" stopColor="#3EB4C8" />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40z" fill="url(#progress)" />
  </svg>
)

const Foreground = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40zm7.5 9.5v-5h9v5h-9zm24 0h-8v-5h8v5zm7-5v5h9v-5h-9zm16 0v5h9v-5h-9zm16-1v6h8v-6h-8zm16 0v6h8v-6h-8zm24 6h-9v-7h9v7zm15 0h-8v-8h8v8zm16 0h-9v-10h9v10zm16 0h-9v-11h9v11zm15 0h-9v-13l9-.5v13.5zm16 0h-9v-15l9-1v16zm15 0h-9v-17l9-1v18zm16 0h-10v-19l10-1v20zm16 0h-10v-21l10-2v23zm15.5 0h-9.5v-25L251 22v27.5zm16 0h-10v-29l10-3.5v32.5zm16 0h-10V15l10-4v38.5z"
      fill="#132237"
    />
  </svg>
)

const NitroBar = ({ boostRemaining, boostColor, ...props }: NitroProps): JSX.Element => (
  <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path className="nitro-bg-path" d="M13,12 L200,12" />
    <path
      className={`nitro-path ${boostRemaining <= 65 ? 'nitro-path-blink' : ''}`}
      stroke={boostRemaining > 80 ? '#00ff00' : boostColor}
      strokeDasharray={`${boostRemaining * 3.9}px`}
      d="M15,12 L198,12"
    />
    <text className="nitro-text" x="0" y="17px">
      <tspan>N</tspan>
    </text>
  </svg>
)

export function Speed(): JSX.Element {
  const textRef = useRef<HTMLSpanElement>(null)
  const gaugeRef = useRef<SVGStopElement>(null)
  const maxSpeed = useStore((state) => state.vehicleConfig.maxSpeed)
  const { boostRemaining } = useStore((state) => state.boost)
  const boostColor = useMemo(() => (boostRemaining <= 80 && boostRemaining >= 65 ? '#FFE600' : boostRemaining < 65 ? '#FF0000' : ''), [boostRemaining])

  let currentOffset = '1.00'
  let currentSpeed = '0'

  useEffect(() => {
    let frame: number
    const onFrame: FrameRequestCallback = () => {
      if (textRef.current && gaugeRef.current) {
        const computedSpeed = mutation.speed * 1.5

        const newOffset = `${Math.max(1 - computedSpeed / maxSpeed, 0).toFixed(2)}`
        if (newOffset !== currentOffset) {
          gaugeRef.current.setAttribute('offset', newOffset)
          currentOffset = newOffset
        }

        const newSpeed = `${computedSpeed.toFixed()}`
        if (newSpeed !== currentSpeed) {
          textRef.current.innerText = newSpeed
          currentSpeed = newSpeed
        }
      }
      frame = requestAnimationFrame(onFrame)
    }
    frame = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="speed">
      <div className="speed-gauge">
        <Background className="speed-background" offset={currentOffset} gaugeRef={gaugeRef} />
        <Foreground className="speed-foreground" />
      </div>
      <div className="speed-text">
        <span ref={textRef}>{currentSpeed}</span> mph
      </div>
      <div className="nitro-bar">
        <NitroBar boostRemaining={boostRemaining} boostColor={boostColor} />
      </div>
    </div>
  )
}
