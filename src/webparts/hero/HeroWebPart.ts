import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDynamicField,
  IWebPartPropertiesMetadata,
  PropertyPaneDynamicFieldSet
} from '@microsoft/sp-webpart-base';

import { DynamicProperty } from '@microsoft/sp-component-base';

import * as strings from 'HeroWebPartStrings';
import Hero from './components/Hero';
import { IHeroProps } from './components/IHeroProps';
import { autobind } from 'office-ui-fabric-react';
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';
import { SingleMessageSubscriber } from '../../services/SingleMessageSubscriber';
import { ILocationMsg } from '../../services/ILocationMsg';
import { LocationMsgPublisher } from '../../services/LocationMsgPublisher';

export interface IHeroWebPartProps {
  description: string;
  //location: DynamicProperty<string>;
  location1: any;
}

export interface ICommand {
  command: string;
}

export default class HeroWebPart extends BaseClientSideWebPart<IHeroWebPartProps> implements IDynamicDataCallables {
  private EVENT_SOURCEID = "0c6626f9-6c11-4d8d-82ee-1be30f37f7fc";//"f173f388-0013-40f7-85ee-e8136ae19cf1";
  private _currentSourceId: string;
  private _command: ICommand = undefined;
  private _locationSubscriber: SingleMessageSubscriber<ILocationMsg>;

  protected onInit() {
    return super.onInit()
      .then(() => {
        //register command dynamic property
        this.context.dynamicDataSourceManager.initializeSource(this);

        if (this._registerEventSource() == false)
          this.context.dynamicDataProvider.registerAvailableSourcesChanged(this._sourceChanged);
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
        //this.context.dynamicDataProvider.registerSourceChanged(source.id, this._locationChanged);
        this._locationSubscriber = new SingleMessageSubscriber(this.context.dynamicDataProvider,
          source,
          LocationMsgPublisher.LOCATION_MSG_ID,
          this._locationSubscriberHandler);
        ret = true;
        break;
      }
    }
    return ret;
  }
  @autobind
  private _locationSubscriberHandler(val: ILocationMsg): void {
    this.properties.location1 = val;
    this.render();
  }
  @autobind
  private _locationChanged(): void {
    //this.context.dynamicDataProvider.registerPropertyChanged()
    let source = this.context.dynamicDataProvider.tryGetSource(this._currentSourceId);
    if (source != null) {
      this.properties.location1 = source.getPropertyValue("location");
      this.render();
    }
  }

  private _sourceChanged(): void {
    console.log("source changed");
    this._registerEventSource();
  }

  @autobind
  private _sendCommand(command: string): void {
    this._command = {
      command: command
    };

    this.context.dynamicDataSourceManager.notifyPropertyChanged("command");
  }

  public render(): void {
    const element: React.ReactElement<IHeroProps> = React.createElement(
      Hero,
      {
        description: this.properties.description,
        // location: this.properties.location.tryGetValue(),
        location1: this.properties.location1,
        onCommand: this._sendCommand
      }
    );

    ReactDom.render(element, this.domElement);
  }
  // protected get propertiesMetadata(): IWebPartPropertiesMetadata {
  //     return {
  //         // Specify the web part properties data type to allow the address
  //         // information to be serialized by the SharePoint Framework.
  //         'location': {
  //             dynamicPropertyType: 'string'
  //         }
  //     };
  // }

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      {
        id: 'command',
        title: 'command'
      }
    ];
  }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  public getPropertyValue(propertyId: string): ICommand {
    switch (propertyId) {
      case 'command':
        return this._command != null ? this._command : undefined;
      default:
        throw new Error('Bad property id');
        break;
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })

              ]
            }//,
            // {
            //     groupName: "second Group",
            //     groupFields: [
            //         PropertyPaneDynamicFieldSet(
            //             {
            //                 label: "select location source",
            //                 fields: [
            //                     PropertyPaneDynamicField('location', {
            //                         label: "Location"
            //                     })

            //                 ]
            //             }
            //         )

            //     ]
            // }
          ]
        }
      ]
    };
  }
}
