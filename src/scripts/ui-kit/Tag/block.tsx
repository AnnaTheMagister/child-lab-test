import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ColorPalette, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';
import { Tag, TagSize } from './Tag';
import './style.scss';

interface TagBlockAttributes {
  content: string;
  color: string;
  textColor: string;
  size: TagSize;
}

interface ColorOption {
  name: string;
  color: string;
}

const COLORS: ColorOption[] = [
  { name: 'Pink', color: '#eb3f9b' },
  { name: 'Purple', color: '#7b2d8e' },
  { name: 'Blue', color: '#3498db' },
  { name: 'Green', color: '#2ecc71' },
  { name: 'Orange', color: '#e67e22' },
  { name: 'Red', color: '#e74c3c' },
  { name: 'Grey', color: '#95a5a6' },
];

registerBlockType<TagBlockAttributes>('childlab/tag', {
  edit: ({ attributes, setAttributes }: BlockEditProps<TagBlockAttributes>) => {
    const blockProps = useBlockProps();

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Tag Settings', 'childlab')}>
            <TextControl
              label={__('Text', 'childlab')}
              value={attributes.content}
              onChange={(content: string) => setAttributes({ content })}
            />
            <SelectControl
              label={__('Size', 'childlab')}
              value={attributes.size}
              options={[
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
              ]}
              onChange={(size: TagSize) => setAttributes({ size })}
            />
          </PanelBody>
          <PanelBody title={__('Colors', 'childlab')} initialOpen={false}>
            <ColorPalette
              label={__('Background', 'childlab')}
              colors={COLORS}
              value={attributes.color}
              onChange={(color: string | undefined) => setAttributes({ color: color || '' })}
            />
            <ColorPalette
              label={__('Text Color', 'childlab')}
              colors={COLORS}
              value={attributes.textColor}
              onChange={(textColor: string | undefined) => setAttributes({ textColor: textColor || '' })}
            />
          </PanelBody>
        </InspectorControls>
        <div className="wp-block-childlab-tag-preview">
          <Tag
            color={attributes.color || undefined}
            textColor={attributes.textColor || undefined}
            size={attributes.size}
          >
            {attributes.content || __('Tag', 'childlab')}
          </Tag>
        </div>
      </div>
    );
  },

  save: ({ attributes }) => {
    const style: React.CSSProperties = {
      backgroundColor: attributes.color || 'rgba(255, 255, 255, 0.9)',
      color: attributes.textColor || '#333',
      padding: attributes.size === 'md' ? '6px 16px' : '4px 12px',
      fontSize: attributes.size === 'md' ? '14px' : '12px',
    };

    return (
      <span className="ui-tag" style={style}>
        {attributes.content}
      </span>
    );
  },
});
