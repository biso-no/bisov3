import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Election, ElectionSession, VotingItem, DetailedVoteResult } from '../actions';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  section: { marginBottom: 10 },
});

interface ElectionResultsPDFProps {
  election: Election;
  detailedResults: DetailedVoteResult[];
}

const ElectionResultsPDF: React.FC<ElectionResultsPDFProps> = ({ election, detailedResults }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{election.name} Results</Text>
      <Text style={styles.text}>Date: {election.date}</Text>
      <Text style={styles.text}>Campus: {election.campus}</Text>

      {election.sessions.map((session: ElectionSession) => (
        <View key={session.$id} style={styles.section}>
          <Text style={styles.subtitle}>{session.name}</Text>
          {session.votingItems.map((item: VotingItem) => (
            <View key={item.$id}>
              <Text style={styles.text}>{item.title}</Text>
              {item.options?.map((option) => {
                const votes = detailedResults.find(
                  (r) => r.votingItemId === item.$id && r.optionId === option.$id
                )?.voteCount || 0;
                return (
                  <Text key={option.$id} style={styles.text}>
                    {option.value}: {votes} votes
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default ElectionResultsPDF;

