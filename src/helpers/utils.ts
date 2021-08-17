import { UIEvent } from 'react'

export const stopEventPropagation = (e: UIEvent) => {
    e.stopPropagation();
};
