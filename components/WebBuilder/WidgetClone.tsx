import React from "react";
import styles from './Widgets.module.scss'

export default class WidgetClone extends React.Component {
    render () {
        return (
            <div className={styles.clone}>
                {this.props.widget.content}
            </div>
        );
    }
}