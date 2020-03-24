import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { DynamicDataSourceManager } from '@microsoft/sp-component-base';

export abstract class MessagePublisherBase<T> implements IDynamicDataCallables {
  protected _message: T;
  protected _propertyDefinition: IDynamicDataPropertyDefinition;
  protected _dynamicDataSourceManager: DynamicDataSourceManager;

  protected abstract get propertyDefinitions(): IDynamicDataPropertyDefinition[];
  protected abstract getDynamicPropertyValue(propertyId: string): T;

  public set message(val: T) {
    this._message = val;
    this._dynamicDataSourceManager.notifyPropertyChanged(this._propertyDefinition.id);
  }

  constructor(sourceManager: DynamicDataSourceManager) {
    this._dynamicDataSourceManager = sourceManager;
    this._dynamicDataSourceManager.initializeSource(this);
  }

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return this.getPropertyDefinitions();
  }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  public getPropertyValue(propertyId: string): T {
    return this.getDynamicPropertyValue(propertyId);
  }

  // public getAnnotatedPropertyValue?(propertyId: string): import("@microsoft/sp-dynamic-data").IDynamicDataAnnotatedPropertyValue {
  //     throw new Error("Method not implemented.");
  //   }

}
