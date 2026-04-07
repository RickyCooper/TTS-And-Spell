import React, { type JSX } from 'react';
import styles from './StatChip.module.scss';


interface StatChipProps {
    icon: string; 
    data: number[] | number;
    stat: 'streak' | 'time' | 'accuracy';
}

const StatChip: React.FC<StatChipProps> = ({ icon, data, stat, }): JSX.Element => {

    const getStyle = (): React.CSSProperties | undefined => {
        if (stat === 'time') {
            const [min, sec] = data as number[];
            return {
                '--num-min': min,
                '--num-sec': sec,
            } as React.CSSProperties;
        } else {
           return { '--num': data } as React.CSSProperties; 
        }
    };

    return (
        <div className={`${styles["stat-chip"]} ${styles[`stat-chip--${stat}`]}`}>   
            <div className={styles["stat-chip_icon-container"]}>
                <img src={icon} alt="icon" className={styles["stat-chip_icon"]} />
            </div>
            <div className={styles["stat-chip_data-container"]}>
                <p className={styles["stat-chip_data"]} style={getStyle()}/>
            </div>
        </div>
    );
}

export default StatChip;