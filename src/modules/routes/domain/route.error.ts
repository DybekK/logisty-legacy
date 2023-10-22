import { OSRMErrorCode } from "src/infrastructure/osrm/osrm.error";

export class MatchRouteError {
  readonly message: string = 'Error matching points'

  constructor(
    public readonly response: string,
    public readonly code: OSRMErrorCode
  ) {}
}
