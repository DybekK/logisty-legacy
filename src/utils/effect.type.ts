import { Effect } from 'effect'

export type RawEffect<E, A> = Effect.Effect<never, E, A>

export type SafeEffect<A> = RawEffect<never, A>

export type UnitEffect = RawEffect<never, void>
