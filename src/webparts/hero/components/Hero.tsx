import * as React from 'react';
import styles from './Hero.module.scss';
import { IHeroProps } from './IHeroProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, autobind } from 'office-ui-fabric-react';

export default class Hero extends React.Component<IHeroProps, {}> {

    @autobind
    private _changeLocationHandler(target: any): void {
        this.props.onCommand("showPanel");
    }
    public render(): React.ReactElement<IHeroProps> {
        return (
            <div className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <PrimaryButton text="Change Location" onClick={this._changeLocationHandler}></PrimaryButton>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <span className={styles.title}>Hero</span>
                            <div><span>location: </span>{JSON.stringify(this.props.location)}</div>
                            <div><span>location1:</span>{JSON.stringify(this.props.location1)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
