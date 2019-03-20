import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    BaseClientSideWebPart,
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {
    IDynamicDataPropertyDefinition,
    IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { PrimaryButton, autobind } from 'office-ui-fabric-react';

import * as strings from 'LocationSourceWebPartStrings';
import LocationSource from './components/LocationSource';
import { ILocationSourceProps } from './components/ILocationSourceProps';

export interface ILocationSourceWebPartProps {
    description: string;
}

export interface ILocation {
    address: string;
}

export default class LocationSourceWebPart extends BaseClientSideWebPart<ILocationSourceWebPartProps> implements IDynamicDataCallables {
    private _location: ILocation = undefined;

    protected onInit(): Promise<void> {
        // register this web part as dynamic data source
        this.context.dynamicDataSourceManager.initializeSource(this);

        return Promise.resolve();
    }

    public render(): void {
        const element: React.ReactElement<ILocationSourceProps> = React.createElement(
            LocationSource,
            {
                onLocation: this._onLocationHandler
            }
        );

        ReactDom.render(element, this.domElement);
    }
    @autobind
    private _onLocationHandler(address: string): void {
        this._location = {
            address: address
        };

        this.context.dynamicDataSourceManager.notifyPropertyChanged("location");
    }

    public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
        return [
            {
                id: 'location',
                title: 'Location'
            }
        ];
    }

    /**
     * Return the current value of the specified dynamic data set
     * @param propertyId ID of the dynamic data set to retrieve the value for
     */
    public getPropertyValue(propertyId: string): ILocation {
        switch (propertyId) {
            case 'location':
                return this._location ? this._location : undefined;
        }

        throw new Error('Bad property id');
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
                        }
                    ]
                }
            ]
        };
    }
}
