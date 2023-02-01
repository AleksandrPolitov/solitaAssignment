import { useState } from 'react';

interface IUseLimitProps {
  options: number[];
  onChange: (value: number) => void;
}

export const useLimit = ({ options, onChange }: IUseLimitProps) => {
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(Number(value));
    onChange(Number(value));
  };

  return { selectedValue, handleChange };
};