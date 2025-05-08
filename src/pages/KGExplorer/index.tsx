import React, { useState } from 'react';
import styled from 'styled-components';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import GraphVisualization from '../../components/KGViz/GraphVisualization';
import { useKnowledgeGraph } from '../../hooks/useKnowledgeGraph';
import type { SavedQuery } from '../../types/kgApi.types';

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
  min-height: 0;
  overflow: hidden;
`;

const Welcome = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.div`
  font-size: 1.3rem;
  color: #888;
  font-weight: 400;
`;

const QueryInputContainer = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 2rem;
  flex-shrink: 0;
`;

const MainGraphArea = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: #fff;
  position: relative;
  padding-left: 40px;
  min-height: 0;
  overflow: hidden;
`;

const SaveButton = styled.button`
  position: absolute;
  top: 24px;
  right: 48px;
  background: none;
  border: none;
  font-size: 1.7rem;
  cursor: pointer;
  color: #2563eb;
  z-index: 10;
  transition: color 0.2s;
  &:hover {
    color: #1741a6;
  }
`;

const SidebarSection = styled.div`
  margin-top: 2rem;
`;

const SavedQueriesDropdown = styled.div`
  margin-top: 0.5rem;
  background: #f3f6fa;
  border-radius: 8px;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
`;

const SavedQueryItem = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  margin-bottom: 0.3rem;
  color: #2563eb;
  font-size: 1rem;
  &:hover {
    background: #e3eaff;
  }
`;

const NavItemDiv = styled.div<{ active?: boolean }>`
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  color: #222;
  cursor: pointer;
  font-weight: 500;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  &:hover {
    background: #f5f5f5;
  }
`;

const DropdownContainer = styled.div`
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  padding: 0.75rem 2rem 0.75rem 2rem;
  user-select: none;
`;

const Arrow = styled.span<{ expanded: boolean }>`
  margin-left: 0.5rem;
  font-size: 1rem;
  transition: transform 0.2s;
  transform: rotate(${props => (props.expanded ? '180deg' : '0deg')});
`;

const List = styled.div`
  background: #fafafa;
  border-radius: 6px;
  margin: 0.5rem 1.5rem 0 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  max-height: 220px;
  overflow-y: auto;
`;

const Item = styled.div<{ active: boolean }>`
  padding: 0.7rem 1rem;
  cursor: pointer;
  background: ${({ active }) => (active ? '#e9ecef' : 'transparent')};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: #222;
  &:hover {
    background: #f0f0f0;
  }
`;

// Dedicated QueryInput component
const QueryInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  disabled: boolean;
}> = ({ value, onChange, onSearch, disabled }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Type your query here..."
      style={{
        flex: 1,
        fontSize: '1.1rem',
        padding: '0.7rem 1rem',
        border: '1.5px solid #2563eb',
        borderRadius: 8,
        outline: 'none',
        marginRight: 8,
      }}
    />
    <button
      onClick={onSearch}
      disabled={disabled}
      style={{
        background: disabled ? '#e5e7eb' : '#2563eb',
        color: disabled ? '#888' : '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '0.7rem 1.5rem',
        fontWeight: 600,
        fontSize: '1.1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
      }}
    >
      Search
    </button>
  </div>
);

const KGExplorer: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [executedQuery, setExecutedQuery] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [savedDropdownOpen, setSavedDropdownOpen] = useState(true);

  const {
    graphData,
    isLoading,
    error,
    savedQueries,
    loadingSavedQueries,
    saveQuery,
    deleteQuery,
    isSaving,
    isDeleting,
  } = useKnowledgeGraph(executedQuery);

  const navItems = [
    { 
      label: 'Search New Query',
      onClick: () => {
        setInputQuery('');
        setExecutedQuery(null);
        setShowGraph(false);
      }
    },
    { 
      label: 'Documents',
      onClick: () => {
        // TODO: Implement documents view
        console.log('Documents clicked');
      }
    },
    { 
      label: 'Settings',
      onClick: () => {
        // TODO: Implement settings view
        console.log('Settings clicked');
      }
    },
  ];

  const handleQueryExecute = () => {
    if (!inputQuery.trim()) return;
    setExecutedQuery(inputQuery);
    setShowGraph(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleSaveQuery = async () => {
    if (!executedQuery) return;
    
    try {
      if (isQuerySaved) {
        // Find the saved query to delete
        const queryToDelete = savedQueries.find(q => q.queryText === executedQuery);
        if (queryToDelete) {
          await deleteQuery(queryToDelete.id);
        }
      } else {
        // Save new query
        await saveQuery({
          queryText: executedQuery,
          description: `Query about ${executedQuery}`,
          tags: ['saved'],
        });
      }
    } catch (error) {
      console.error('Failed to toggle query save state:', error);
      // You might want to show a toast notification here
    }
  };

  const handleSavedQueryClick = (query: SavedQuery) => {
    setExecutedQuery(query.queryText);
    setInputQuery(query.queryText);
    setShowGraph(true);
  };

  const handleDeleteQuery = async (queryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteQuery(queryId);
    } catch (error) {
      console.error('Failed to delete query:', error);
      // You might want to show a toast notification here
    }
  };

  const isQuerySaved = executedQuery && savedQueries.some(q => q.queryText === executedQuery);
  const isSearchDisabled = inputQuery.trim() === '' || inputQuery === executedQuery;

  return (
    <PageContainer>
      <TopNavBar
        logoText="KG Explorer"
        profileInitials="PS"
        onLogoClick={() => { window.location.href = '/'; }}
        onProfileClick={() => { alert('Profile click: future login/profile integration'); }}
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
              <DropdownContainer>
                <Header onClick={() => setSavedDropdownOpen(open => !open)}>
                  Saved Queries
                  <Arrow expanded={savedDropdownOpen}>▼</Arrow>
                </Header>
                {savedDropdownOpen && (
                  <List>
                    {loadingSavedQueries ? (
                      <Item active={false} style={{ color: '#888', fontStyle: 'italic' }}>Loading...</Item>
                    ) : savedQueries.length === 0 ? (
                      <Item active={false} style={{ color: '#888', fontStyle: 'italic' }}>No saved queries</Item>
                    ) : (
                      savedQueries.map((query) => (
                        <Item
                          key={query.id}
                          active={false}
                          onClick={() => handleSavedQueryClick(query)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ flex: 1 }}>{query.queryText}</span>
                          <button
                            onClick={(e) => handleDeleteQuery(query.id, e)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#666',
                              cursor: 'pointer',
                              padding: '4px',
                              marginLeft: '8px',
                            }}
                            title="Delete query"
                          >
                            ×
                          </button>
                        </Item>
                      ))
                    )}
                  </List>
                )}
              </DropdownContainer>
            }
          />
        </CollapsibleSidebar>
        <Content>
          <MainGraphArea>
            {isLoading && <div>Loading graph...</div>}
            {error && <div style={{ color: 'red', fontWeight: 500 }}>Error: {error.message}</div>}
            {graphData && Array.isArray(graphData.nodes) && Array.isArray(graphData.relationships) && !isLoading && !error && (
              <>
                <SaveButton
                  title={isQuerySaved ? 'Remove from saved queries' : 'Save this query'}
                  onClick={handleSaveQuery}
                  style={{ 
                    color: isQuerySaved ? '#2563eb' : '#888',
                    opacity: isSaving || isDeleting ? 0.5 : 1,
                    cursor: isSaving || isDeleting ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isSaving || isDeleting}
                >
                  {isQuerySaved ? '★' : '☆'}
                </SaveButton>
                <div style={{ width: '100%', height: '100%' }}>
                  <GraphVisualization data={graphData} />
                </div>
              </>
            )}
            {!graphData && !isLoading && !error && !executedQuery && (
              <Welcome>
                <WelcomeTitle>Knowledge Graph Explorer</WelcomeTitle>
                <WelcomeSubtitle>How can I help you with your Drug Discovery Research today?</WelcomeSubtitle>
              </Welcome>
            )}
          </MainGraphArea>
          <QueryInputContainer>
            <QueryInput
              value={inputQuery}
              onChange={handleInputChange}
              onSearch={handleQueryExecute}
              disabled={isSearchDisabled}
            />
          </QueryInputContainer>
        </Content>
      </MainArea>
    </PageContainer>
  );
};

export default KGExplorer; 