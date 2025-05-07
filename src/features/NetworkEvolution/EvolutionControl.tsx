import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface EvolutionControlProps {
  minYear: number;
  maxYear: number;
  onYearChange: (year: number | null) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ToggleButton = styled.button<{ enabled: boolean }>`
  width: 100%;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  background: ${({ enabled }) => (enabled ? '#2563eb' : '#e5e7eb')};
  color: ${({ enabled }) => (enabled ? '#fff' : '#333')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
`;

const StatusBadge = styled.span<{ enabled: boolean }>`
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ enabled }) => (enabled ? '#3b82f6' : '#d1d5db')};
  color: ${({ enabled }) => (enabled ? '#fff' : '#333')};
`;

const RangeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.5rem 0.2rem 0 0.2rem;
`;

const RangeLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #444;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const YearLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
`;

const EvolutionControl: React.FC<EvolutionControlProps> = ({ minYear, maxYear, onYearChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedYear, setSelectedYear] = useState(maxYear);

  useEffect(() => {
    if (!isEnabled) {
      onYearChange(null);
    } else {
      onYearChange(selectedYear);
    }
  }, [isEnabled, selectedYear, onYearChange]);

  const handleToggleEnabled = () => {
    setIsEnabled(prev => !prev);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
  };

  const handleResetYear = () => {
    setSelectedYear(maxYear);
  };

  return (
    <Container>
      <ToggleButton enabled={isEnabled} onClick={handleToggleEnabled}>
      {isEnabled ? 'Enabled' : 'Disabled'}
      </ToggleButton>
      {isEnabled && (
        <RangeSection>
          <RangeLabel>
            <span>Year: <b>{selectedYear}</b></span>
            <ResetButton onClick={handleResetYear} title={`Reset year to ${maxYear}`}>Reset to {maxYear}</ResetButton>
          </RangeLabel>
          <RangeInput
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear}
            onChange={handleYearChange}
          />
          <YearLabels>
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </YearLabels>
        </RangeSection>
      )}
    </Container>
  );
};

export default EvolutionControl;