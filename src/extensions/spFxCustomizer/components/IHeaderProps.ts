import { ILocationMsg } from "../../../services/ILocationMsg";

export interface IHeaderProps {
  test?: string;
  onLocationChanged: (location: ILocationMsg) => void;
  showPanel?: boolean;
}
