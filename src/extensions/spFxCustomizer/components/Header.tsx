import * as React from 'react';
import styles from './Header.module.scss';
import { IHeaderProps } from './IHeaderProps';
import { IHeaderState } from './IHeaderState';
import { escape } from '@microsoft/sp-lodash-subset';
import {
    PrimaryButton,
    DefaultButton,
    autobind,
    Button,
    Panel,
    PanelType,
    ChoiceGroup,
    IChoiceGroupOption
} from 'office-ui-fabric-react';


export default class SPFxHeader extends React.Component<IHeaderProps, IHeaderState> {
    private _selectedLocation: string;
    constructor(props: IHeaderProps) {
        super(props);
        this.state = {
            showPanel: this.props.showPanel != null && this.props.showPanel != undefined ? this.props.showPanel : false,
            location: undefined
        };
    }

    public async componentDidMount() {
        if (this.props.showPanel) {
            this.setState({
                showPanel: this.props.showPanel
            });
        }
    }

    @autobind
    private _changeLocationHandler(event: any): void {
        this.setState({
            showPanel: true
        });
    }

    @autobind
    private _hidePanel(): void {
        this.setState({ showPanel: false });

    }

    @autobind
    private _savePanel(): void {
        this.setState({ showPanel: false });
        this.props.onLocationChanged(this._selectedLocation);
    }

    private _onRenderFooterContent = () => {
        return (
            <div>
                <PrimaryButton onClick={this._savePanel} style={{ marginRight: '8px' }}>
                    Save
            </PrimaryButton>
                <DefaultButton onClick={this._hidePanel}>Cancel</DefaultButton>
            </div>
        );
    }

    @autobind
    private _onOptionChanged(target: any, option: IChoiceGroupOption) {
        this.setState({
            location: option.text
        });
        this._selectedLocation = option.text;
    }

    public render(): React.ReactElement<IHeaderProps> {
        return (
            <div className={styles.spfxHeader}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <PrimaryButton text="Change Location"
                                onClick={this._changeLocationHandler} />
                            <Panel
                                isOpen={this.state.showPanel}
                                type={PanelType.smallFixedFar}
                                onDismiss={this._hidePanel}
                                headerText="Change Location"
                                closeButtonAriaLabel="Close"
                                onRenderFooterContent={this._onRenderFooterContent}
                            >
                                <ChoiceGroup
                                    options={[
                                        {
                                            key: 'Redmond',
                                            text: 'Redmond'
                                        },
                                        {
                                            key: 'Seattle',
                                            text: 'Seattle'
                                            //checked: true
                                        },
                                        {
                                            key: 'Sammamish',
                                            text: 'Sammamish'
                                            //disabled: true
                                        }
                                    ]}
                                    label="Pick one"
                                    required={true}
                                    onChange={this._onOptionChanged}
                                    defaultSelectedKey={this.state.location}
                                    selectedKey={this.state.location}
                                />
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
