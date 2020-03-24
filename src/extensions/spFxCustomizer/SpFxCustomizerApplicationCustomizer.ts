import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';

import * as strings from 'SpFxCustomizerApplicationCustomizerStrings';
import { autobind } from 'office-ui-fabric-react';
import { IHeaderProps } from './components/IHeaderProps';
// import { Header } from './components/Header';
import SPFxHeader from './components/Header';
import { MessagePublisherBase } from '../../services/MessagePublisherBase';
import { ILocationMsg } from '../../services/ILocationMsg';
import { LocationMsgPublisher } from '../../services/LocationMsgPublisher';

const LOG_SOURCE: string = 'SpFxCustomizerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpFxCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

export interface ILocation {
  address: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpFxCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<ISpFxCustomizerApplicationCustomizerProperties>{
  //extends BaseApplicationCustomizer<ISpFxCustomizerApplicationCustomizerProperties> implements IDynamicDataCallables {
  private EVENT_SOURCEID = "2ed776e5-56a6-4ed5-84a1-d55e1a7804fd";
  private _currentSourceId: string;
  private _element: React.ReactElement<IHeaderProps>;

  private _headerPlaceholder: PlaceholderContent | undefined;
  private _location: ILocation = undefined;

  private _locationPublisher: LocationMsgPublisher;

  @override
  public onInit(): Promise<void> {
    return super.onInit()
      .then(() => {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        let message: string = this.properties.testMessage;
        if (!message) {
          message = '(No properties were provided.)';
        }
        this.context.placeholderProvider.changedEvent.add(this, this._renderHeader);

        //this.context.dynamicDataSourceManager.initializeSource(this);
        //this.context.dynamicDataSourceManager.initializeSource(this._locationPublisher);
        this._locationPublisher = new LocationMsgPublisher(this.context.dynamicDataSourceManager);

        //register command event
        if (this._registerEventSource() == false) {
          //subscribe the Source Chagned event if target web part isn't shown up.
          this.context.dynamicDataProvider.registerAvailableSourcesChanged(this._sourceChanged);
        }
      });
  }
  @autobind
  private _registerEventSource(): boolean {
    let ret = false;
    let sources = this.context.dynamicDataProvider.getAvailableSources();
    for (let source of sources) {
      console.log("source: " + source.id);
      if (source.id.indexOf(this.EVENT_SOURCEID) != -1) {
        this._currentSourceId = source.id;
        this.context.dynamicDataProvider.registerSourceChanged(source.id, this._commandChanged);
        ret = true;
        break;
      }
    }
    return ret;
  }
  @autobind
  private _commandChanged(): void {
    //this.context.dynamicDataProvider.registerPropertyChanged()
    let source = this.context.dynamicDataProvider.tryGetSource(this._currentSourceId);
    if (source != null) {
      let command = source.getPropertyValue("command");
      if (command.command == "showPanel") {
        //this._renderSpfxHeader(true);
        //this._element.props.showPanel = true;
        this._elem1.setState({
          showPanel: true
        });
      } else if (command.command == "hidePanel") {
        //this._renderSpfxHeader(false);
        this._element.props.showPanel = false;

      }
      //this.render();
    }
  }

  private _sourceChanged(): void {
    console.log("source changed");
    this._registerEventSource();
  }

  @autobind
  private _renderHeader(): void {
    if (!this._headerPlaceholder) {
      this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });

      if (this._headerPlaceholder == null) {
        console.error("Cannot find expected placeholder TOP");
      } else {
        this._renderSpfxHeader();
      }
    }
  }
  private _elem1: React.Component<IHeaderProps, React.ComponentState, any>;
  @autobind
  private _renderSpfxHeader(showPanel?: boolean): void {
    //const element: React.ReactElement<IHeaderProps> = React.createElement(
    this._element = React.createElement(
      SPFxHeader,
      {
        test: "",
        onLocationChanged: this._changeLocationHandler,
        showPanel: showPanel == null || showPanel == undefined ? undefined : showPanel
      }
    );

    this._elem1 = ReactDom.render(this._element, this._headerPlaceholder.domElement) as React.Component<IHeaderProps, React.ComponentState, any>;

  }
  @autobind
  private _changeLocationHandler(message: ILocationMsg): void {
    // this._location = {
    //     address: address
    // };
    this._locationPublisher.message = message;

    //this.context.dynamicDataSourceManager.notifyPropertyChanged("location");
  }

  // public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
  //     return [
  //         {
  //             id: 'location',
  //             title: 'Location'
  //         }
  //     ];
  // }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  // public getPropertyValue(propertyId: string): ILocation {
  //     switch (propertyId) {
  //         case 'location':
  //             return this._location != null ? this._location : undefined;
  //     }

  //     throw new Error('Bad property id');
  // }

  private _onDispose(): void {

  }
}
