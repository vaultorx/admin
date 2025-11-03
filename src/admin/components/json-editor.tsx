/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  FormGroup, Label, Input, FormMessage, Box,
} from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';

const JsonEditor = (props: BasePropertyProps) => {
  const { property, onChange, record } = props;

  // Get the current value and ensure it's properly formatted
  const getCurrentValue = () => {
    const value = record?.params?.[property.name];

    if (!value) return '{}';

    if (typeof value === 'string') {
      try {
        // If it's a string, try to parse and re-stringify for formatting
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        // If it's invalid JSON, return as is
        return value;
      }
    }

    // If it's already an object, stringify it
    return JSON.stringify(value, null, 2);
  };

  const [value, setValue] = React.useState(getCurrentValue());
  const [isValid, setIsValid] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);

    try {
      // Try to parse the JSON to validate it
      if (newValue.trim()) {
        JSON.parse(newValue);
        setIsValid(true);
        // Send the parsed object to AdminJS
        onChange(property.name, JSON.parse(newValue));
      } else {
        setIsValid(true);
        onChange(property.name, {});
      }
    } catch (error) {
      setIsValid(false);
      // Still send the string for editing, but it will be invalid
      onChange(property.name, newValue);
    }
  };

  React.useEffect(() => {
    setValue(getCurrentValue());
  }, [record]);

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <Box style={{ position: 'relative' }}>
        <Input
          as="textarea"
          rows={8}
          value={value}
          onChange={handleChange}
          fontFamily="monospace"
          style={{
            borderColor: isValid ? undefined : 'red',
          }}
        />
        {!isValid && (
          <Box
            style={{
              color: 'red',
              fontSize: '12px',
              marginTop: '4px',
            }}
          >
            Invalid JSON format
          </Box>
        )}
      </Box>
      <FormMessage />
    </FormGroup>
  );
};

export default JsonEditor;
