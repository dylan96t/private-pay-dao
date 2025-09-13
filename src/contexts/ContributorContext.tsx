import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Contributor {
  id: string;
  name: string;
  role: string;
  contributions: number;
  isEncrypted: boolean;
  joinDate: string;
  lastActive: string;
}

interface ContributorContextType {
  contributors: Contributor[];
  addContributor: (contributor: Omit<Contributor, 'id'>) => void;
  updateContributor: (id: string, updates: Partial<Contributor>) => void;
  removeContributor: (id: string) => void;
  incrementContributions: (id: string, amount?: number) => void;
}

const ContributorContext = createContext<ContributorContextType | undefined>(undefined);

export const useContributors = () => {
  const context = useContext(ContributorContext);
  if (!context) {
    throw new Error('useContributors must be used within a ContributorProvider');
  }
  return context;
};

const initialContributors: Contributor[] = [
  {
    id: '1',
    name: 'Alice Chen',
    role: 'Frontend Developer',
    contributions: 47,
    isEncrypted: true,
    joinDate: '2024-01-15',
    lastActive: '2024-03-10'
  },
  {
    id: '2',
    name: 'Bob Martinez',
    role: 'Smart Contract Developer',
    contributions: 32,
    isEncrypted: true,
    joinDate: '2024-01-20',
    lastActive: '2024-03-09'
  },
  {
    id: '3',
    name: 'Carol Kim',
    role: 'UI/UX Designer',
    contributions: 28,
    isEncrypted: true,
    joinDate: '2024-02-01',
    lastActive: '2024-03-08'
  },
  {
    id: '4',
    name: 'David Wilson',
    role: 'DevOps Engineer',
    contributions: 41,
    isEncrypted: true,
    joinDate: '2024-01-25',
    lastActive: '2024-03-10'
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    role: 'Product Manager',
    contributions: 35,
    isEncrypted: true,
    joinDate: '2024-02-10',
    lastActive: '2024-03-07'
  },
  {
    id: '6',
    name: 'Frank Zhang',
    role: 'Backend Developer',
    contributions: 39,
    isEncrypted: true,
    joinDate: '2024-02-05',
    lastActive: '2024-03-09'
  }
];

export const ContributorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);

  const addContributor = (contributorData: Omit<Contributor, 'id'>) => {
    const newContributor: Contributor = {
      ...contributorData,
      id: Date.now().toString(),
    };
    setContributors(prev => [...prev, newContributor]);
  };

  const updateContributor = (id: string, updates: Partial<Contributor>) => {
    setContributors(prev =>
      prev.map(contributor =>
        contributor.id === id
          ? { ...contributor, ...updates, lastActive: new Date().toISOString().split('T')[0] }
          : contributor
      )
    );
  };

  const removeContributor = (id: string) => {
    setContributors(prev => prev.filter(contributor => contributor.id !== id));
  };

  const incrementContributions = (id: string, amount = 1) => {
    updateContributor(id, {
      contributions: contributors.find(c => c.id === id)?.contributions + amount || amount
    });
  };

  return (
    <ContributorContext.Provider
      value={{
        contributors,
        addContributor,
        updateContributor,
        removeContributor,
        incrementContributions,
      }}
    >
      {children}
    </ContributorContext.Provider>
  );
};