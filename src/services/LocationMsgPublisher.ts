import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { ILocationMsg } from './ILocationMsg';
import { MessagePublisherBase } from './MessagePublisherBase';

export class LocationMsgPublisher extends MessagePublisherBase<ILocationMsg> {
  public static LOCATION_MSG_ID = 'location';
  protected get propertyDefinitions(): IDynamicDataPropertyDefinition[] {
    return [{
      id: LocationMsgPublisher.LOCATION_MSG_ID,
      title: "Location",
      description: "The location publisher"
    }];
  }

  protected getDynamicPropertyValue(propertyId: string): ILocationMsg {
    let ret: ILocationMsg = null;
    if (propertyId == LocationMsgPublisher.LOCATION_MSG_ID) {
      ret = this._message;
    }
    return ret;

  }
}
