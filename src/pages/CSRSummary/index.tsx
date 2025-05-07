import React, { useState } from 'react';
import styled from 'styled-components';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import ChatHistoryDropdown from '../../components/Chat/ChatHistoryDropdown';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 1px solid #222;
`;

const MainArea = styled.div`
  display: flex;
  flex: 1;
  border-top: 1px solid #222;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  position: relative;
  background: #fff;
  border-left: 1px solid #222;
  border-right: 1px solid #222;
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 1.5rem 0;
`;

const StepCircle = styled.div<{ completed?: boolean; active?: boolean; clickable?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ completed, active }) =>
    completed ? '#e6fae6' : active ? '#fffbe6' : '#f5f5f5'};
  border: 2px solid
    ${({ completed, active }) =>
      completed ? '#4caf50' : active ? '#e2cfa2' : '#bbb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ completed, active }) =>
    completed ? '#388e3c' : active ? '#bfa94a' : '#aaa'};
  margin: 0 0.5rem;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: ${({ clickable }) => (clickable ? '0 0 0 2px #bcd' : 'none')};
  }
`;

const StepArrow = styled.div`
  font-size: 2rem;
  color: #bfa94a;
  margin: 0 0.5rem;
`;

const RightSidebar = styled.div`
  width: 320px;
  background: #fff;
  border-left: 1px solid #e2cfa2;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem 1rem 1rem;
`;

const UploadBox = styled.label`
  border: 2px dashed #bbb;
  border-radius: 10px;
  padding: 2.5rem 0;
  margin: 0 auto 2rem auto;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: border 0.2s;
  &:hover {
    border-color: #2563eb;
  }
`;

const UploadLink = styled.span`
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
`;

const FileInfo = styled.div`
  margin-top: 0.7rem;
  color: #444;
  font-size: 1rem;
`;

const ExecuteButton = styled.button`
  margin: 2.5rem auto 0 auto;
  display: block;
  background: #e3f0ff;
  color: #222;
  border: 1px solid #bcd;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 1rem 2.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #d0e7ff;
  }
  &:disabled {
    background: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const TableMappingContainer = styled.div`
  border: 2px dashed #bbb;
  border-radius: 10px;
  margin: 0 auto 2rem auto;
  width: 90%;
  min-height: 260px;
  padding: 1.5rem 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TableMappingTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
`;

const MappingTable = styled.table`
  width: 95%;
  margin: 0 auto;
  border-collapse: collapse;
  background: #fff;
`;

const MappingTh = styled.th`
  border: 1px solid #bbb;
  background: #fafafa;
  font-weight: 600;
  padding: 0.7rem 1rem;
  text-align: left;
`;

const MappingTd = styled.td`
  border: 1px solid #bbb;
  padding: 0.7rem 1rem;
  font-size: 1rem;
`;

const MappingRow = styled.tr<{ selected?: boolean }>`
  background: ${({ selected }) => (selected ? '#f5faff' : 'transparent')};
`;

const MappingCheckbox = styled.input`
  margin-right: 0.7rem;
`;

const MappingButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin: 2.5rem 0 0 0;
`;

const MappingButton = styled.button`
  background: #e3f0ff;
  color: #222;
  border: 1px solid #bcd;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 1rem 2.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #d0e7ff;
  }
  &:disabled {
    background: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const SidebarSectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  margin-top: 1.5rem;
`;

const SidebarDropdown = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #bcd;
  background: #f8fafc;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const navItems = [
  { label: 'Start New Flow' },
  { label: 'Documents' },
  { label: 'Settings' },
];

const mockTableMappings = [
  {
    id: '1',
    userTable: 'Table 1 Serious Adverse Event Reported',
    fdaSection: 'FDA Section 1.4 Adverse Event',
  },
  {
    id: '2',
    userTable: 'Table 1.2 Patient demographics',
    fdaSection: 'FDA Section 1.5 Patient Disposition',
  },
];

const mockSectionSummaries = [
  {
    id: '1',
    section: 'FDA Section 1.4 Adverse Event',
    summary: 'Summary of adverse events goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: '2',
    section: 'FDA Section 1.5 Patient Disposition',
    summary: 'Summary of patient disposition goes here. Pellentesque habitant morbi tristique senectus et netus.'
  },
];

const modelOptions = [
  { value: 'default', label: 'Default Model' },
  { value: 'gpt4', label: 'GPT-4 CSR Model' },
  { value: 'custom', label: 'Custom Model' },
];

const templateOptions = [
  { value: 'fda', label: 'FDA Template' },
  { value: 'ema', label: 'EMA Template' },
  { value: 'custom', label: 'Custom Template' },
];

const outputFormatOptions = [
  { value: 'docx', label: 'DOCX' },
  { value: 'pdf', label: 'PDF' },
  { value: 'txt', label: 'Plain Text' },
];

// Add mock FDA/EMA/custom section options for dropdowns
const templateSectionOptions: Record<string, { value: string; label: string }[]> = {
  fda: [
    { value: 'FDA Section 1.4 Adverse Event', label: 'FDA Section 1.4 Adverse Event' },
    { value: 'FDA Section 1.5 Patient Disposition', label: 'FDA Section 1.5 Patient Disposition' },
    { value: 'FDA Section 2.1 Study Design', label: 'FDA Section 2.1 Study Design' },
  ],
  ema: [
    { value: 'EMA Section 1.4 Adverse Event', label: 'EMA Section 1.4 Adverse Event' },
    { value: 'EMA Section 1.5 Patient Disposition', label: 'EMA Section 1.5 Patient Disposition' },
    { value: 'EMA Section 2.1 Study Design', label: 'EMA Section 2.1 Study Design' },
  ],
  custom: [
    { value: 'Custom Section 1', label: 'Custom Section 1' },
    { value: 'Custom Section 2', label: 'Custom Section 2' },
  ],
};

const CSRSummary: React.FC = () => {
  const [step, setStep] = useState(1);
  const [flowHistoryExpanded, setFlowHistoryExpanded] = useState(true);
  const [activeFlow, setActiveFlow] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMappings, setSelectedMappings] = useState<string[]>([]);
  const [selectedSectionSummaries, setSelectedSectionSummaries] = useState<string[]>([]);
  const [tableMappingModel, setTableMappingModel] = useState('default');
  const [summaryGenModel, setSummaryGenModel] = useState('default');
  const [selectedTemplate, setSelectedTemplate] = useState('fda');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState('docx');
  const [flowHistory, setFlowHistory] = useState<{ id: string; title: string; lastMessage: string; timestamp: string }[]>([]);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  // Add state for selected section for each mapping
  const [tableMappingSectionSelections, setTableMappingSectionSelections] = useState<{ [id: string]: string }>({});

  const handleLogoClick = () => {
    window.location.href = '/';
  };
  const handleProfileClick = () => {
    alert('Profile click: future login/profile integration');
  };

  const handleMappingSelect = (id: string) => {
    setSelectedMappings(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  const handleReexecute = () => {
    setSelectedMappings([]);
  };

  const handleSectionSummarySelect = (id: string) => {
    setSelectedSectionSummaries(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  const handleReexecuteSummary = () => {
    setSelectedSectionSummaries([]);
  };

  return (
    <PageContainer>
      <TopNavBar
        logoText="CSR Summarization"
        profileInitials="PS"
        onLogoClick={handleLogoClick}
        onProfileClick={handleProfileClick}
      />
      <MainArea>
        <CollapsibleSidebar
          collapsed={leftSidebarCollapsed}
          onToggle={() => setLeftSidebarCollapsed(c => !c)}
          position="left"
        >
          <SideNavBar
            navItems={navItems}
            footerText="PxLS"
            extraSections={
              <ChatHistoryDropdown
                title="Flow History"
                conversations={flowHistory}
                activeId={activeFlow}
                onSelect={setActiveFlow}
              />
            }
          />
        </CollapsibleSidebar>
        <Content>
          <StepperContainer>
            <StepCircle
              completed={step > 1}
              active={step === 1}
              clickable={step > 1}
              onClick={() => { if (step > 1) setStep(1); }}
            >
              1
            </StepCircle>
            <StepArrow>&rarr;</StepArrow>
            <StepCircle
              completed={step > 2}
              active={step === 2}
              clickable={step > 2}
              onClick={() => { if (step > 2) setStep(2); }}
            >
              2
            </StepCircle>
            <StepArrow>&rarr;</StepArrow>
            <StepCircle
              completed={step > 3}
              active={step === 3}
              clickable={false}
            >
              3
            </StepCircle>
          </StepperContainer>
          {/* Step 1: File Upload */}
          {step === 1 && (
            <>
              <UploadBox
                htmlFor="csr-upload-input"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setSelectedFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input
                  id="csr-upload-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <div>
                  <UploadLink>Upload a File</UploadLink> or drag and drop<br />
                  <span style={{ color: '#888', fontSize: '0.98rem' }}>PDF, DOC, DOCX up to 10 MB</span>
                </div>
                {selectedFile && (
                  <FileInfo>Selected: {selectedFile.name}</FileInfo>
                )}
              </UploadBox>
              <ExecuteButton
                disabled={!selectedFile}
                onClick={() => {
                  setStep(2);
                  if (selectedFile) {
                    setFlowHistory(prev => [
                      ...prev,
                      {
                        id: `${Date.now()}`,
                        title: selectedFile.name,
                        lastMessage: '',
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }
                }}
              >
                Execute CSR Summarizer
              </ExecuteButton>
            </>
          )}

          {/* Step 2: Table Mapping Review */}
          {step === 2 && (
            <>
              <TableMappingContainer>
                <TableMappingTitle>Review Table Mapping</TableMappingTitle>
                <MappingTable>
                  <thead>
                    <tr>
                      <MappingTh></MappingTh>
                      <MappingTh>Table from user document</MappingTh>
                      <MappingTh>Section from FDA template document</MappingTh>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTableMappings.map(row => (
                      <MappingRow key={row.id} selected={selectedMappings.includes(row.id)}>
                        <MappingTd>
                          <MappingCheckbox
                            type="checkbox"
                            checked={selectedMappings.includes(row.id)}
                            onChange={() => handleMappingSelect(row.id)}
                          />
                        </MappingTd>
                        <MappingTd>{row.userTable}</MappingTd>
                        <MappingTd>
                          <SidebarDropdown
                            value={tableMappingSectionSelections[row.id] || row.fdaSection}
                            onChange={e => {
                              const value = e.target.value;
                              setTableMappingSectionSelections(prev => ({ ...prev, [row.id]: value }));
                            }}
                          >
                            {(templateSectionOptions[selectedTemplate] || []).map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </SidebarDropdown>
                        </MappingTd>
                      </MappingRow>
                    ))}
                  </tbody>
                </MappingTable>
              </TableMappingContainer>
              <MappingButtonRow>
                <MappingButton
                  onClick={handleReexecute}
                  disabled={selectedMappings.length === 0}
                >
                  Re-execute table mapping for selected
                </MappingButton>
                <MappingButton
                  onClick={() => setStep(3)}
                >
                  Generate Summary
                </MappingButton>
              </MappingButtonRow>
            </>
          )}

          {/* Step 3: Section Summary Review */}
          {step === 3 && (
            <>
              <TableMappingContainer>
                <TableMappingTitle>Review Section Summaries</TableMappingTitle>
                <MappingTable>
                  <thead>
                    <tr>
                      <MappingTh></MappingTh>
                      <MappingTh>Section</MappingTh>
                      <MappingTh>Summary</MappingTh>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSectionSummaries.map(row => (
                      <MappingRow key={row.id} selected={selectedSectionSummaries.includes(row.id)}>
                        <MappingTd>
                          <MappingCheckbox
                            type="checkbox"
                            checked={selectedSectionSummaries.includes(row.id)}
                            onChange={() => handleSectionSummarySelect(row.id)}
                          />
                        </MappingTd>
                        <MappingTd>{row.section}</MappingTd>
                        <MappingTd>{row.summary}</MappingTd>
                      </MappingRow>
                    ))}
                  </tbody>
                </MappingTable>
              </TableMappingContainer>
              <MappingButtonRow>
                <MappingButton
                  onClick={handleReexecuteSummary}
                  disabled={selectedSectionSummaries.length === 0}
                >
                  Re-execute summary for selected
                </MappingButton>
                <MappingButton
                  onClick={() => alert('Download triggered!')}
                >
                  Finish & Download All Summaries
                </MappingButton>
              </MappingButtonRow>
            </>
          )}
        </Content>
        <RightSidebar>
          <SidebarSectionTitle>Table Mapping Model</SidebarSectionTitle>
          <SidebarDropdown
            value={tableMappingModel}
            onChange={e => setTableMappingModel(e.target.value)}
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SidebarDropdown>
          <SidebarSectionTitle>Summary Generation Model</SidebarSectionTitle>
          <SidebarDropdown
            value={summaryGenModel}
            onChange={e => setSummaryGenModel(e.target.value)}
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SidebarDropdown>
          <SidebarSectionTitle>Template Selection</SidebarSectionTitle>
          <SidebarDropdown
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
          >
            {templateOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SidebarDropdown>
          <SidebarSectionTitle>Output Format</SidebarSectionTitle>
          <SidebarDropdown
            value={selectedOutputFormat}
            onChange={e => setSelectedOutputFormat(e.target.value)}
          >
            {outputFormatOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SidebarDropdown>
        </RightSidebar>
      </MainArea>
    </PageContainer>
  );
};

export default CSRSummary; 