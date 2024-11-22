declare module 'emoji-mart' {
    import * as React from 'react';

    export interface EmojiData {
        id: string;
        name: string;
        native: string;
        unified: string;
        keywords: string[];
        short_names: string[];
        emoticons: string[];
        skin: number;
    }

    export interface PickerProps {
        onSelect: (emoji: EmojiData) => void;
        set?: 'apple' | 'google' | 'twitter' | 'facebook';
        theme?: 'light' | 'dark' | 'auto';
        title?: string;
        emoji?: string;
        style?: React.CSSProperties;
    }

    export class Picker extends React.Component<PickerProps> {}
}
