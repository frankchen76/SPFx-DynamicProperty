import {
  IDynamicDataPropertyDefinition,
  IDynamicDataSource,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { DynamicDataProvider } from '@microsoft/sp-component-base';
import { autobind } from 'office-ui-fabric-react';


export class SingleMessageSubscriber<T>{
  private _dynamicDataProvider: DynamicDataProvider;
  private _dynamicDataSource: IDynamicDataSource;
  private _dyanmicDataProperty: string;
  private _callback: (val: T) => void;

  constructor(dataProvider: DynamicDataProvider, dynamicDataSource: IDynamicDataSource, dynamicDataProperty: string, callback: (val: T) => void) {
    this._dyanmicDataProperty = dynamicDataProperty;
    this._dynamicDataSource = dynamicDataSource;
    this._dynamicDataProvider = dataProvider;
    this._callback = callback;
    this._dynamicDataProvider.registerPropertyChanged(this._dynamicDataSource.id, this._dyanmicDataProperty, this._dynamicDataCallback);
  }

  @autobind
  private _dynamicDataCallback(): void {
    const val = this._dynamicDataSource.getPropertyValue(this._dyanmicDataProperty);
    this._callback(val);
  }

}
