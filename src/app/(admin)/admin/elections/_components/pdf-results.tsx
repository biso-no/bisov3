import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Election, ElectionSession, VotingItem, DetailedVoteResult } from '../actions';

// Register a custom font (you'll need to provide the font file)


const styles = StyleSheet.create({
  page: { 
    padding: 40,
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  subtitle: { 
    fontSize: 18, 
    marginBottom: 10,
    color: '#34495E',
    borderBottom: 1,
    paddingBottom: 5,
  },
  text: { 
    fontSize: 12, 
    marginBottom: 5,
    color: '#2C3E50',
  },
  section: { 
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2980B9',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  optionName: {
    width: '60%',
  },
  optionVotes: {
    width: '40%',
    textAlign: 'right',
  },
  totalVotes: {
    marginTop: 5,
    borderTop: 1,
    paddingTop: 5,
    fontWeight: 'bold',
  },
});

interface ElectionResultsPDFProps {
  election: Election;
  detailedResults: DetailedVoteResult[];
}

const ElectionResultsPDF: React.FC<ElectionResultsPDFProps> = ({ election, detailedResults }) => {
  const getTotalVotes = (itemId: string) => {
    return detailedResults
      .filter(result => result.votingItemId === itemId)
      .reduce((sum, result) => sum + result.voteCount, 0);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{election.name} Results</Text>
        <Text style={styles.text}>Date: {new Date(election.date).toLocaleDateString()}</Text>
        <Text style={styles.text}>Campus: {election.campus}</Text>

        {election.sessions.map((session: ElectionSession) => (
          <View key={session.$id} style={styles.section}>
            <Text style={styles.subtitle}>{session.name}</Text>
            {session.votingItems.map((item: VotingItem) => {
              const totalVotes = getTotalVotes(item.$id);
              return (
                <View key={item.$id} style={styles.section}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.options?.map((option) => {
                    const votes = detailedResults.find(
                      (r) => r.votingItemId === item.$id && r.optionId === option.$id
                    )?.voteCount || 0;
                    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                    return (
                      <View key={option.$id} style={styles.optionRow}>
                        <Text style={styles.optionName}>{option.value}</Text>
                        <Text style={styles.optionVotes}>
                          {votes} weighted votes ({percentage.toFixed(1)}%)
                        </Text>
                      </View>
                    );
                  })}
                  <Text style={styles.totalVotes}>
                    Total weighted votes: {totalVotes}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ElectionResultsPDF;