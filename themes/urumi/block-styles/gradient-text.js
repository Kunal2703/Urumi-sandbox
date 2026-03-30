const { registerFormatType } = wp.richText;
const { RichTextToolbarButton } = wp.blockEditor;
const { toggleFormat } = wp.richText;

// Inline format
registerFormatType('neysai/gradient-text', {
    title: 'Gradient Text',
    tagName: 'span',
    className: 'gradient-text',
    edit({ isActive, value, onChange }) {
        return (
            React.createElement(RichTextToolbarButton, {
                icon: "art",
                title: "gText",
                onClick: () => {
                    onChange(toggleFormat(value, {
                        type: 'neysai/gradient-text'
                    }));
                },
                isActive: isActive
            })
        );
    },
});

registerFormatType('neysai/gradient-text-2', {
    title: 'Gradient Text 2',
    tagName: 'span',
    className: 'gradient-text-2',
    edit({ isActive, value, onChange }) {
        return (
            React.createElement(RichTextToolbarButton, {
                icon: "art",
                title: "gText",
                onClick: () => {
                    onChange(toggleFormat(value, {
                        type: 'neysai/gradient-text-2'
                    }));
                },
                isActive: isActive
            })
        );
    },
});

// Block Stlye
wp.blocks.registerBlockStyle('core/heading', {
  name: 'gradient-text',
  label: 'Gradient Text',
  isDefault: false, // Set to true if you want this to be the default style
});

wp.blocks.registerBlockStyle('core/heading', {
  name: 'gradient-text-2',
  label: 'Gradient Text 2',
  isDefault: false, // Set to true if you want this to be the default style
});


registerFormatType("neysai/color-ghost-white", {
    title: "Ghost White Text",
    tagName: "span",
    className: "color-ghost-white",
    edit({ isActive, value, onChange }) {
        return (
            React.createElement(RichTextToolbarButton, {
                icon: "admin-appearance",
                title: "Ghost White Text",
                onClick: () => {
                    onChange(toggleFormat(value, {
                        type: "neysai/color-ghost-white"
                    }));
                },
                isActive: isActive
            })
        );
    },
});

