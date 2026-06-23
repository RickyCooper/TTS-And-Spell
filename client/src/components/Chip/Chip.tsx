import React, { type JSX } from 'react';
import styles from './Chip.module.scss';

type Stat = 'accuracy' | 'streak' | 'time';
type Notification = 'error' | 'warning';

type StatChipProps = {
    variant: Stat;
    data: number[] | number;
    icon: string;
};

type NotifChipProps = {
    variant: Notification;
    msg: string;
    icon: string;
};

type ChipProps = StatChipProps | NotifChipProps;

const Chip: React.FC<ChipProps> = (props): JSX.Element => {
    const isStat = props.variant !== 'error' && props.variant !== 'warning';

    const getStyle = (): React.CSSProperties | undefined => {
        if (!isStat) return undefined;
        const { variant: variant, data } = props as StatChipProps;
        if (variant === 'time') {
            const [min, sec] = data as number[];
            return { '--num-min': min, '--num-sec': sec } as React.CSSProperties;
        }
        return { '--num': data } as React.CSSProperties;
    };

    const containerClass = [
        styles['chip'],
        styles[isStat ? 'chip--stat' : 'chip--notification'],
        styles[`chip--${props.variant}`],
    ].join(' ');

    return (
        <div className={containerClass}>
            <div className={styles['chip_icon-container']}>
                <img src={props.icon} alt="icon" className={styles['chip_icon']} />
            </div>
            <div className={styles['chip_data-container']}>
                <p className={styles['chip_data']} style={getStyle()}>
                    {!isStat && (props as NotifChipProps).msg}
                </p>
            </div>
        </div>
    );
};

export default Chip;
