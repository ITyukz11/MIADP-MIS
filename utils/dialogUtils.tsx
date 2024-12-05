export const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault();
};

export const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
        event.stopPropagation();
    }
};