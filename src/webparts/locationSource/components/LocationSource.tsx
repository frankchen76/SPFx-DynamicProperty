import * as React from 'react';
import styles from './LocationSource.module.scss';
import { ILocationSourceProps } from './ILocationSourceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, autobind, Button } from 'office-ui-fabric-react';

export default class LocationSource extends React.Component<ILocationSourceProps, {}> {
    @autobind
    private _handler(event: any): void {
        this.props.onLocation(event.target.textContent);
    }

    public render(): React.ReactElement<ILocationSourceProps> {
        return (
            <div className={styles.locationSource}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <PrimaryButton text="Redmond" onClick={this._handler} />
                            <PrimaryButton text="Seattle" onClick={this._handler} />
                            <PrimaryButton text="Sammamish" onClick={this._handler} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
