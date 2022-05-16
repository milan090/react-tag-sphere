import React from "react";
import { CSSProperties, ReactNode } from "react";
declare type TagSphereProps = {
    /** Can be list of strings, html elements or react components */
    tags: (string | ReactNode)[];
    /** @default texts.length * 15 */
    radius?: number;
    /**@default 7 */
    maxSpeed: number;
    /** @default 32 */
    initialSpeed: number;
    /** In degrees
     * @default 135
     */
    initialDirection: 135;
    /** @default true */
    keepRollingAfterMouseOut: boolean;
    className?: string;
    style?: CSSProperties;
    fullWidth: boolean;
    fullHeight: boolean;
    /** Make the items highlightable with selection
     * @default false
     */
    userSelect: boolean;
    /** @default true */
    blur: boolean;
};
export declare const TagSphere: React.FC<Partial<TagSphereProps>>;
export {};
