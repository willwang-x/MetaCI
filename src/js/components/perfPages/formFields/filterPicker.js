// @flow

import * as React from 'react';
import { useState } from 'react';
// flowlint  untyped-import:off
import Combobox from '@salesforce/design-system-react/components/combobox';
import Icon from '@salesforce/design-system-react/components/icon';
import comboboxFilterAndLimit from '@salesforce/design-system-react/components/combobox/filter';
// flowlint  untyped-import:error

type Props = {
  choices: { id: string }[],
  field_name: string,
  value?: string | null,
  onSelect: mixed => void,
};

const FilterPicker = ({
  choices,
  field_name,
  value,
  onSelect,
}: Props): React.Node => {
  const selected = value ? choices.filter(choice => choice.id === value) : [];
  const [inputValue, setInputValue] = useState('');
  const [selection, setSelection] = useState(selected);
  return (
    <Combobox
      id="combobox-inline-single"
      placeholder={field_name}
      events={{
        onChange: (event, { newValue }) => {
          setInputValue(newValue);
        },
        onRequestRemoveSelectedOption: (event, data) => {
          setInputValue('');
          setSelection(data.selection);
          onSelect();
        },
        onSubmit: (event, { newValue }) => {
          setInputValue('');
          setSelection([
            ...selection,
            {
              label: newValue,
              icon: (
                <Icon
                  assistiveText={{ label: 'Account' }}
                  category="standard"
                  name="account"
                />
              ),
            },
          ]);
        },
        onSelect: (event, data) => {
          if (onSelect && data) {
            onSelect(data.selection[0].id);
          }
          setInputValue('');
          setSelection(data.selection);
        },
      }}
      labels={{
        placeholder: `Select ${field_name}`,
        placeholderReadOnly: `Select ${field_name}`,
      }}
      options={comboboxFilterAndLimit({
        inputValue,
        options: choices,
        selection,
        limit: 20,
      })}
      selection={selection}
      value={inputValue}
      variant="base"
    />
  );
};

export default FilterPicker;