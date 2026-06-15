import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, TabPanel, ColorPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';
import { Button, ButtonSize, ButtonColors } from './Button';
import './style.scss';

interface ButtonBlockAttributes {
  text: string;
  href: string;
  size: ButtonSize;
  colors: ButtonColors;
  customBackground: string;
  customTextColor: string;
  borderRadiusDesktop: string;
  borderRadiusTablet: string;
  borderRadiusPhone: string;
}

const COLOR_SCHEME_OPTIONS = [
  { label: 'Grape', value: 'grape' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Custom', value: 'custom' },
];

const BORDER_RADIUS_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: '4px', value: '4px' },
  { label: '6px', value: '6px' },
  { label: '8px', value: '8px' },
  { label: '10px', value: '10px' },
  { label: '12px', value: '12px' },
  { label: '16px', value: '16px' },
  { label: '20px', value: '20px' },
  { label: '32px', value: '32px' },
  { label: 'Round', value: '50%' },
];

const SIZE_MAP: Record<ButtonSize, { phone: React.CSSProperties; tablet: React.CSSProperties; desktop: React.CSSProperties }> = {
  sm: {
    phone: { padding: '8px 12px', fontSize: '16px' },
    tablet: { padding: '8px 12px', fontSize: '16px' },
    desktop: { padding: '8px 12px', fontSize: '16px' },
  },
  md: {
    phone: { padding: '8px 24px', fontSize: '24px', fontWeight: 400 },
    tablet: { padding: '8px 24px', fontSize: '24px', fontWeight: 400 },
    desktop: { padding: '8px 24px', fontSize: '24px', fontWeight: 400 },
  },
  lg: {
    phone: { padding: '6px 18px', fontSize: '18px', fontWeight: 500 },
    tablet: { padding: '8px 24px', fontSize: '24px', fontWeight: 500 },
    desktop: { padding: '12px 36px', fontSize: '36px', fontWeight: 500 },
  },
};

function getSchemeBackground(colors: ButtonColors): string {
  const schemes: Record<string, string> = {
    grape: 'linear-gradient(90deg, #5823EB 0%, #6D00D2 100%)',
    raspberry: 'linear-gradient(90deg, rgb(215, 69, 255) 0%, rgb(245, 47, 162) 100%)',
    strawberry: 'linear-gradient(90deg, #F74098 0%, #F64B30 100%)',
  };
  return schemes[colors] || '';
}

function getSchemeTextColor(colors: ButtonColors): string {
  const schemes: Record<string, string> = {
    grape: 'rgb(255, 255, 255)',
    raspberry: 'rgb(255, 255, 255)',
    strawberry: 'rgb(255, 255, 255)',
  };
  return schemes[colors] || '';
}

registerBlockType<ButtonBlockAttributes>('childlab/button', {
  edit: ({ attributes, setAttributes }: BlockEditProps<ButtonBlockAttributes>) => {
    const blockProps = useBlockProps();
    const isCustom = attributes.colors === 'custom';

    const previewBackground = isCustom
      ? attributes.customBackground || '#ffffff'
      : getSchemeBackground(attributes.colors);

    const previewTextColor = isCustom
      ? attributes.customTextColor || '#5230D0'
      : getSchemeTextColor(attributes.colors);

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Button Settings', 'childlab')}>
            <TextControl
              label={__('Text', 'childlab')}
              value={attributes.text}
              onChange={(text: string) => setAttributes({ text })}
            />
            <TextControl
              label={__('Link URL', 'childlab')}
              value={attributes.href}
              onChange={(href: string) => setAttributes({ href })}
            />
            <SelectControl
              label={__('Size', 'childlab')}
              value={attributes.size}
              options={[
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ]}
              onChange={(size: ButtonSize) => setAttributes({ size })}
            />
            <SelectControl
              label={__('Color Scheme', 'childlab')}
              value={attributes.colors}
              options={COLOR_SCHEME_OPTIONS}
              onChange={(colors: ButtonColors) => setAttributes({ colors })}
            />
          </PanelBody>
          {isCustom && (
            <PanelBody title={__('Custom Colors', 'childlab')} initialOpen={true}>
              <TextControl
                label={__('Background (color or gradient)', 'childlab')}
                help={__('e.g. #ff0000 or linear-gradient(90deg, #f00 0%, #00f 100%)', 'childlab')}
                value={attributes.customBackground}
                onChange={(customBackground: string) => setAttributes({ customBackground })}
              />
              <ColorPicker
                color={attributes.customTextColor}
                onChange={(value) => {
                  const color = typeof value === 'string' ? value : value.hex;
                  setAttributes({ customTextColor: color });
                }}
                enableAlpha
              />
            </PanelBody>
          )}
          <PanelBody title={__('Border Radius', 'childlab')} initialOpen={false}>
            <TabPanel
              tabs={[
                { name: 'desktop', title: 'Desktop' },
                { name: 'tablet', title: 'Tablet' },
                { name: 'phone', title: 'Phone' },
              ]}
            >
              {(tab) => {
                const key = `borderRadius${tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}` as keyof ButtonBlockAttributes;
                return (
                  <SelectControl
                    label={__('Radius', 'childlab')}
                    value={attributes[key] as string}
                    options={BORDER_RADIUS_OPTIONS}
                    onChange={(value: string) => setAttributes({ [key]: value } as Partial<ButtonBlockAttributes>)}
                  />
                );
              }}
            </TabPanel>
          </PanelBody>
        </InspectorControls>
        <div className="wp-block-childlab-button-preview">
          <Button
            href={attributes.href || undefined}
            active={{ background: previewBackground, color: previewTextColor }}
            colors="custom"
            size={attributes.size}
            borderRadius={{
              desktop: attributes.borderRadiusDesktop as any,
              tablet: attributes.borderRadiusTablet as any,
              phone: attributes.borderRadiusPhone as any,
            }}
          >
            {attributes.text || __('Button', 'childlab')}
          </Button>
        </div>
      </div>
    );
  },

  save: ({ attributes }) => {
    const isCustom = attributes.colors === 'custom';

    const background = isCustom
      ? attributes.customBackground
      : getSchemeBackground(attributes.colors);

    const color = isCustom
      ? attributes.customTextColor
      : getSchemeTextColor(attributes.colors);

    const style: React.CSSProperties = {
      ...(SIZE_MAP[attributes.size]?.desktop || SIZE_MAP.md.desktop),
      background: background || '#ffffff',
      color: color || '#5230D0',
      border: '1px solid transparent',
      borderRadius: attributes.borderRadiusDesktop,
    };

    return (
      <a
        className="ui-button"
        href={attributes.href || '#'}
        style={style}
      >
        <span className="ui-button__text">
          {attributes.text}
        </span>
      </a>
    );
  },
});
